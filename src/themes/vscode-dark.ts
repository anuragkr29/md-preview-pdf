/**
 * VS Code Dark Theme CSS
 * Replicates the VS Code markdown preview dark styling
 */

import { vscodeDarkColorPalette } from './colors/vscode-dark-colors';

export const vscodeDarkTheme = `
${vscodeDarkColorPalette}

/* VS Code Dark Markdown CSS */
html,
body {
  background-color: var(--color-bg-primary);
}

.markdown-body {
  margin: 0;
  padding: 1.5em 1em;
  color: var(--color-text-primary);
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
  color: var(--color-text-primary);
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--color-border-primary);
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--color-border-primary);
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
  color: var(--h6-color);
}

/* Paragraphs and text */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 1em;
}

.markdown-body strong {
  font-weight: 600;
  color: var(--strong-color);
}

.markdown-body em {
  font-style: italic;
}

/* Links */
.markdown-body a {
  color: var(--link-color);
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
  color: var(--blockquote-color);
  background-color: var(--color-bg-secondary);
  border-left: 4px solid var(--blockquote-border);
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
  background-color: var(--code-bg);
  border-radius: 3px;
  font-family: "SF Mono", Monaco, Menlo, Consolas, "Ubuntu Mono", "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace;
  color: var(--code-color);
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 1em;
  padding: 16px;
  overflow: auto;
  font-size: 90%;
  line-height: 1.45;
  background-color: var(--color-bg-secondary);
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
  color: var(--color-text-primary);
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
  background-color: var(--color-bg-secondary);
  color: var(--table-header-color);
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid var(--table-border);
}

.markdown-body table tr {
  background-color: var(--color-bg-primary);
  border-top: 1px solid var(--table-border);
}

.markdown-body table tr:nth-child(2n) {
  background-color: var(--color-bg-secondary);
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
  background-color: var(--hr-color);
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
  color: var(--color-text-primary);
  vertical-align: middle;
  background-color: var(--kbd-bg);
  border: 1px solid var(--kbd-border);
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 var(--kbd-border);
}

/* Custom containers - VS Code Dark */
.custom-container {
  background: var(--color-bg-secondary);
}

.custom-container.tip {
  background: var(--container-tip-bg);
  border-color: var(--container-tip-border);
}

.custom-container.warning {
  background: var(--container-warning-bg);
  border-color: var(--container-warning-border);
}

.custom-container.danger {
  background: var(--container-danger-bg);
  border-color: var(--container-danger-border);
}

.custom-container.info {
  background: var(--container-info-bg);
  border-color: var(--container-info-border);
}

.custom-container.note {
  background: var(--container-note-bg);
  border-color: var(--container-note-border);
}

.custom-container-title {
  color: var(--container-title-text);
}

/* Table of contents - VS Code Dark */
.table-of-contents {
  background: var(--color-bg-secondary);
  border: 1px solid var(--toc-border);
}

.table-of-contents a {
  color: var(--link-color);
}

/* Details - VS Code Dark */
details {
  background: var(--color-bg-secondary);
  border: 1px solid var(--details-border);
}

details summary {
  color: var(--details-summary-color);
}

/* Footnotes - VS Code Dark */
.footnotes {
  border-top: 1px solid var(--footnotes-border);
}

/* Mermaid error - VS Code Dark */
.mermaid-error {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-text);
}

.mermaid-error .error-message {
  color: var(--color-warning-text);
}

/* Math error - VS Code Dark */
.math-error {
  color: var(--math-error-color);
  background: var(--math-error-bg);
}

/* Error message styling */
.mermaid-error {
  background: var(--color-warning-bg);
  border-color: var(--color-warning-border);
  color: var(--color-warning-text);
}

.mermaid-error .error-message {
  color: var(--color-warning-text);
}

/* Table of contents styling */
.table-of-contents {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.table-of-contents a {
  color: var(--color-link);
}
`;

export default vscodeDarkTheme;
