/**
 * Base Document CSS Styles
 * Core styles for document structure, layout, and printing
 */

interface MarginOptions {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export function getBaseCSS(margin?: MarginOptions): string {
  // Use CSS padding on markdown-body instead of @page margins
  // This allows background colors to extend to page edges
  const defaultMargin = '5mm';
  const top = margin?.top || defaultMargin;
  const right = margin?.right || defaultMargin;
  const bottom = margin?.bottom || defaultMargin;
  const left = margin?.left || defaultMargin;
  
  const paddingCSS = `padding: ${top} ${right} ${bottom} ${left} !important;`;

  return `
/* Base Document Styles */
* {
  box-sizing: border-box;
}

@page {
  ${paddingCSS}
  size: A4;
}

html {
  font-size: 16px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  width: 100%;
  min-height: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

body {
  margin: 0 !important;
  padding: 0 !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 1rem;
  line-height: 1.6;
  word-wrap: break-word;
  width: 100%;
  min-height: 100%;
}

article {
  margin: 0 !important;
  padding: 0 !important;
}

/* Main content wrapper */
main, .content {
  display: block;
  margin: 0;
}

/* Markdown body - use CSS padding for spacing (not Puppeteer margins) so background extends to edges */
.markdown-body {
  display: block;
  word-wrap: break-word;
  ${paddingCSS}
  margin: 0 !important;
  min-height: 100vh;
  box-sizing: border-box;
}

/* Page break handling */
.markdown-body > * {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Keep code blocks with their content */
pre, code, blockquote {
  page-break-inside: avoid;
  break-inside: avoid;
}
  
/* Keep headings with their content */
h1, h2, h3, h4, h5, h6 {
  page-break-after: avoid;
  break-after: avoid;
  orphans: 3;
  widows: 3;
}
  
.mermaid {
  display: flex;
  justify-content: center;
  align-content: flex-start;
  height: fit-content;
  
}
.mermaid > svg {
  margin: 0 auto;
  transform-origin: center;
  transition: 100ms ease-in-out;
}
.mermaid a, .mermaid a .nodeLabel {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}
.mermaid a:focus-visible, .mermaid a .nodeLabel:focus-visible {
  outline-offset: -2px;
  box-shadow: none;
}

.mermaid-viewer-control-panel {
  position: absolute;
  bottom: 1em;
  right: 1em;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.2em;
}
.mermaid-viewer-control-panel > button {
  padding: 5px 7px;
}
.mermaid-viewer-control-panel > .zoom-in {
  grid-column: 3;
  grid-row: 1;
}
.mermaid-viewer-control-panel > .zoom-out {
  grid-column: 3;
  grid-row: 3;
}
.mermaid-viewer-control-panel > .reset {
  grid-column: 2;
  grid-row: 2;
}
.mermaid-viewer-control-panel > .up {
  grid-column: 2;
  grid-row: 1;
}
.mermaid-viewer-control-panel > .down {
  grid-column: 2;
  grid-row: 3;
}
.mermaid-viewer-control-panel > .left {
  grid-column: 1;
  grid-row: 2;
}
.mermaid-viewer-control-panel > .right {
  grid-column: 3;
  grid-row: 2;
}

/* Gantt chart specific - use full width */
.mermaid-container.gantt {
  display: block;
  width: 100%;
  overflow-x: auto;
  page-break-inside: avoid;
  break-inside: avoid;
}

.mermaid-container.gantt .mermaid {
  display: block;
  width: 100%;
  min-width: 100%;
  overflow: visible;
}

.mermaid-container.gantt svg {
  width: 100% !important;
  max-width: 100% !important;
  overflow: visible !important;
}

/* Mermaid error styling - colors defined in theme files */
.mermaid-error {
  border-radius: 4px;
  padding: 1em;
  margin: 1em 0;
  border: 1px solid;
}

.mermaid-error .error-message {
  font-size: 0.9em;
}

/* Custom containers */
/* Custom containers - colors defined in theme files */
.custom-container {
  padding: 1em 1.5em;
  margin: 1em 0;
  border-left: 4px solid;
  border-radius: 4px;
}

.custom-container-title {
  font-weight: 600;
  margin-bottom: 0.5em;
}

/* Task lists */
.task-list-item {
  list-style-type: none;
}

.task-list-item input {
  margin-right: 0.5em;
}

/* Front matter table wrapper - negative margin to counteract padding */
.frontmatter-wrapper {
  margin: 0 0 12px 0;
}

/* Front matter table styling */
.frontmatter-table {
  margin: 0 !important;
  border-collapse: collapse;
  width: 100%;
}

.frontmatter-table td {
  text-align: center;
  vertical-align: middle;
}

/* Footnotes */
.footnotes {
  border-top: 1px solid #e1e4e8;
  margin-top: 2em;
  padding-top: 1em;
  font-size: 0.9em;
}

.footnote-ref {
  font-size: 0.75em;
  vertical-align: super;
}

/* Table of contents - colors defined in theme files */
.table-of-contents {
  padding: 0.75em 1em;
  border-radius: 6px;
  margin: 0.5em 0;
  page-break-inside: avoid;
  break-inside: auto;
}

.table-of-contents ul {
  margin: 0;
  padding-left: 1.5em;
}

.table-of-contents li {
  margin: 0.35em 0;
}

/* Details/Summary - colors defined in theme files */
details {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-radius: 4px;
}

details summary {
  cursor: pointer;
  font-weight: 600;
}

details[open] summary {
  margin-bottom: 0.5em;
}

/* Print styles */
@media print {
  html,
  body {
    padding: 0;
  }
  
  pre, code {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  /* Prevent mermaid diagrams and images from breaking across pages */
  .mermaid-container svg,
  .mermaid svg {
    page-break-inside: avoid;
    break-inside: avoid;
    max-height: 700px;
    width: 100%;
  }
  
  img {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  
  /* Keep headings with their content */
  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid;
    break-after: avoid;
    orphans: 3;
    widows: 3;
  }
  
  /* Reduce excessive spacing */
  .markdown-body h1 {
    margin-top: 0.8em;
    margin-bottom: 0.3em;
  }
  
  .markdown-body h2 {
    margin-top: 0.6em;
    margin-bottom: 0.25em;
  }
}
`;
}

export default {
  getBaseCSS,
};
