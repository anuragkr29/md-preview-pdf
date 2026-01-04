/**
 * VS Code Dark Theme CSS
 * Replicates the VS Code markdown preview dark styling
 */

export const vscodeDarkTheme = `
/* VS Code Dark Markdown CSS */
html,
body {
  background-color: #1e1e1e;
}

.markdown-body {
  margin: 0;
  padding: 1.5em 1em;
  color: #d4d4d4;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", system-ui, "Ubuntu", "Droid Sans", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body > *:first-child {
  margin-top: 0 !important;
}

.markdown-body > *:last-child {
  margin-bottom: 0 !important;
}

/* Headings */
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.2em;
  margin-bottom: 0.5em;
  font-weight: 600;
  line-height: 1.25;
  color: #ffffff;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #3c3c3c;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #3c3c3c;
  padding-bottom: 0.3em;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: #9d9d9d;
}

/* Paragraphs and text */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 1em;
}

.markdown-body strong {
  font-weight: 600;
  color: #ffffff;
}

.markdown-body em {
  font-style: italic;
}

/* Links */
.markdown-body a {
  color: #3794ff;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

/* Lists */
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-body li {
  margin-top: 0.25em;
}

/* Blockquotes */
.markdown-body blockquote {
  margin: 0 0 1em 0;
  padding: 0.5em 1em;
  color: #9d9d9d;
  background-color: #252526;
  border-left: 4px solid #3c3c3c;
}

.markdown-body blockquote > :first-child {
  margin-top: 0;
}

.markdown-body blockquote > :last-child {
  margin-bottom: 0;
}

/* Code */
.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 90%;
  background-color: #3c3c3c;
  border-radius: 3px;
  font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
  color: #d7ba7d;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 1em;
  padding: 16px;
  overflow: auto;
  font-size: 90%;
  line-height: 1.45;
  background-color: #252526;
  border-radius: 3px;
  word-wrap: normal;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  background: transparent;
  border: 0;
  white-space: pre;
  color: #d4d4d4;
}

/* Tables */
.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  margin-top: 0;
  margin-bottom: 1em;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-body table th {
  font-weight: 600;
  background-color: #252526;
  color: #ffffff;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #3c3c3c;
}

.markdown-body table tr {
  background-color: #1e1e1e;
  border-top: 1px solid #3c3c3c;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #252526;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  height: auto;
  box-sizing: content-box;
}

/* Horizontal rule */
.markdown-body hr {
  height: 2px;
  padding: 0;
  margin: 1.5em 0;
  background-color: #3c3c3c;
  border: 0;
}

/* Task lists */
.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item input {
  margin: 0 0.5em 0 -1.3em;
  vertical-align: middle;
}

/* Keyboard */
.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font-size: 11px;
  line-height: 10px;
  color: #d4d4d4;
  vertical-align: middle;
  background-color: #3c3c3c;
  border: 1px solid #555555;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #555555;
}

/* Custom containers - VS Code Dark */
.custom-container {
  background: #252526;
}

.custom-container.tip {
  background: #1a2f1f;
  border-color: #4ec9b0;
}

.custom-container.warning {
  background: #2d2a16;
  border-color: #dcdcaa;
}

.custom-container.danger {
  background: #2d1b1b;
  border-color: #f14c4c;
}

.custom-container.info {
  background: #1b2836;
  border-color: #3794ff;
}

.custom-container.note {
  background: #241f2d;
  border-color: #c586c0;
}

.custom-container-title {
  color: #ffffff;
}

/* Table of contents - VS Code Dark */
.table-of-contents {
  background: #252526;
  border: 1px solid #3c3c3c;
}

.table-of-contents a {
  color: #3794ff;
}

/* Details - VS Code Dark */
details {
  background: #252526;
  border: 1px solid #3c3c3c;
}

details summary {
  color: #ffffff;
}

/* Footnotes - VS Code Dark */
.footnotes {
  border-top: 1px solid #3c3c3c;
}

/* Mermaid error - VS Code Dark */
.mermaid-error {
  background: #3d2d00;
  border-color: #dcdcaa;
}

.mermaid-error .error-message {
  color: #dcdcaa;
}

/* Math error - VS Code Dark */
.math-error {
  color: #f14c4c;
  background: #2d1b1b;
}
`;

export default vscodeDarkTheme;
