import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LazySection from '../components/common/LazySection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getIndexData, getRecentPosts, getRandomAlbum, type RandomGallery } from '../api/index';
import type { IndexData, Post } from '../types/api';

const IDE_CODE = `def welcome_message():
    return {
        'name': 'Jay',
        'role': 'Software Developer',
        'site_purpose': 'Personal portfolio exploring technology',
        'message': 'Welcome to Prokope.io!',
        'call_to_action': {
            'buttons': [
                'Github',
                'LinkedIn',
                'Medium'
            ]
        }
    }`;

export default function HomePage() {
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gallery, setGallery] = useState<RandomGallery | null>(null);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Prokope.io';
  }, []);

  useEffect(() => {
    Promise.all([getIndexData(), getRecentPosts()])
      .then(([index, recentPosts]) => {
        setIndexData(index);
        setPosts(recentPosts);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setGalleryLoading(true);
    getRandomAlbum()
      .then(data => { if (!cancelled) { setGallery(data); setGalleryLoading(false); } })
      .catch(() => { if (!cancelled) setGalleryLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !indexData) return <LoadingSpinner />;

  return (
    <div>
      <header
        className="page-header header container-fluid mb-4 p-0 d-flex align-items-center justify-content-center"
        style={{
          minHeight: '100vh',
          ...(indexData.hero_banner ? { backgroundImage: `url(${indexData.hero_banner})` } : {}),
        }}
      >
        <LazySection className="ide-container" delay={100} duration={1000}>
          <IdeSimulator title={indexData.about_prokope_title} />
        </LazySection>
      </header>

      <div className="container">
        <section className="features index-section">
          <h1 className="row justify-content-center">Who, and what?</h1>
          <div className="row align-items-start">
            <LazySection as="h2" className="col-12 feature-title" duration={1000}>
              {indexData.about_me_title}
            </LazySection>

            <LazySection className="col-12 col-lg-8 order-2 order-lg-1" duration={1000}>
              <p>{indexData.about_me_description}</p>
            </LazySection>

            <LazySection className="col-12 col-lg-4 order-1 text-center order-lg-2 mb-2 p-0" delay={150}>
              {indexData.hero_image && (
                <img id="profile" className="img-fluid my-auto" src={indexData.hero_image} alt="Profile" />
              )}
            </LazySection>
          </div>

          <span id={indexData.about_prokope_title}>
            <ProkopeDefinition />
          </span>

          <LazySection className="row" duration={1000}>
            <div className="col">
              <h2 id={indexData.about_prokope_title} className="feature-title">
                {indexData.about_prokope_title}
              </h2>
              <p>{indexData.about_prokope_description}</p>
            </div>
          </LazySection>
        </section>

        <SectionBreak
          title="Blog"
          subtitle="articles"
          subtext="Blog articles on a variety of topics, including software development, personal development, and more."
        />

        {posts.length > 0 && <RecentArticles posts={posts} />}

        {galleryLoading ? (
          <div className="text-center my-5"><span className="spinner-border" role="status" style={{ color: 'var(--iris)' }} /></div>
        ) : gallery ? (
          <>
            <SectionBreak
              title="Gallery"
              subtitle={gallery.countryName}
              subtext="Travel photos from my younger years."
            />
            <HomeGallerySection city={gallery.city} photos={gallery.photos} slug={gallery.slug} />
          </>
        ) : null}
      </div>
    </div>
  );
}

function IdeSimulator({ title }: { title: string }) {
  const editorRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    const footer = footerRef.current;
    if (!editor || !footer) return;

    const typeCode = () => {
      if (index <= IDE_CODE.length) {
        const displayed = IDE_CODE.slice(0, index++);
        let highlighted = displayed;
        if (typeof Prism !== 'undefined' && Prism.languages.python) {
          highlighted = Prism.highlight(displayed, Prism.languages.python, 'python');
        }
        editor.innerHTML = highlighted + '<span class="cursor">&nbsp;</span>';
        const lines = displayed.split('\n');
        footer.textContent = `Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`;
        timer = window.setTimeout(typeCode, 50);
      }
    };

    let index = 0;
    let timer: number;
    typeCode();
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="ide-titlebar">
        <div className="buttons">
          <span className="button btn-close"></span>
          <span className="button btn-min"></span>
          <span className="button btn-max"></span>
        </div>
        <div>index.py - Prokode</div>
        <div></div>
      </div>
      <div className="ide-main">
        <div className="ide-sidebar">
          <a href={`/#${encodeURIComponent(title)}`} title="Sample Icon">
            <img src="/logo/prokope-p.png" alt="icon" />
          </a>
          <a
            className="github icon icon-fill"
            href="https://github.com/Prokope45"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            <i className="fa fa-github"></i>
          </a>
          <a
            className="linkedin icon icon-fill"
            href="https://linkedin.com/in/jared-paubel"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            <i className="fa fa-linkedin"></i>
          </a>
          <a
            className="medium icon icon-fill"
            href="https://medium.com/@prokope"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            <i className="fa fa-medium"></i>
          </a>
        </div>
        <div className="ide-content">
          <div className="ide-header">~/projects/prokope/index.py</div>
          <pre className="ide-editor">
            <code id="editor" ref={editorRef} className="language-python"></code>
          </pre>
          <div className="ide-footer" ref={footerRef} id="ide-footer">
            Ln 1, Col 1
          </div>
        </div>
      </div>
    </>
  );
}

function ProkopeDefinition() {
  return (
    <div className="section-break lazy-section" data-lazy="section" data-duration="1000">
      <div className="section-title">
        <h2 className="greek-word">προκοπή</h2>
        <div className="phonetic">/pro.koˈpi/</div>
      </div>
      <hr className="separator" />
      <div className="definition">
        <ol>
          <li><strong>pro-</strong> (in front of or before) + <strong>kóptō</strong> (to cut)</li>
          <li>progress or advancement</li>
        </ol>
      </div>
    </div>
  );
}

function SectionBreak({ title, subtitle, subtext }: { title: string; subtitle: string; subtext: string }) {
  return (
    <LazySection className="section-break" duration={1000}>
      <div className="section-title">
        <h2 className="section-break-title">{title}</h2>
        <p className="section-break-subtitle">{subtitle}</p>
      </div>
      <hr className="separator" />
      <p className="section-break-subtext">{subtext}</p>
    </LazySection>
  );
}

function RecentArticles({ posts }: { posts: Post[] }) {
  return (
    <LazySection as="section" className="index-section">
      <h1 className="row justify-content-center">Recent Articles</h1>
      <div className="row justify-content-center">
        {posts.map(post => (
          <div key={post.id} id="index-blog" className="card col-md-5 mb-4 mx-1">
            <Link to={`/blog/${post.slug}`} className="card-body d-flex flex-column" style={{ cursor: 'pointer' }}>
              <h2 className="card-title">
                {post.title} <i className="fa fa-lightbulb-o my-auto ml-2"></i>
              </h2>
              <div className="card-text">
                <p className="text-muted">
                  <i className={`fa ${post.updated_on > post.created_on ? 'fa-pencil' : 'fa-clock-o'} mr-2`}></i>
                  {post.updated_on > post.created_on ? post.updated_on : post.created_on}
                </p>
                <p>{stripForPreview(post.content)}</p>
              </div>
              <div className="read-more mt-auto">Read More...</div>
            </Link>
          </div>
        ))}
      </div>
    </LazySection>
  );
}

function stripForPreview(html: string): string {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ');
  return text.length > 400 ? `${text.slice(0, 400)}...` : text;
}

function HomeGallerySection({ city, photos, slug }: { city: string; photos: RandomGallery['photos']; slug: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<MasonryInstance | null>(null);

  useEffect(() => {
    const elem = containerRef.current;
    if (!elem) return;

    const initMasonry = () => {
      if (masonryRef.current) masonryRef.current.destroy();
      if (typeof window.Masonry !== 'function') return;
      masonryRef.current = new window.Masonry(elem, {
        itemSelector: '.gallery_product',
        columnWidth: '.gallery_product',
        isFitWidth: true,
      });
      masonryRef.current.layout();
    };

    if (typeof window.imagesLoaded === 'function') {
      window.imagesLoaded(elem).on('always', () => {
        setTimeout(initMasonry, 50);
      });
    } else {
      initMasonry();
    }

    const onImageLoaded = () => masonryRef.current?.layout();
    window.addEventListener('lazyload:image', onImageLoaded);

    return () => {
      window.removeEventListener('lazyload:image', onImageLoaded);
      if (masonryRef.current) masonryRef.current.destroy();
      masonryRef.current = null;
    };
  }, []);

  return (
    <section className="index-section">
      <Link to={`/gallery/${slug}`}>
        <h1 className="text-center">{city}</h1>
      </Link>
      <div id="masonry-container" ref={containerRef}>
        {photos.map(photo => (
          <div key={photo.id} className="gallery_product m-2">
            <a title={`${photo.title} on ${photo.date_taken}`} href={photo.get_display_url} data-lightbox="home-gallery">
              <span className="lazy-image-wrapper" data-masonry-item>
                <div className="spinner"></div>
                <img
                  className="lazy-image travel-photo d-block"
                  src={photo.get_thumbnail_url}
                  data-src={photo.get_display_url}
                  data-lazy="image"
                  data-duration="2000"
                  alt={`${photo.title}: ${photo.caption}`}
                />
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}