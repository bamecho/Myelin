---
name: mermaid-renderer
description: Render Mermaid diagram source code into beautiful SVGs or ASCII/Unicode art. Use this skill when the user wants to convert Mermaid flowcharts, sequence diagrams, class diagrams, state diagrams, ER diagrams, or XY charts into files (SVG, ASCII, TXT) or display them as text in the console. Always trigger this skill when the user mentions rendering a mermaid diagram, generating a flowchart image/text, converting mermaid to SVG, drawing a sequence/state diagram, or visualizing graphs/charts in the workspace or terminal.
---

# Mermaid Renderer

This skill converts Mermaid flowchart/diagram code to beautiful SVG images or ASCII/Unicode text representations.

## Setup

Dependencies are managed via `scripts/package.json`. On first run the script
automatically detects if `beautiful-mermaid` is missing and installs it with
`npm install` (scoped to the `scripts/` directory), so **no manual setup is
required**.

If you prefer to pre-install the dependency manually:

```bash
npm install --prefix /home/user/agents-hub/Myelin/skills/mermaid-renderer/scripts
```

## How to use the skill

Run the Node.js command line utility to render a Mermaid diagram:

```bash
node /home/user/agents-hub/Myelin/skills/mermaid-renderer/scripts/render.js [options] <input-file>
```

### Options

- `-o, --output <file>`: Output file path. If omitted, writes to standard output.
- `-f, --format <ascii|unicode|svg>`: Force output format:
  - `svg`: Renders a themed SVG string.
  - `ascii`: Renders plain ASCII layout using simple characters (`+`, `-`, `|`, `>`).
  - `unicode`: Renders Unicode box-drawing character layout (`┌`, `─`, `│`, `►`).
- `--append`: Append to the output file instead of overwriting (requires `-o`).

### Preferences

Rendering preferences (theme, font, colors, padding) are stored in
`/home/user/agents-hub/Myelin/skills/mermaid-renderer/preferences.json`.

The file is **auto-generated with annotated defaults** on first run.
Edit it to customize rendering behavior without passing CLI flags.

| Key | Type | Default | Description |
|---|---|---|---|
| `theme` | string | `"myelin-dark"` | SVG theme. Built-in: `tokyo-night`, `dracula`, `zinc-dark`, etc. `myelin-dark` is a custom theme matching the project palette. |
| `font` | string | `"Inter"` | Font family for SVG rendering. |
| `transparent` | boolean | `false` | If `true`, SVG background is transparent. |
| `colorMode` | string | `"auto"` | Color mode for ASCII/Unicode: `none`, `ansi16`, `ansi256`, `truecolor`, `html`, `auto`. |
| `paddingX` | number | `5` | Horizontal padding for ASCII/Unicode output. |
| `paddingY` | number | `5` | Vertical padding for ASCII/Unicode output. |
| `boxPadding` | number | `1` | Box border padding for ASCII/Unicode output. |

### Examples

```bash
# Render SVG to file (uses theme/font/etc. from preferences.json)
echo 'graph TD; A-->B; B-->C;' | node render.js -f svg -o diagram.svg

# Render Unicode to stdout
node render.js -f unicode flowchart.mmd

# Render ASCII to stdout
echo 'graph LR; A-->B;' | node render.js -f ascii

# Append output to an existing file
node render.js -f unicode -o output.txt --append flowchart.mmd
```
