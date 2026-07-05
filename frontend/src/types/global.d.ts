interface PrismStatic {
  highlight: (text: string, grammar: any, language: string) => string;
  languages: {
    python: any;
    [key: string]: any;
  };
}

declare var Prism: PrismStatic;

interface Window {
  imagesLoaded: (elem: Element) => {
    on: (event: string, callback: () => void) => void;
  };
  Masonry: new (elem: Element, options: any) => any;
  bootstrap: {
    Carousel: new (element: Element, options?: any) => any;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-player': any;
  }
}
