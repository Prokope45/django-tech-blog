/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PrismGrammar {
  [key: string]: any;
}

interface PrismStatic {
  highlight: (text: string, grammar: PrismGrammar, language: string) => string;
  highlightAll: () => void;
  languages: {
    python: PrismGrammar;
    [key: string]: PrismGrammar | undefined;
  };
}

declare var Prism: PrismStatic;

interface ImagesLoadedResult {
  on: (event: string, callback: () => void) => void;
}

interface MasonryInstance {
  destroy(): void;
  layout(): void;
  reloadItems(): void;
}

interface Window {
  imagesLoaded: (elem: Element) => ImagesLoadedResult;
  Masonry: new (elem: Element, options: Record<string, unknown>) => MasonryInstance;
}

declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-player': any;
  }
}