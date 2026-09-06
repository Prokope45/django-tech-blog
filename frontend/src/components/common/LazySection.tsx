interface LazySectionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function LazySection({
  children,
  delay,
  duration = 1000,
  className = '',
  as: Tag = 'div',
}: LazySectionProps) {
  const data: Record<string, unknown> = { 'data-lazy': 'section', 'data-duration': duration };
  if (delay) data['data-delay'] = delay;

  return (
    <Tag className={`lazy-section ${className}`} {...data}>
      {children}
    </Tag>
  );
}