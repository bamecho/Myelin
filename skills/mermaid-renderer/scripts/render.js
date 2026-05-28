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
  bg:            "#191919",
  fg:            "#ffffff",
  line:          "#a78bfa",
  accent:        "#7c5cfc",
  muted:         "#e0e0e0",
  surface:       "#2d2d3d",
  border:        "#7c5cfc",
};

// ─── Custom Theme: Magazine ──────────────────────────────────────────────────
// A sophisticated, high-contrast, editorial layout theme:
//   ivory paper background, dark ink text, sharp borders, deep burgundy accent.
const MAGAZINE_THEME = {
  bg:            "#fcfbf9", // warm ivory paper
  fg:            "#1c1d1f", // editorial ink
  line:          "#2c2d2f", // sharp thin borders/connectors
  accent:        "#8d2b32", // deep editorial burgundy
  muted:         "#6b6d70", // slate/charcoal secondary text
  surface:       "#f5f2eb", // elegant warm beige fill
  border:        "#1c1d1f", // sharp ink node borders
};

// ─── Default Preferences ─────────────────────────────────────────────────────

const DEFAULT_PREFERENCES = {
  _comment_theme:       "SVG theme name. Built-in: tokyo-night, dracula, zinc-dark, catppuccin-latte, etc. Or 'myelin-dark' (custom).",
  theme:                "magazine",

  _comment_font:        "Font family for SVG rendering.",
  font:                 "Playfair Display",

  _comment_transparent: "If true, SVG background is transparent.",
  transparent:          false,

  _comment_roundedEdges: "If true, SVG flowchart connector lines will have rounded corners.",
  roundedEdges:         true,

  _comment_padding:     "Canvas padding in px for SVG rendering.",
  padding:              45,

  _comment_nodeSpacing: "Horizontal spacing between sibling nodes for SVG flowchart rendering.",
  nodeSpacing:          36,

  _comment_layerSpacing: "Vertical spacing between layers for SVG flowchart rendering.",
  layerSpacing:         55,

  _comment_componentSpacing: "Spacing between disconnected components for SVG flowchart rendering.",
  componentSpacing:     32,

  _comment_asciiTheme:  "Theme name for ASCII/Unicode output. Falls back to theme if not set.",
  asciiTheme:           "myelin-dark",

  _comment_colorMode:   "Color mode for ASCII/Unicode: none, ansi16, ansi256, truecolor, html, auto.",
  colorMode:            "auto",

  _comment_paddingX:    "Horizontal padding for ASCII/Unicode output.",
  paddingX:             7,

  _comment_paddingY:    "Vertical padding for ASCII/Unicode output.",
  paddingY:             6,

  _comment_boxPadding:  "Box border padding for ASCII/Unicode output.",
  boxPadding:           2,
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
        stdio: ["ignore", "inherit", "inherit"],
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
 *   hardcoded defaults  →  global preferences.json → local preferences.json → env overrides
 *
 * If the file does not exist, it is auto-generated with annotated defaults.
 * If the file is malformed, a warning is printed and defaults are used.
 */
function loadPreferences() {
  const defaults = {};
  for (const key of PREFERENCE_KEYS) {
    defaults[key] = DEFAULT_PREFERENCES[key];
  }

  let globalPrefs = {};
  if (!existsSync(PREFERENCES_PATH)) {
    try {
      writeFileSync(PREFERENCES_PATH, JSON.stringify(DEFAULT_PREFERENCES, null, 2) + "\n", "utf8");
      console.error(`[mermaid-renderer] Generated default preferences at ${PREFERENCES_PATH}`);
    } catch (err) {
      console.warn(`[mermaid-renderer] Warning: Could not write default preferences: ${err.message}`);
    }
  } else {
    try {
      const raw = readFileSync(PREFERENCES_PATH, "utf8");
      globalPrefs = JSON.parse(raw);
    } catch (err) {
      console.warn(`[mermaid-renderer] Warning: Failed to read global preferences.json: ${err.message}`);
    }
  }

  // Merge defaults and global
  const merged = { ...defaults };
  for (const key of PREFERENCE_KEYS) {
    if (key in globalPrefs) {
      merged[key] = globalPrefs[key];
    }
  }

  // Load project-specific local preferences from CWD
  const localPaths = [
    path.join(process.cwd(), "preferences.json"),
    path.join(process.cwd(), ".mermaidrc.json"),
    path.join(process.cwd(), ".mermaidrc"),
  ];

  for (const localPath of localPaths) {
    if (localPath !== PREFERENCES_PATH && existsSync(localPath)) {
      try {
        const raw = readFileSync(localPath, "utf8");
        const localPrefs = JSON.parse(raw);
        console.error(`[mermaid-renderer] Loaded local preferences from ${localPath}`);
        if (path.basename(localPath) === "preferences.json") {
          console.warn(`[mermaid-renderer] Warning: Reading local preferences from generic 'preferences.json' is deprecated and may collide with other tools. Please rename this file to '.mermaidrc.json' or '.mermaidrc'.`);
        }
        for (const key of PREFERENCE_KEYS) {
          if (key in localPrefs) {
            merged[key] = localPrefs[key];
          }
        }
        break; // Only load the first found local config file
      } catch (err) {
        console.warn(`[mermaid-renderer] Warning: Failed to read local config at ${localPath}: ${err.message}`);
      }
    }
  }

  return merged;
}

/**
 * Apply environment variable overrides to preferences.
 * Environment variables must be prefixed with MERMAID_ (e.g. MERMAID_THEME=dracula).
 */
function applyEnvOverrides(prefs) {
  const envMap = {
    MERMAID_THEME:             { key: "theme", type: "string" },
    MERMAID_FONT:              { key: "font", type: "string" },
    MERMAID_TRANSPARENT:       { key: "transparent", type: "boolean" },
    MERMAID_ROUNDED_EDGES:     { key: "roundedEdges", type: "boolean" },
    MERMAID_PADDING:           { key: "padding", type: "number" },
    MERMAID_NODE_SPACING:      { key: "nodeSpacing", type: "number" },
    MERMAID_LAYER_SPACING:     { key: "layerSpacing", type: "number" },
    MERMAID_COMPONENT_SPACING: { key: "componentSpacing", type: "number" },
    MERMAID_ASCII_THEME:       { key: "asciiTheme", type: "string" },
    MERMAID_COLOR_MODE:        { key: "colorMode", type: "string" },
    MERMAID_PADDING_X:         { key: "paddingX", type: "number" },
    MERMAID_PADDING_Y:         { key: "paddingY", type: "number" },
    MERMAID_BOX_PADDING:       { key: "boxPadding", type: "number" },
  };

  for (const [envVar, { key, type }] of Object.entries(envMap)) {
    const val = process.env[envVar];
    if (val !== undefined) {
      if (type === "boolean") {
        prefs[key] = val.toLowerCase() === "true" || val === "1";
      } else if (type === "number") {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          prefs[key] = num;
        }
      } else {
        prefs[key] = val;
      }
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
  -c, --code <string>       Direct Mermaid diagram source code string to render.
  -o, --output <file>       Output file path. If omitted, writes to stdout.
      --append              Append to output file instead of overwriting. (requires -o)
  -f, --format <format>     Output format: 'svg', 'ascii', 'unicode'.
                            Inferred from --output extension when omitted:
                            '.svg' → 'svg', other/none → 'unicode'.

Rendering preferences are resolved in order (highest priority wins):
  1. Environment variables prefixed with MERMAID_ (e.g. MERMAID_THEME, MERMAID_FONT)
  2. Local project configuration: preferences.json, .mermaidrc.json, or .mermaidrc in process.cwd()
  3. Global configuration: ${PREFERENCES_PATH}
  4. Hardcoded defaults
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
        code:   { type: "string",  short: "c" },
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
    code:       values.code ?? null,
  };
}

// ─── Input ───────────────────────────────────────────────────────────────────

/**
 * Preprocess Mermaid source code to normalize semicolons into newlines
 * when they act as statement separators (outside of quotes, parens, brackets, and comments).
 */
function preprocessMermaidInput(text) {
  let result = "";
  let inQuote = false;
  let quoteChar = null;
  let inComment = false;
  
  let parenDepth = 0;
  let bracketDepth = 0;
  let braceDepth = 0;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prev = i > 0 ? text[i - 1] : null;
    const next = i < text.length - 1 ? text[i + 1] : null;
    
    // Newline ends comments and resets parsing state for the line
    if (char === "\n") {
      inComment = false;
      inQuote = false;
      quoteChar = null;
      parenDepth = 0;
      bracketDepth = 0;
      braceDepth = 0;
      result += char;
      continue;
    }
    
    if (inComment) {
      result += char;
      continue;
    }
    
    if (inQuote) {
      if (char === quoteChar && prev !== "\\") {
        inQuote = false;
        quoteChar = null;
      }
      result += char;
      continue;
    }
    
    // Detect comment start
    if (char === "%" && next === "%") {
      inComment = true;
      result += char;
      continue;
    }
    
    // Detect quote start
    if (char === "\"" || char === "'") {
      inQuote = true;
      quoteChar = char;
      result += char;
      continue;
    }
    
    // Track brackets/parentheses/braces
    if (char === "(") parenDepth++;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth++;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === "{") braceDepth++;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    
    // Semicolon separator
    if (char === ";") {
      if (parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        result += "\n";
        continue;
      }
    }
    
    result += char;
  }
  
  return result;
}

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
  if (themeName === "magazine") {
    return MAGAZINE_THEME;
  }
  if (THEMES && THEMES[themeName]) {
    return THEMES[themeName];
  }
  if (themeName) {
    console.warn(`Warning: Theme '${themeName}' not found. Using default colors.`);
  }
  return {};
}

function makeRoundedPath(points, radius = 8) {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)} L ${points[1].x.toFixed(2)},${points[1].y.toFixed(2)}`;
  }
  
  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;
    const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    
    if (len1 === 0 || len2 === 0) {
      d += ` L ${curr.x.toFixed(2)},${curr.y.toFixed(2)}`;
      continue;
    }
    
    const r = Math.min(radius, len1 / 2, len2 / 2);
    
    const startX = curr.x - (dx1 / len1) * r;
    const startY = curr.y - (dy1 / len1) * r;
    
    const endX = curr.x + (dx2 / len2) * r;
    const endY = curr.y + (dy2 / len2) * r;
    
    d += ` L ${startX.toFixed(2)},${startY.toFixed(2)} Q ${curr.x.toFixed(2)},${curr.y.toFixed(2)} ${endX.toFixed(2)},${endY.toFixed(2)}`;
  }
  
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)},${last.y.toFixed(2)}`;
  return d;
}

function postProcessSvgCurves(svg) {
  return svg.replace(/<polyline\s+([^>]*?)points="([^"]+)"([^>]*?)\/>/g, (match, before, pointsStr, after) => {
    if (!before.includes('class="edge"') && !after.includes('class="edge"')) {
      return match;
    }
    const points = pointsStr.trim().split(/\s+/).map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });
    const d = makeRoundedPath(points, 8);
    return `<path ${before}d="${d}"${after}/>`;
  });
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
    padding: prefs.padding,
    nodeSpacing: prefs.nodeSpacing,
    layerSpacing: prefs.layerSpacing,
    componentSpacing: prefs.componentSpacing,
    ...themeColors,
  };
  try {
    const rawSvg = renderMermaidSVG(input, svgOpts);
    if (prefs.roundedEdges !== false) {
      return postProcessSvgCurves(rawSvg);
    }
    return rawSvg;
  } catch (err) {
    console.error(`SVG render failed: ${err.message}`);
    process.exit(EXIT_RUNTIME_ERROR);
  }
}

function parseHex(hex) {
  let cleaned = hex.slice(1);
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function mixColors(fg, bg, pct) {
  if (!fg || !bg) return undefined;
  try {
    const f = parseHex(fg), b = parseHex(bg);
    const mix = (a, z) => Math.round(a * (pct / 100) + z * (1 - pct / 100));
    const r = mix(f.r, b.r), g = mix(f.g, b.g), bl = mix(f.b, b.b);
    return '#' + [r, g, bl].map(c => c.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return fg;
  }
}

function deriveAsciiTheme(colors) {
  if (!colors.fg || !colors.bg) return {};
  const line = colors.line ?? mixColors(colors.fg, colors.bg, 50);
  const border = colors.border ?? mixColors(colors.fg, colors.bg, 20);
  return {
    fg:       colors.fg,
    border,
    line,
    arrow:    colors.accent ?? mixColors(colors.fg, colors.bg, 85),
    accent:   colors.accent,
    bg:       colors.bg,
    corner:   line,
    junction: border,
  };
}

/**
 * Render mermaid source to ASCII or Unicode text.
 * @param {string} input   Raw mermaid diagram text.
 * @param {object} prefs   Loaded preferences.
 * @param {string} format  "ascii" or "unicode".
 * @param {object} lib     Library exports (renderMermaidASCII, THEMES)
 */
function renderText(input, prefs, format, lib) {
  const { renderMermaidASCII, THEMES } = lib;
  const themeName = prefs.asciiTheme || prefs.theme;
  const themeColors = resolveTheme(themeName, THEMES);
  const theme = deriveAsciiTheme(themeColors);

  const textOpts = {
    useAscii:        format === "ascii",
    colorMode:       prefs.colorMode,
    paddingX:        prefs.paddingX,
    paddingY:        prefs.paddingY,
    boxBorderPadding: prefs.boxPadding,
    theme,
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

// ─── Validation ──────────────────────────────────────────────────────────────

/**
 * Validate that preferences conform to expected types and values.
 * Exits with EXIT_USER_ERROR if any preference is invalid.
 */
function validatePreferences(prefs) {
  const stringFields = ["theme", "asciiTheme", "font"];
  const booleanFields = ["transparent", "roundedEdges"];
  const numericFields = [
    "padding",
    "nodeSpacing",
    "layerSpacing",
    "componentSpacing",
    "paddingX",
    "paddingY",
    "boxPadding"
  ];
  const colorModeEnum = new Set(["none", "ansi16", "ansi256", "truecolor", "html", "auto"]);

  for (const field of stringFields) {
    if (prefs[field] !== undefined && typeof prefs[field] !== "string") {
      console.error(`Error: Preference '${field}' must be a string. Received: ${JSON.stringify(prefs[field])}`);
      process.exit(EXIT_USER_ERROR);
    }
  }

  for (const field of booleanFields) {
    if (prefs[field] !== undefined && typeof prefs[field] !== "boolean") {
      console.error(`Error: Preference '${field}' must be a boolean. Received: ${JSON.stringify(prefs[field])}`);
      process.exit(EXIT_USER_ERROR);
    }
  }

  for (const field of numericFields) {
    const val = prefs[field];
    if (val !== undefined) {
      if (typeof val !== "number" || !Number.isFinite(val) || val < 0) {
        console.error(`Error: Preference '${field}' must be a finite non-negative number. Received: ${JSON.stringify(val)}`);
        process.exit(EXIT_USER_ERROR);
      }
    }
  }

  if (prefs.colorMode !== undefined) {
    if (!colorModeEnum.has(prefs.colorMode)) {
      console.error(`Error: Preference 'colorMode' must be one of: none, ansi16, ansi256, truecolor, html, auto. Received: ${JSON.stringify(prefs.colorMode)}`);
      process.exit(EXIT_USER_ERROR);
    }
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Parse arguments (slim: only output, format, append)
  const opts = parseCliArgs(process.argv.slice(2));

  // 2. Load rendering preferences (theme, font, colors, padding, …)
  const prefs = loadPreferences();
  applyEnvOverrides(prefs);
  validatePreferences(prefs);

  // 3. Load library (auto-install on first run)
  const lib = await ensureDependencies();

  // 4. Read input
  let rawInput = opts.code !== null ? opts.code : await readInput(opts.inputFile);
  // Normalize Windows-style carriage returns (\r) to prevent layout/alignment offsets
  rawInput = rawInput.replace(/\r/g, "");
  if (!rawInput.trim()) {
    console.error("Error: Input is empty.");
    process.exit(EXIT_USER_ERROR);
  }

  // Preprocess input to handle semicolons as separators
  const input = preprocessMermaidInput(rawInput);
  if (!input.trim()) {
    console.error("Error: Input is empty after preprocessing.");
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
