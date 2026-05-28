import { readFileSync, appendFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { parseArgs } from "util";
import path from "path";

// ─── Constants ───────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_DIR = path.resolve(__dirname, "..");
const PREFERENCES_PATH = path.join(SKILL_DIR, "preferences.json");

// Exit codes:
//   0 – success
//   1 – user error  (bad args, missing input, …)
//   2 – runtime error (render failure, file I/O error, install failure, …)
const EXIT_USER_ERROR = 1;
const EXIT_RUNTIME_ERROR = 2;

// ─── Custom Theme: Myelin Dark ───────────────────────────────────────────────
// Based on the project's Notion-inspired DESIGN.md palette:
//   navy backgrounds, purple accents, white/light text.

const MYELIN_DARK_THEME = {
  background:    "#191919",
  primaryColor:  "#2d2d3d",
  primaryBorderColor: "#7c5cfc",
  primaryTextColor:   "#ffffff",
  lineColor:     "#a78bfa",
  secondaryColor:     "#1e1e2e",
  tertiaryColor:      "#2a2a3a",
  textColor:     "#e0e0e0",
  mainBkg:       "#2d2d3d",
  nodeBorder:    "#7c5cfc",
  clusterBkg:    "#1e1e2e",
  clusterBorder: "#7c5cfc",
  titleColor:    "#ffffff",
  edgeLabelBackground: "#191919",
};

// ─── Default Preferences ─────────────────────────────────────────────────────

const DEFAULT_PREFERENCES = {
  _comment_theme:       "SVG theme name. Built-in: tokyo-night, dracula, zinc-dark, catppuccin-latte, etc. Or 'myelin-dark' (custom).",
  theme:                "myelin-dark",

  _comment_font:        "Font family for SVG rendering.",
  font:                 "Inter",

  _comment_transparent: "If true, SVG background is transparent.",
  transparent:          false,

  _comment_colorMode:   "Color mode for ASCII/Unicode: none, ansi16, ansi256, truecolor, html, auto.",
  colorMode:            "auto",

  _comment_paddingX:    "Horizontal padding for ASCII/Unicode output.",
  paddingX:             5,

  _comment_paddingY:    "Vertical padding for ASCII/Unicode output.",
  paddingY:             5,

  _comment_boxPadding:  "Box border padding for ASCII/Unicode output.",
  boxPadding:           1,
};

// Keys that carry actual config (filter out _comment_* keys).
const PREFERENCE_KEYS = Object.keys(DEFAULT_PREFERENCES).filter((k) => !k.startsWith("_comment_"));

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

// ─── Preferences ─────────────────────────────────────────────────────────────

/**
 * Load rendering preferences from preferences.json.
 *
 * Resolution order:
 *   hardcoded defaults  →  preferences.json overrides
 *
 * If the file does not exist, it is auto-generated with annotated defaults.
 * If the file is malformed, a warning is printed and defaults are used.
 */
function loadPreferences() {
  const defaults = {};
  for (const key of PREFERENCE_KEYS) {
    defaults[key] = DEFAULT_PREFERENCES[key];
  }

  if (!existsSync(PREFERENCES_PATH)) {
    try {
      writeFileSync(PREFERENCES_PATH, JSON.stringify(DEFAULT_PREFERENCES, null, 2) + "\n", "utf8");
      console.error(`[mermaid-renderer] Generated default preferences at ${PREFERENCES_PATH}`);
    } catch (err) {
      console.warn(`[mermaid-renderer] Warning: Could not write default preferences: ${err.message}`);
    }
    return defaults;
  }

  try {
    const raw = readFileSync(PREFERENCES_PATH, "utf8");
    const parsed = JSON.parse(raw);

    // Warn on unknown keys (ignoring _comment_* fields).
    for (const key of Object.keys(parsed)) {
      if (!key.startsWith("_comment_") && !PREFERENCE_KEYS.includes(key)) {
        console.warn(`[mermaid-renderer] Warning: Unknown preference key '${key}' in preferences.json — ignored.`);
      }
    }

    // Merge: defaults ← file values (only known keys).
    for (const key of PREFERENCE_KEYS) {
      if (key in parsed) {
        defaults[key] = parsed[key];
      }
    }
    return defaults;
  } catch (err) {
    console.warn(`[mermaid-renderer] Warning: Failed to read preferences.json: ${err.message}. Using defaults.`);
    return defaults;
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

Rendering preferences (theme, font, colors, padding, etc.) are loaded from:
  ${PREFERENCES_PATH}

The preferences file is auto-generated on first run.
Edit it to customize rendering defaults.
`;

const SUPPORTED_FORMATS = new Set(["svg", "ascii", "unicode"]);

function parseCliArgs(argv) {
  let parsed;
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        help:   { type: "boolean", short: "h", default: false },
        output: { type: "string",  short: "o" },
        append: { type: "boolean",              default: false },
        format: { type: "string",  short: "f" },
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

  // Validate --append requires --output
  if (values.append && !values.output) {
    console.error("--append requires --output to be specified.");
    process.exit(EXIT_USER_ERROR);
  }

  return {
    inputFile:  positionals[0] ?? null,
    outputFile: values.output ?? null,
    append:     values.append,
    format:     values.format ?? null,
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
 * Resolve the theme options object for SVG rendering.
 * If the preference theme is "myelin-dark", use the custom theme.
 * Otherwise, look it up in the library's built-in THEMES.
 */
function resolveTheme(themeName, THEMES) {
  if (themeName === "myelin-dark") {
    return MYELIN_DARK_THEME;
  }
  if (THEMES && THEMES[themeName]) {
    return THEMES[themeName];
  }
  if (themeName) {
    console.warn(`Warning: Theme '${themeName}' not found. Using default colors.`);
  }
  return {};
}

/**
 * Render mermaid source to SVG.
 * @param {string} input  Raw mermaid diagram text.
 * @param {object} prefs  Loaded preferences.
 * @param {object} lib    { renderMermaidSVG, THEMES }
 */
function renderSVG(input, prefs, { renderMermaidSVG, THEMES }) {
  const themeColors = resolveTheme(prefs.theme, THEMES);
  const svgOpts = {
    transparent: prefs.transparent,
    font: prefs.font,
    ...themeColors,
  };
  try {
    return renderMermaidSVG(input, svgOpts);
  } catch (err) {
    console.error(`SVG render failed: ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

/**
 * Render mermaid source to ASCII or Unicode text.
 * @param {string} input   Raw mermaid diagram text.
 * @param {object} prefs   Loaded preferences.
 * @param {string} format  "ascii" or "unicode".
 * @param {object} lib     { renderMermaidASCII }
 */
function renderText(input, prefs, format, { renderMermaidASCII }) {
  const textOpts = {
    useAscii:        format === "ascii",
    colorMode:       prefs.colorMode,
    paddingX:        prefs.paddingX,
    paddingY:        prefs.paddingY,
    boxBorderPadding: prefs.boxPadding,
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
  // 1. Parse arguments (slim: only output, format, append)
  const opts = parseCliArgs(process.argv.slice(2));

  // 2. Load rendering preferences (theme, font, colors, padding, …)
  const prefs = loadPreferences();

  // 3. Load library (auto-install on first run)
  const lib = await ensureDependencies();

  // 4. Read input
  const input = await readInput(opts.inputFile);
  if (!input.trim()) {
    console.error("Error: Input is empty.");
    process.exit(EXIT_USER_ERROR);
  }

  // 5. Resolve format: CLI flag > output extension > default (unicode)
  const format = opts.format
    ?? (opts.outputFile?.endsWith(".svg") ? "svg" : "unicode");

  // 6. Render
  const result = format === "svg"
    ? renderSVG(input, prefs, lib)
    : renderText(input, prefs, format, lib);

  // 7. Write output
  writeOutput(result, opts.outputFile, opts.append);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(EXIT_RUNTIME_ERROR);
});
