/**
 * VS Code Light Theme CSS
 * Replicates the VS Code markdown preview light styling
 */

export const vscodeLightTheme = `
/* VS Code Light Markdown CSS */
html,
body {
  background-color: #ffffff;
}

.markdown-body {
  margin: 0;
  padding: 1.5em 1em;
  color: #333333;
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
  color: #333333;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #e1e4e8;
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
  color: #6a737d;
}

/* Paragraphs and text */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 1em;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

/* Links */
.markdown-body a {
  color: #4078c0;
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
  color: #6a737d;
  background-color: #f8f8f8;
  border-left: 4px solid #dfe2e5;
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
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 1em;
  padding: 16px;
  overflow: auto;
  font-size: 90%;
  line-height: 1.45;
  background-color: #f8f8f8;
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
  background-color: #f8f8f8;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #ffffff;
  border-top: 1px solid #dfe2e5;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f8f8f8;
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
  background-color: #e1e4e8;
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
  color: #444d56;
  vertical-align: middle;
  background-color: #fafbfc;
  border: 1px solid #d1d5da;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #d1d5da;
}

/* Custom containers - VS Code Light */
.custom-container.tip {
  background: #f0fff4;
  border-color: #48bb78;
}

.custom-container.warning {
  background: #fffaf0;
  border-color: #ed8936;
}

.custom-container.danger {
  background: #fff5f5;
  border-color: #f56565;
}

.custom-container.info {
  background: #ebf8ff;
  border-color: #4299e1;
}

.custom-container.note {
  background: #faf5ff;
  border-color: #9f7aea;
}
`;

export default vscodeLightTheme;
