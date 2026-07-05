import { useEffect, useState } from 'react';

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      id="backToTopBtn"
      className="btn btn-outline-secondary"
      style={{
        display: 'block',
        position: 'fixed',
        bottom: 20,
        right: 30,
        zIndex: 99,
        fontSize: 16,
        outline: 'none',
        backgroundColor: 'var(--button-bg-color)',
        border: '1px solid var(--button-text-color)',
        color: 'var(--button-text-color)',
        cursor: 'pointer',
        padding: 10,
        borderRadius: 4,
      }}
    >
      <i className="fa fa-arrow-up"></i>
    </button>
  );
}
