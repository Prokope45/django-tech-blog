import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import LazySection from '../components/common/LazySection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getIndexData, getRecentPosts, getRandomAlbum } from '../api/index';
import type { IndexData, Post } from '../types/api';

export default function HomePage() {
  const [indexData, setIndexData] = useState<IndexData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [gallery, setGallery] = useState<{ city: string; photos: any[]; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getIndexData(),
      getRecentPosts(),
      getRandomAlbum(),
    ]).then(([index, recentPosts, randomAlbum]) => {
      setIndexData(index);
      setPosts(recentPosts);
      if (randomAlbum) {
        setGallery({
          city: randomAlbum.city,
          photos: randomAlbum.photos,
          slug: randomAlbum.album.slug,
        });
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && indexData) {
      const header = document.querySelector('.page-header') as HTMLElement;
      if (header && indexData.hero_banner) {
        header.style.backgroundImage = `url(${indexData.hero_banner})`;
      }
    }
  }, [loading, indexData]);

  if (loading) return <LoadingSpinner />;
  if (!indexData) return null;

  return (
    <>
      <Navbar />
      <div id="content">
        <header
          className="page-header header container-fluid mb-4 p-0 d-flex align-items-center justify-content-center"
          style={{
            ...(indexData.hero_banner
              ? { backgroundImage: `url(${indexData.hero_banner})` }
              : {}),
          }}
        >
          <div className="ide-container lazy-section" data-lazy="section" data-delay="100" data-duration="1000">
            <IdeSimulator title={indexData.about_prokope_title} />
          </div>
        </header>

        <div className="container">
          <section className="features index-section" style={{ marginTop: '60px' }}>
            <h1 className="row justify-content-center">Who, and what?</h1>
            <div className="row align-items-start">
              <h2 id={indexData.about_me_title} className="col-12 feature-title">
                {indexData.about_me_title}
              </h2>
              <LazySection className="col-12 col-lg-8 order-2 order-lg-1">
                <p>{indexData.about_me_description}</p>
              </LazySection>
              <LazySection className="col-12 col-lg-4 order-1 text-center order-lg-2 mb-2 p-0" delay={150}>
                {indexData.hero_image && (
                  <img
                    id="profile"
                    className="img-fluid my-auto"
                    src={indexData.hero_image}
                    alt="Profile"
                  />
                )}
              </LazySection>
            </div>

            <div className="section-break lazy-section" data-lazy="section" data-duration="1000">
              <div className="section-title">
                <h2 className="greek-word">&#960;&#961;&#959;&#954;&#959;&#960;&#8053;</h2>
                <div className="phonetic">/pro.ko&#712;pi/</div>
              </div>
              <hr className="separator" />
              <div className="definition">
                <ol>
                  <li><strong>pro-</strong> (in front of or before) + <strong>k&oacute;pt&omacr;</strong> (to cut)</li>
                  <li>progress or advancement</li>
                </ol>
              </div>
            </div>

            <LazySection>
              <div className="row">
                <div className="col">
                  <h2 id={indexData.about_prokope_title} className="feature-title">
                    {indexData.about_prokope_title}
                  </h2>
                  <p>{indexData.about_prokope_description}</p>
                </div>
              </div>
            </LazySection>
          </section>

          <SectionBreak
            title="Blog"
            subtitle="articles"
            subtext="Blog articles on a variety of topics, including software development, personal development, and more."
          />

          {posts.length > 0 && <RecentArticles posts={posts} />}

          {gallery && (
            <>
              <SectionBreak
                title="Gallery"
                subtitle={gallery.city}
                subtext="Travel photos from my younger years."
              />
              <HomeGallerySection city={gallery.city} photos={gallery.photos} slug={gallery.slug} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

function IdeSimulator({ title }: { title: string }) {
  useEffect(() => {
    const editor = document.getElementById('editor');
    const footer = document.getElementById('ide-footer');
    if (!editor || !footer) return;

    const code = `def welcome_message():
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

    let index = 0;
    const savedIndex = sessionStorage.getItem('ide-index');
    if (savedIndex) index = parseInt(savedIndex, 10);

    function typeCode() {
      if (index <= code.length) {
        const displayed = code.slice(0, index++);
        sessionStorage.setItem('ide-index', String(index));
        editor!.innerHTML = Prism.highlight(displayed, Prism.languages.python, 'python') + '<span class="cursor">&nbsp;</span>';
        const lines = displayed.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        footer!.textContent = `Ln ${line}, Col ${col}`;
        setTimeout(typeCode, 50);
      }
    }

    typeCode();
  }, []);

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.css" rel="stylesheet" />
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-python.min.js"></script>
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
          <a href={`/#${title}`}>
            <img src="/static/logo/prokope-p.png" alt="icon" title="Sample Icon" />
          </a>
          <a className="github icon icon-fill"
            href="https://github.com/Prokope45"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            <i className="fa fa-github"></i>
          </a>
          <a className="linkedin icon icon-fill"
            href="https://linkedin.com/in/jared-paubel"
            target="_blank"
            rel="noopener noreferrer"
            role="button"
          >
            <i className="fa fa-linkedin"></i>
          </a>
          <a className="medium icon icon-fill"
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
          <pre className="ide-editor"><code id="editor" className="language-python"></code></pre>
          <div className="ide-footer" id="ide-footer">Ln 1, Col 1</div>
        </div>
      </div>
    </>
  );
}

function SectionBreak({ title, subtitle, subtext }: { title: string; subtitle: string; subtext: string }) {
  return (
    <LazySection>
      <div className="section-break" data-duration="1000">
        <div className="section-title">
          <h2 className="section-break-title">{title}</h2>
          <p className="section-break-subtitle">{subtitle}</p>
        </div>
        <hr className="separator" />
        <p className="section-break-subtext">{subtext}</p>
      </div>
    </LazySection>
  );
}

function RecentArticles({ posts }: { posts: Post[] }) {
  return (
    <section className="index-section lazy-section">
      <h1 className="row justify-content-center">Recent Articles</h1>
      <div className="row justify-content-center">
        {posts.map(post => (
          <div key={post.id} id="index-blog" className="card col-md-5 mb-4 mx-1">
            <Link to={`/blog/${post.slug}/`} className="card-body d-flex flex-column" style={{ cursor: 'pointer' }}>
              <h2 className="card-title">
                {post.title} <i className="fa fa-lightbulb-o my-auto ml-2"></i>
              </h2>
              <div className="card-text">
                <p className="text-muted">
                  <i className={`fa ${post.updated_on > post.created_on ? 'fa-pencil' : 'fa-clock-o'} mr-2`}></i>
                  {post.updated_on > post.created_on ? post.updated_on : post.created_on}
                </p>
              </div>
              <div className="read-more mt-auto">Read More...</div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeGallerySection({ city, photos, slug }: { city: string; photos: any[]; slug: string }) {
  return (
    <section className="index-section">
      <Link to={`/gallery/${slug}/`}>
        <h1 className="text-center">{city}</h1>
      </Link>
      <div id="masonry-container">
        {photos.map((photo, idx) => (
          <div key={idx} className="gallery_product m-2">
            <a
              title={`${photo.title} on ${photo.date_taken}`}
              href={photo.get_display_url}
              data-lightbox="home-gallery"
            >
              <span className="lazy-image-wrapper" data-masonry-item>
                <div className="spinner"></div>
                <img
                  className="lazy-image travel-photo d-block"
                  data-lazy="image"
                  data-duration="2000"
                  data-src={photo.get_display_url}
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



