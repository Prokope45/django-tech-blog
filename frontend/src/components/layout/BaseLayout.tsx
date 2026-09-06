import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';
import { useLazyLoader } from '../../hooks/useLazyLoader';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.replace('#', ''));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  useLazyLoader();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main id="content">{children}</main>
      <Footer />
      <BackToTopButton />
    </>
  );
}

export { Navbar, Footer };