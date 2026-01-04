// Type declarations for modules without types

declare module 'markdown-it-task-lists' {
  import MarkdownIt from 'markdown-it';
  
  interface TaskListOptions {
    enabled?: boolean;
    label?: boolean;
    labelAfter?: boolean;
  }
  
  function taskLists(md: MarkdownIt, options?: TaskListOptions): void;
  export default taskLists;
}

declare module 'markdown-it-attrs' {
  import MarkdownIt from 'markdown-it';
  
  interface AttrsOptions {
    allowedAttributes?: string[];
    leftDelimiter?: string;
    rightDelimiter?: string;
  }
  
  function attrs(md: MarkdownIt, options?: AttrsOptions): void;
  export default attrs;
}

declare module 'markdown-it-toc-done-right' {
  import MarkdownIt from 'markdown-it';
  
  interface TocOptions {
    level?: number[];
    listType?: 'ul' | 'ol';
    containerClass?: string;
    slugify?: (s: string) => string;
    uniqueSlugStartIndex?: number;
    format?: (heading: string, htmlString: string) => string;
  }
  
  function tocDoneRight(md: MarkdownIt, options?: TocOptions): void;
  export default tocDoneRight;
}
