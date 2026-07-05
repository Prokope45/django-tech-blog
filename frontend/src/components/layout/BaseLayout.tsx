import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTopButton from './BackToTopButton';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const header = document.querySelector('.header') as HTMLElement | null;
    if (header) {
      header.style.height = window.innerHeight + 'px';
    }
  }, []);

  return (
    <>
      <BackToTopButton />
      {children}
    </>
  );
}

export { Navbar, Footer };
