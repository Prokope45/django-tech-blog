import { useEffect } from 'react';

export function useLazyLoader(trigger?: unknown) {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const observedElements = new WeakSet<Element>();

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
      if (!observer) return;

      // Check if main content is currently in a loading state
      const contentEl = document.getElementById('content');
      const isContentLoading = contentEl?.getAttribute('data-loading') === 'true';

      const els = document.querySelectorAll<HTMLElement>('[data-lazy]');
      els.forEach(el => {
        // If it's already in-view and image is not pending, skip
        if (el.classList.contains('in-view') && !el.classList.contains('lazy-image')) {
          return;
        }

        // Defer observing #footer if content is still loading
        if (el.id === 'footer' && isContentLoading) {
          return;
        }

        if (!observedElements.has(el)) {
          observedElements.add(el);
          observer?.observe(el);
        }
      });
    };

    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          process(entry.target);
          observer?.unobserve(entry.target);
          observedElements.delete(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    scan();
    const t1 = setTimeout(scan, 50);
    const t2 = setTimeout(scan, 200);

    const mutationObserver = new MutationObserver(() => {
      scan();
    });
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-loading'],
    });

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [trigger]);
}
