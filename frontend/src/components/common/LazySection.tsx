import { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export default function LazySection({ children, delay, duration, className = '' }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lazy-section ${inView ? 'in-view' : ''} ${className}`}
      style={{
        opacity: 0,
        transform: 'translateY(30px)',
        transitionProperty: 'opacity, transform',
        transitionDuration: duration ? `${duration}ms` : '1.5s',
        transitionTimingFunction: 'ease',
        transitionDelay: delay ? `${delay}ms` : '500ms',
        ...(inView ? { opacity: 1, transform: 'translateY(0)' } : {}),
      }}
    >
      {children}
    </div>
  );
}
