---
name: mermaid-renderer
description: Render Mermaid diagrams directly to the console as ASCII/Unicode art or save them as SVGs. Use this skill when the user wants to visualize Mermaid flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, or XY charts. Always trigger this skill when the user wants to draw a diagram, view a flowchart in the terminal, render Mermaid code, or convert a diagram into ASCII/Unicode console text or SVG.
---

# Mermaid Renderer

This skill renders Mermaid flowchart/diagram syntax directly in the terminal as ASCII/Unicode art, or generates themed SVG images.

> **Path Convention**: All paths in this document use `__SKILL_DIR__` as a placeholder for the directory containing this SKILL.md file. Before executing any command, you **MUST** replace `__SKILL_DIR__` with the actual absolute path of this skill's installation directory (i.e. the parent directory of this SKILL.md file). **Do NOT** pass `__SKILL_DIR__` literally into shell commands — it is not a shell variable and will not be resolved automatically.

## Quality Workflow and Verification Gates

To ensure high-quality and readable diagrams, you MUST adhere to the following workflow and pass the validation gates:

### 1. Pre-Rendering Design Gates (设计规约)
- **Identify Intent**: Clearly determine the diagram's primary purpose and target audience.
- **Select Family Intentionally**: Choose the appropriate diagram type (e.g., `flowchart` for logical flows, `sequenceDiagram` for interactions, `stateDiagram-v2` for state transitions, `classDiagram` for structure, `erDiagram` for data models, or `xychart-beta` for metrics).
- **Maintain Semantics**: Do not lose critical entities, relationships, labels, or flow directionality during translation to Mermaid syntax.
- **Manage Complexity**: If a diagram is too dense or complex, split it into multiple smaller sub-diagrams rather than forcing an unreadable, massive single diagram.

### 2. Execution and Rendering (运行与渲染)
- **Recommended Way (Best for Windows and Complex/Multiline Diagrams)**: Pass the Mermaid source code directly using the `-c` or `--code` argument. This avoids writing temporary files and avoids Windows pipe/redirection issues like `stdin is not a tty`:
  ```bash
  node __SKILL_DIR__/scripts/render.js -c "graph TD; A --> B;"
  ```
- **Windows Alignment & Line Offset Tip**: In Windows terminals (CMD, PowerShell), certain Unicode characters (like `▼`, `►`, and box-drawing lines) may render with inconsistent character widths in local fonts, causing line segments or arrows to look misaligned or offset. **To resolve line offsets on Windows, append `-f ascii`** to force standard, single-width ASCII characters for drawing the diagram:
  ```bash
  node __SKILL_DIR__/scripts/render.js -c "graph TD; A --> B;" -f ascii
  ```
- Alternatively, you can read from a file by specifying the file path:
  ```bash
  node __SKILL_DIR__/scripts/render.js path/to/diagram.mmd
  ```
- Or pipe simple single-line diagrams via standard input (less recommended on Windows):
  ```bash
  echo "graph TD; A --> B;" | node __SKILL_DIR__/scripts/render.js
  ```
- **Verification after modifying the renderer**: If you modify the renderer codebase, you MUST run the automated smoke harness to verify that no regressions were introduced:
  ```bash
  npm run smoke --prefix __SKILL_DIR__/scripts
  ```

### 3. Post-Rendering Quality Gates (输出校验)
- **Visual Inspection**: Check the generated output (whether Unicode, ASCII, or SVG). Are the node borders intact? Are lines overlapping or messy?
- **Label Integrity**: Ensure all semantic labels and text (e.g. node text, transition labels) are fully visible in the output and have not disappeared or been truncated.
- **Self-Correction (Self-Repair)**: If rendering fails, or if key semantic labels are missing, analyze the error/output, fix the source syntax, and run the rendering command again. Do this correction cycle at least once before reporting failure.

---

## Technical CLI Usage

### Basic Commands

```bash
# Display Unicode art directly using code argument (Recommended)
node __SKILL_DIR__/scripts/render.js -c "graph TD; A --> B; B --> C;"

# Render from a file to standard output
node __SKILL_DIR__/scripts/render.js diagram.mmd

# Display plain ASCII art directly using code argument
node __SKILL_DIR__/scripts/render.js -c "graph TD; A --> B; B --> C;" -f ascii
```

### Options

- `-c, --code <string>`: Direct Mermaid diagram source code string to render.
- `-o, --output <file>`: Output file path. If omitted, writes to standard output.
- `-f, --format <ascii|unicode|svg>`: Force output format:
  - `unicode`: (Default) Renders Unicode box-drawing character layout (`┌`, `─`, `│`, `►`).
  - `ascii`: Renders plain ASCII layout using simple characters (`+`, `-`, `|`, `>`).
  - `svg`: Renders a themed SVG string.
- `--append`: Append to the output file instead of overwriting (requires `-o`).

### Preferences and Configuration

Preferences (theme, font, dimensions, padding) are resolved in the following priority order (highest priority wins):

1. **Environment Variables**: E.g., `MERMAID_THEME=dracula`, `MERMAID_FONT=Inter`, `MERMAID_ROUNDED_EDGES=false`.
2. **Local Project Config**: Reads `preferences.json`, `.mermaidrc.json`, or `.mermaidrc` in the current working directory.
   - *Note: Reading from a local `preferences.json` is deprecated and will emit a warning. Prefer renaming the file to `.mermaidrc.json` or `.mermaidrc` to avoid collision.*
3. **Global Config**: Reads `__SKILL_DIR__/preferences.json` (auto-generated on first run).
4. **Defaults**: Hardcoded script defaults.

The preferences schema:

| Key | Type | Default | Description |
|---|---|---|---|
| `theme` | string | `"magazine"` | SVG theme. Built-in: `tokyo-night`, `dracula`, `zinc-dark`, etc. Or `"myelin-dark"`. |
| `font` | string | `"Playfair Display"` | Font family for SVG rendering. |
| `transparent` | boolean | `false` | If `true`, SVG background is transparent. |
| `roundedEdges` | boolean | `true` | If `true`, flowchart connections have rounded corners in SVG. |
| `asciiTheme` | string | `"myelin-dark"` | Theme name for ASCII/Unicode console output. |
| `colorMode` | string | `"auto"` | Color mode: `none`, `ansi16`, `ansi256`, `truecolor`, `html`, `auto`. |
| `paddingX` | number | `7` | Horizontal padding for ASCII/Unicode. |
| `paddingY` | number | `6` | Vertical padding for ASCII/Unicode. |
| `boxPadding` | number | `2` | Box border padding for ASCII/Unicode. |
