import { useEffect } from 'react';

export function useLazyLoader() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const process = (el: Element) => {
      const type = el.getAttribute('data-lazy');

      if (!type) return;

      if (type === 'section') {
        const section = el as HTMLElement;
        const delay = section.getAttribute('data-delay');
        const duration = section.getAttribute('data-duration');
        if (delay) section.style.transitionDelay = `${delay}ms`;
        if (duration) section.style.transitionDuration = `${duration}ms`;
        section.classList.add('in-view');
        return;
      }

      if (type === 'image') {
        const img = el as HTMLImageElement;
        const src = img.getAttribute('data-src');
        if (!src || img.getAttribute('src') === src) {
          img.classList.add('in-view');
          img.classList.remove('lazy-image');
          return;
        }
        const spinner = el.closest('[data-masonry-item]')?.querySelector('.spinner');
        img.src = src;
        img.onload = () => {
          img.classList.add('in-view');
          img.classList.remove('lazy-image');
          spinner?.remove();
          window.dispatchEvent(new CustomEvent('lazyload:image', { detail: img }));
        };
        img.onerror = () => {
          img.src = (img as HTMLImageElement).getAttribute('data-src') || '';
          img.classList.add('in-view');
          img.classList.remove('lazy-image');
          spinner?.remove();
        };
      }
    };

    const scan = () => {
      const els = document.querySelectorAll('[data-lazy]:not([data-lazy-processed])');
      els.forEach(el => {
        el.setAttribute('data-lazy-processed', 'true');
        observer?.observe(el);
      });
    };

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          process(entry.target);
          observer?.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 200px 0px' }
    );

    scan();

    const mutationObserver = new MutationObserver(scan);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
}