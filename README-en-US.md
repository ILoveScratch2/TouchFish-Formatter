# TouchFish Formatter

**English | [简体中文](README.md)**

A Markdown formatter for competitive programming solutions and articles. It normalizes LaTeX math symbols, converts CJK punctuation, and unifies code style — all in one click.

## Features

- **Math formula formatting** — Converts non-standard LaTeX notation to canonical symbols, e.g.:
  - `<=` → `\le`, `>=` → `\ge`, `!=` → `\neq`
  - `->` → `\to`, `<-` → `\gets`, `=>` → `\Rightarrow`
  - `gcd` / `min` / `max` / `log` → corresponding LaTeX commands
  - `dp[i][j]` → `dp_{i,j}`
- **Full-width punctuation** — Replaces half-width punctuation (`,`, `.`, `:`, etc.) that follows CJK characters with their full-width equivalents
- **Diff view** — Visual side-by-side comparison of original and formatted text
- **Configurable rules** — Enable or disable individual rules in the Settings page
- **Dark / Light theme** — Toggle with a single click

## Usage

Paste your Markdown into the editor and click **Format**. Use the **Copy** button to write the result directly to the clipboard.

## Local Development

**Requirements**: Node.js

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Uses

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [MUI (Material UI)](https://mui.com/)
- [CodeMirror 6](https://codemirror.net/)
- [unified](https://unifiedjs.com/) / [remark](https://remark.js.org/)
- [i18next](https://www.i18next.com/)

## License

Licensed under [AGPL-3.0](LICENSE).
