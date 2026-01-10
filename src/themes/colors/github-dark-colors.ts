/**
 * GitHub Dark Theme Color Palette
 */

export const githubDarkColorPalette = `
:root {
  /* Focus */
  --focus-outlineColor: #1f6feb;
  
  /* Foreground Colors */
  --fgColor-default: #f0f6fc;
  --fgColor-muted: #9198a1;
  --fgColor-accent: #4493f8;
  --fgColor-success: #3fb950;
  --fgColor-attention: #d29922;
  --fgColor-danger: #f85149;
  --fgColor-done: #ab7df8;
  
  /* Background Colors */
  --bgColor-default: #0d1117;
  --bgColor-muted: #151b23;
  --bgColor-neutral-muted: #656c7633;
  --bgColor-attention-muted: #bb800926;
  
  /* Border Colors */
  --borderColor-default: #3d444d;
  --borderColor-muted: #3d444db3;
  --borderColor-neutral-muted: #3d444db3;
  --borderColor-accent-emphasis: #1f6feb;
  --borderColor-success-emphasis: #238636;
  --borderColor-attention-emphasis: #9e6a03;
  --borderColor-danger-emphasis: #da3633;
  --borderColor-done-emphasis: #8957e5;
  
  /* Syntax Highlighting - Prettylights */
  --color-prettylights-syntax-comment: #9198a1;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #f0f6fc;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
  --color-prettylights-syntax-brackethighlighter-angle: #9198a1;
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-list: #f2cc60;
  --color-prettylights-syntax-markup-heading: #f0f6fc;
  --color-prettylights-syntax-markup-italic: #f0f6fc;
  --color-prettylights-syntax-markup-bold: #f0f6fc;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-markup-changed-text: #ffdfb6;
  --color-prettylights-syntax-markup-changed-bg: #5a1e02;
  --color-prettylights-syntax-markup-ignored-text: #f0f6fc;
  --color-prettylights-syntax-markup-ignored-bg: #1158c7;
  --color-prettylights-syntax-meta-diff-range: #d2a8ff;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #3d444d;
  
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
  --container-tip-bg: #033a16;
  --container-tip-border: var(--borderColor-success-emphasis);
  --container-warning-bg: #bb800926;
  --container-warning-border: var(--borderColor-attention-emphasis);
  --container-danger-bg: #67060c;
  --container-danger-border: var(--borderColor-danger-emphasis);
  --container-info-bg: #1158c750;
  --container-info-border: var(--borderColor-accent-emphasis);
  --container-note-bg: #1158c750;
  --container-note-border: var(--borderColor-accent-emphasis);
  --container-title-text: var(--fgColor-default);
  
  /* Warning/Error Colors */
  --color-warning-bg: var(--bgColor-attention-muted);
  --color-warning-border: var(--borderColor-attention-emphasis);
  --color-warning-text: var(--fgColor-attention);
}
`;
