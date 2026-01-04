/**
 * GitHub Dark Theme CSS
 * Dark mode version of GitHub markdown preview styling
 */

export const githubDarkTheme = `
/* GitHub Dark Markdown CSS */
.markdown-body {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  margin: 0;
  color: #c9d1d9;
  background-color: #0d1117;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  display: table;
  clear: both;
  content: "";
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
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: #c9d1d9;
}

.markdown-body h1 {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #21262d;
}

.markdown-body h2 {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #21262d;
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
  color: #8b949e;
}

/* Paragraphs and text */
.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body em {
  font-style: italic;
}

.markdown-body del {
  text-decoration: line-through;
}

/* Links */
.markdown-body a {
  color: #58a6ff;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

/* Lists */
.markdown-body ul,
.markdown-body ol {
  margin-top: 0;
  margin-bottom: 16px;
  padding-left: 2em;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li {
  margin-top: 0.25em;
}

.markdown-body li > p {
  margin-top: 16px;
}

.markdown-body li + li {
  margin-top: 0.25em;
}

/* Task lists */
.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item + .task-list-item {
  margin-top: 4px;
}

.markdown-body .task-list-item input {
  margin: 0 0.5em 0 -1.3em;
  vertical-align: middle;
}

/* Blockquotes */
.markdown-body blockquote {
  margin: 0 0 16px 0;
  padding: 0 1em;
  color: #8b949e;
  border-left: 0.25em solid #30363d;
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
  font-size: 85%;
  white-space: break-spaces;
  background-color: rgba(110, 118, 129, 0.4);
  border-radius: 6px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  color: #c9d1d9;
  background-color: #161b22;
  border-radius: 6px;
  word-wrap: normal;
}

.markdown-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body pre > code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

/* Tables */
.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
  margin-top: 0;
  margin-bottom: 16px;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #30363d;
}

.markdown-body table tr {
  background-color: #0d1117;
  border-top: 1px solid #21262d;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #161b22;
}

/* Images */
.markdown-body img {
  max-width: 100%;
  height: auto;
  box-sizing: content-box;
  background-color: transparent;
}

.markdown-body img[align=right] {
  padding-left: 20px;
}

.markdown-body img[align=left] {
  padding-right: 20px;
}

/* Horizontal rule */
.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #30363d;
  border: 0;
}

/* Keyboard input */
.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font-size: 11px;
  line-height: 10px;
  color: #c9d1d9;
  vertical-align: middle;
  background-color: #161b22;
  border: solid 1px rgba(110, 118, 129, 0.4);
  border-bottom-color: rgba(110, 118, 129, 0.4);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 rgba(110, 118, 129, 0.4);
}

/* Anchor links */
.markdown-body .header-anchor {
  color: inherit;
  text-decoration: none;
  display: inline-block;
}

.markdown-body .header-anchor:hover {
  color: #58a6ff;
}

/* For print/PDF, ensure anchors are always visible */
@media print {
  .markdown-body .header-anchor {
    color: inherit !important;
    opacity: 1 !important;
  }
}

/* Emoji */
.markdown-body .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

/* Definition lists */
.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

/* Summary/Details */
.markdown-body summary {
  cursor: pointer;
}

.markdown-body details:not([open]) > *:not(summary) {
  display: none !important;
}

/* Custom containers - Dark theme overrides */
.custom-container.tip {
  background: #1a2f1f;
  border-color: #238636;
}

.custom-container.warning {
  background: #2d2416;
  border-color: #d29922;
}

.custom-container.danger {
  background: #2d1b1b;
  border-color: #da3633;
}

.custom-container.info {
  background: #182233;
  border-color: #388bfd;
}

.custom-container.note {
  background: #241f2d;
  border-color: #8957e5;
}

.custom-container-title {
  color: #c9d1d9;
}

/* Table of contents - Dark */
.table-of-contents {
  background: #161b22;
}

/* Details - Dark */
details {
  background: #161b22;
}

/* Mermaid error - Dark */
.mermaid-error {
  background: #3d2d00;
  border-color: #d29922;
}

.mermaid-error .error-message {
  color: #d29922;
}

/* Math error - Dark */
.math-error {
  color: #f85149;
  background: #2d1b1b;
}
`;

export default githubDarkTheme;
