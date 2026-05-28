---
name: mermaid-renderer
description: Render Mermaid diagrams directly to the console as ASCII/Unicode art or save them as SVGs. Use this skill when the user wants to visualize Mermaid flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, or XY charts. Always trigger this skill when the user wants to draw a diagram, view a flowchart in the terminal, render Mermaid code, or convert a diagram into ASCII/Unicode console text or SVG.
---

# Mermaid Renderer

This skill renders Mermaid flowchart/diagram syntax directly in the terminal as ASCII/Unicode art, or generates themed SVG images.

> **Path Convention**: All paths in this document use `${SKILL_DIR}` to refer to the directory containing this SKILL.md file. When executing commands, resolve it to the actual absolute path of this skill's installation directory.

## Quality Workflow and Verification Gates

To ensure high-quality and readable diagrams, you MUST adhere to the following workflow and pass the validation gates:

### 1. Pre-Rendering Design Gates (设计规约)
- **Identify Intent**: Clearly determine the diagram's primary purpose and target audience.
- **Select Family Intentionally**: Choose the appropriate diagram type (e.g., `flowchart` for logical flows, `sequenceDiagram` for interactions, `stateDiagram-v2` for state transitions, `classDiagram` for structure, `erDiagram` for data models, or `xychart-beta` for metrics).
- **Maintain Semantics**: Do not lose critical entities, relationships, labels, or flow directionality during translation to Mermaid syntax.
- **Manage Complexity**: If a diagram is too dense or complex, split it into multiple smaller sub-diagrams rather than forcing an unreadable, massive single diagram.

### 2. Execution and Rendering (运行与渲染)
- Pipe the Mermaid source code directly to `render.js` to render the diagram before including it in your final response:
  ```bash
  echo "graph TD; A --> B;" | node ${SKILL_DIR}/scripts/render.js
  ```
- **Verification after modifying the renderer**: If you modify the renderer codebase, you MUST run the automated smoke harness to verify that no regressions were introduced:
  ```bash
  npm run smoke --prefix ${SKILL_DIR}/scripts
  ```

### 3. Post-Rendering Quality Gates (输出校验)
- **Visual Inspection**: Check the generated output (whether Unicode, ASCII, or SVG). Are the node borders intact? Are lines overlapping or messy?
- **Label Integrity**: Ensure all semantic labels and text (e.g. node text, transition labels) are fully visible in the output and have not disappeared or been truncated.
- **Self-Correction (Self-Repair)**: If rendering fails, or if key semantic labels are missing, analyze the error/output, fix the source syntax, and run the rendering command again. Do this correction cycle at least once before reporting failure.

---

## Technical CLI Usage

### Basic Commands

```bash
# Display Unicode art directly in the terminal (default format)
echo "graph TD; A --> B; B --> C;" | node ${SKILL_DIR}/scripts/render.js

# Display plain ASCII art directly in the terminal
echo "graph TD; A --> B; B --> C;" | node ${SKILL_DIR}/scripts/render.js -f ascii

# Render from a file to standard output
node ${SKILL_DIR}/scripts/render.js diagram.mmd
```

### Options

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
3. **Global Config**: Reads `${SKILL_DIR}/preferences.json` (auto-generated on first run).
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
