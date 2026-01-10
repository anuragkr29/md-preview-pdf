/**
 * KaTeX CSS Styles
 * Essential styles for math rendering with KaTeX
 */

export function getKatexCSS(): string {
  return `
/* KaTeX CSS - Essential styles for math rendering */
.katex {
  font: normal 1.21em KaTeX_Main, "Times New Roman", serif;
  line-height: 1.2;
  text-indent: 0;
  text-rendering: auto;
}

.katex * {
  -ms-high-contrast-adjust: none !important;
  border-color: currentColor;
}

.katex .katex-html {
  display: inline-block;
}

.katex .base {
  position: relative;
  display: inline-block;
}

.katex .strut {
  display: inline-block;
}

.math-block {
  display: block;
  text-align: center;
  margin: 1em 0;
  overflow-x: auto;
}

.math-error {
  color: #e74c3c;
  background: #fdf2f2;
  padding: 0.5em;
  border-radius: 4px;
}
`;
}

export default {
  getKatexCSS,
};