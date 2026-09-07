import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  delay?: number;
  minHeight?: string | number;
  className?: string;
}

export default function LoadingSpinner({
  delay = 800,
  minHeight = '40vh',
  className = '',
}: LoadingSpinnerProps) {
  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`d-flex justify-content-center align-items-center ${className}`}
      style={{ minHeight }}
      aria-busy="true"
      aria-live="polite"
    >
      {visible && (
        <div className="spinner-border" role="status" style={{ color: 'var(--iris)' }}>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  );
}