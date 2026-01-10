/**
 * GitHub Light Theme Color Palette
 */

export const githubColorPalette = `
:root {
  /* Focus */
  --focus-outlineColor: #0969da;
  
  /* Foreground Colors */
  --fgColor-default: #1f2328;
  --fgColor-muted: #59636e;
  --fgColor-accent: #0969da;
  --fgColor-success: #1a7f37;
  --fgColor-attention: #9a6700;
  --fgColor-danger: #d1242f;
  --fgColor-done: #8250df;
  
  /* Background Colors */
  --bgColor-default: #ffffff;
  --bgColor-muted: #f6f8fa;
  --bgColor-neutral-muted: #818b981f;
  --bgColor-attention-muted: #fff8c5;
  
  /* Border Colors */
  --borderColor-default: #d1d9e0;
  --borderColor-muted: #d1d9e0b3;
  --borderColor-neutral-muted: #d1d9e0b3;
  --borderColor-accent-emphasis: #0969da;
  --borderColor-success-emphasis: #1a7f37;
  --borderColor-attention-emphasis: #9a6700;
  --borderColor-danger-emphasis: #cf222e;
  --borderColor-done-emphasis: #8250df;
  
  /* Syntax Highlighting - Prettylights */
  --color-prettylights-syntax-comment: #59636e;
  --color-prettylights-syntax-constant: #0550ae;
  --color-prettylights-syntax-constant-other-reference-link: #0a3069;
  --color-prettylights-syntax-entity: #6639ba;
  --color-prettylights-syntax-storage-modifier-import: #1f2328;
  --color-prettylights-syntax-entity-tag: #0550ae;
  --color-prettylights-syntax-keyword: #cf222e;
  --color-prettylights-syntax-string: #0a3069;
  --color-prettylights-syntax-variable: #953800;
  --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
  --color-prettylights-syntax-brackethighlighter-angle: #59636e;
  --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
  --color-prettylights-syntax-invalid-illegal-bg: #82071e;
  --color-prettylights-syntax-carriage-return-text: #f6f8fa;
  --color-prettylights-syntax-carriage-return-bg: #cf222e;
  --color-prettylights-syntax-string-regexp: #116329;
  --color-prettylights-syntax-markup-list: #3b2300;
  --color-prettylights-syntax-markup-heading: #0550ae;
  --color-prettylights-syntax-markup-italic: #1f2328;
  --color-prettylights-syntax-markup-bold: #1f2328;
  --color-prettylights-syntax-markup-deleted-text: #82071e;
  --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
  --color-prettylights-syntax-markup-inserted-text: #116329;
  --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
  --color-prettylights-syntax-markup-changed-text: #953800;
  --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
  --color-prettylights-syntax-markup-ignored-text: #d1d9e0;
  --color-prettylights-syntax-markup-ignored-bg: #0550ae;
  --color-prettylights-syntax-meta-diff-range: #8250df;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #818b98;
  
  /* Legacy Mapping for backward compatibility */
  --color-text-primary: var(--fgColor-default);
  --color-text-secondary: var(--fgColor-muted);
  --color-text-code: var(--fgColor-default);
  --color-text-muted: var(--fgColor-muted);
  --color-bg-primary: var(--bgColor-default);
  --color-bg-secondary: var(--bgColor-muted);
  --color-bg-code: var(--bgColor-neutral-muted);
  --color-border-primary: var(--borderColor-default);
  --color-border-secondary: var(--borderColor-muted);
  --color-border-subtle: var(--borderColor-muted);
  --color-link: var(--fgColor-accent);
  --color-link-hover: var(--fgColor-accent);
  
  /* Markdown Alert Colors */
  --color-alert-note-border: var(--borderColor-accent-emphasis);
  --color-alert-note-text: var(--fgColor-accent);
  --color-alert-important-border: var(--borderColor-done-emphasis);
  --color-alert-important-text: var(--fgColor-done);
  --color-alert-warning-border: var(--borderColor-attention-emphasis);
  --color-alert-warning-text: var(--fgColor-attention);
  --color-alert-tip-border: var(--borderColor-success-emphasis);
  --color-alert-tip-text: var(--fgColor-success);
  --color-alert-caution-border: var(--borderColor-danger-emphasis);
  --color-alert-caution-text: var(--fgColor-danger);
  
  /* Container Colors */
  --container-tip-bg: #dafbe1;
  --container-tip-border: var(--borderColor-success-emphasis);
  --container-warning-bg: #fff8c5;
  --container-warning-border: var(--borderColor-attention-emphasis);
  --container-danger-bg: #ffebe9;
  --container-danger-border: var(--borderColor-danger-emphasis);
  --container-info-bg: #ddf4ff;
  --container-info-border: var(--borderColor-accent-emphasis);
  --container-note-bg: #ddf4ff;
  --container-note-border: var(--borderColor-accent-emphasis);
  --container-title-text: var(--fgColor-default);
  
  /* Warning/Error Colors */
  --color-warning-bg: var(--bgColor-attention-muted);
  --color-warning-border: var(--borderColor-attention-emphasis);
  --color-warning-text: var(--fgColor-attention);
}
`;
