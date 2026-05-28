import { readFileSync, appendFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
import path from "path";

// ─── Constants ───────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Exit codes:
//   0 – success
//   1 – user error  (bad args, missing input, unknown option, …)
//   2 – runtime error (render failure, file I/O error, install failure, …)
const EXIT_USER_ERROR = 1;
const EXIT_RUNTIME_ERROR = 2;

// ─── Dependency bootstrap ────────────────────────────────────────────────────

/**
 * Ensure `beautiful-mermaid` is available, installing it on first run if needed.
 * Returns the module's exports { renderMermaidSVG, renderMermaidASCII, THEMES }.
 */
async function ensureDependencies() {
  try {
    return await import("beautiful-mermaid");
  } catch (err) {
    if (err.code !== "ERR_MODULE_NOT_FOUND" && err.code !== "MODULE_NOT_FOUND") {
      throw err;
    }
    console.error("[mermaid-renderer] 'beautiful-mermaid' not found. Installing dependencies...");
    try {
      execSync(`npm install --prefix ${JSON.stringify(__dirname)}`, {
        stdio: "inherit",
        cwd: __dirname,
      });
      console.error("[mermaid-renderer] Installation complete. Retrying import...");
      return await import("beautiful-mermaid");
    } catch (installErr) {
      console.error("[mermaid-renderer] Failed to install 'beautiful-mermaid':", installErr.message);
      process.exit(EXIT_RUNTIME_ERROR);
    }
  }
}

// ─── Argument parsing ────────────────────────────────────────────────────────

const HELP_TEXT = `
Usage: node render.js [options] [input-file | -]

Input:
  [input-file]              Path to a .mmd file. Omit (or use '-') to read from stdin.

Options:
  -h, --help                Show this help message.
  -o, --output <file>       Output file path. If omitted, writes to stdout.
      --append              Append to output file instead of overwriting. (requires -o)
  -f, --format <format>     Output format: 'svg', 'ascii', 'unicode'.
                            Inferred from --output extension when omitted:
                            '.svg' → 'svg', other/none → 'unicode'.
  -t, --theme <theme>       SVG theme: 'tokyo-night', 'dracula', 'zinc-dark', etc.
  -u, --use-ascii           Use ASCII box-drawing (+, -, |, >) instead of Unicode.
  -c, --color-mode <mode>   Color mode for ASCII/Unicode:
                            'none', 'ansi16', 'ansi256', 'truecolor', 'html', 'auto'.
                            Default: 'auto'.
      --transparent         Make SVG background transparent.
      --font <name>         Font family for SVG. Default: 'Inter'.
      --padding-x <n>       ASCII horizontal padding. Default: 5.
      --padding-y <n>       ASCII vertical padding. Default: 5.
      --box-padding <n>     ASCII box border padding. Default: 1.
`;

const SUPPORTED_COLOR_MODES = new Set(["auto", "none", "ansi16", "ansi256", "truecolor", "html"]);
const SUPPORTED_FORMATS = new Set(["svg", "ascii", "unicode"]);

function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        help:         { type: "boolean", short: "h", default: false },
        output:       { type: "string",  short: "o" },
        append:       { type: "boolean",              default: false },
        format:       { type: "string",  short: "f" },
        theme:        { type: "string",  short: "t" },
        "use-ascii":  { type: "boolean", short: "u", default: false },
        "color-mode": { type: "string",  short: "c", default: "auto" },
        transparent:  { type: "boolean",              default: false },
        font:         { type: "string",               default: "Inter" },
        "padding-x":  { type: "string" },
        "padding-y":  { type: "string" },
        "box-padding":{ type: "string" },
      },
    });
  } catch (err) {
    console.error(`Argument error: ${err.message}`);
    process.exit(EXIT_USER_ERROR);
  }

  const { values, positionals } = parsed;

  // --help
  if (values.help) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  // Validate --format
  if (values.format !== undefined) {
    const f = values.format.toLowerCase();
    if (!SUPPORTED_FORMATS.has(f)) {
      console.error(`Invalid --format: '${values.format}'. Expected: svg, ascii, unicode.`);
      process.exit(EXIT_USER_ERROR);
    }
    values.format = f;
  }

  // Validate --color-mode
  const colorMode = values["color-mode"];
  if (!SUPPORTED_COLOR_MODES.has(colorMode)) {
    console.error(`Invalid --color-mode: '${colorMode}'. Expected: ${[...SUPPORTED_COLOR_MODES].join(", ")}.`);
    process.exit(EXIT_USER_ERROR);
  }

  // Validate --append requires --output
  if (values.append && !values.output) {
    console.error("--append requires --output to be specified.");
    process.exit(EXIT_USER_ERROR);
  }

  // Validate integer options
  function parseIntOption(name) {
    const raw = values[name];
    if (raw === undefined) return undefined;
    const n = parseInt(raw, 10);
    if (Number.isNaN(n)) {
      console.error(`Invalid integer for --${name}: '${raw}'.`);
      process.exit(EXIT_USER_ERROR);
    }
    return n;
  }

  return {
    inputFile: positionals[0] ?? null,
    outputFile: values.output ?? null,
    append: values.append,
    format: values.format ?? null,
    theme: values.theme ?? null,
    useAscii: values["use-ascii"],
    colorMode,
    transparent: values.transparent,
    font: values.font,
    paddingX: parseIntOption("padding-x"),
    paddingY: parseIntOption("padding-y"),
    boxPadding: parseIntOption("box-padding"),
  };
}

// ─── Input ───────────────────────────────────────────────────────────────────

/**
 * Read mermaid source from a file path or from stdin ("-" / null).
 */
async function readInput(inputFile) {
  if (!inputFile || inputFile === "-") {
    return new Promise((resolve) => {
      let data = "";
      process.stdin.on("data", (chunk) => { data += chunk; });
      process.stdin.on("end", () => resolve(data));
    });
  }
  try {
    return readFileSync(inputFile, "utf8");
  } catch (err) {
    console.error(`Failed to read input file '${inputFile}': ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

// ─── Renderers ───────────────────────────────────────────────────────────────

/**
 * Render mermaid source to SVG.
 * @param {string} input  Raw mermaid diagram text.
 * @param {object} opts   Parsed CLI options.
 * @param {object} lib    { renderMermaidSVG, THEMES }
 */
function renderSVG(input, opts, { renderMermaidSVG, THEMES }) {
  const svgOpts = {
    transparent: opts.transparent,
    font: opts.font,
  };
  if (opts.theme) {
    const selectedTheme = THEMES[opts.theme];
    if (selectedTheme) {
      Object.assign(svgOpts, selectedTheme);
    } else {
      console.warn(`Warning: Theme '${opts.theme}' not found. Using default colors.`);
    }
  }
  try {
    return renderMermaidSVG(input, svgOpts);
  } catch (err) {
    console.error(`SVG render failed: ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

/**
 * Render mermaid source to ASCII or Unicode text.
 * @param {string} input  Raw mermaid diagram text.
 * @param {object} opts   Parsed CLI options.
 * @param {object} lib    { renderMermaidASCII }
 */
function renderText(input, opts, { renderMermaidASCII }) {
  const textOpts = {
    useAscii: opts.useAscii || opts.format === "ascii",
    colorMode: opts.colorMode,
    paddingX: opts.paddingX,
    paddingY: opts.paddingY,
    boxBorderPadding: opts.boxPadding,
  };
  try {
    return renderMermaidASCII(input, textOpts);
  } catch (err) {
    console.error(`Text render failed: ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

// ─── Output ──────────────────────────────────────────────────────────────────

/**
 * Write result to stdout or a file (overwrite by default, append with --append).
 */
function writeOutput(result, outputFile, append) {
  if (!outputFile) {
    process.stdout.write(result + "\n");
    return;
  }
  try {
    if (append) {
      appendFileSync(outputFile, result + "\n", "utf8");
    } else {
      writeFileSync(outputFile, result, "utf8");
    }
  } catch (err) {
    console.error(`Failed to write output to '${outputFile}': ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Parse arguments
  const opts = parseCliArgs(process.argv.slice(2));

  // 2. Load library (auto-install on first run)
  const lib = await ensureDependencies();

  // 3. Read input
  const input = await readInput(opts.inputFile);
  if (!input.trim()) {
    console.error("Error: Input is empty.");
    process.exit(EXIT_USER_ERROR);
  }

  // 4. Resolve format
  const format = opts.format
    ?? (opts.outputFile?.endsWith(".svg") ? "svg" : opts.useAscii ? "ascii" : "unicode");

  // 5. Render
  const result = format === "svg"
    ? renderSVG(input, opts, lib)
    : renderText(input, { ...opts, format }, lib);

  // 6. Write output
  writeOutput(result, opts.outputFile, opts.append);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(EXIT_RUNTIME_ERROR);
});
