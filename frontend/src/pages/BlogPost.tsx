import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getPost } from '../api/blog';
import type { PostDetail } from '../types/api';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getPost(slug).then(data => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    const images = document.querySelectorAll('.card-body img');
    images.forEach(image => {
      const img = image as HTMLImageElement;
      const imageUrl = img.src;
      const lightboxLink = document.createElement('a');
      lightboxLink.href = imageUrl;
      lightboxLink.setAttribute('data-lightbox', 'article-images');
      lightboxLink.style.display = 'inline-block';
      img.parentNode?.insertBefore(lightboxLink, img);
      lightboxLink.appendChild(img);
    });
  }, [post]);

  if (loading) return <LoadingSpinner />;
  if (!post) return null;

  return (
    <>
      <Navbar />
      <div id="content" className="mt-4">
        <div className="container">
          <div className="mb-2">
            <button
              className="post-back-button btn btn-outline-secondary btn-sm"
              onClick={() => window.history.back()}
            >
              <span>Back to Blog</span>
            </button>
          </div>
          <div id="blog-detail" className="card">
            <div className="card-body">
              <h1 className="card-title">{post.title}</h1>
              <div className="card-text">
                <div className="row mb-2">
                  <p className="col-auto text-muted pr-0">
                    <i className="fa fa-clock-o mr-2"></i>{post.created_on}
                  </p>
                  {post.created_on !== post.updated_on && (
                    <p className="col-auto text-muted pr-0">
                      <i className="fa fa-pencil mr-2"></i>{post.updated_on}
                    </p>
                  )}
                  <span id="tag" className="col-auto col-xs-12 ml-3">
                    <span id="tag" className="row">
                      <i className="fa fa-tags text-muted my-auto"></i>
                      {post.tag.map(t => (
                        <Link key={t} to={`/blog/tags/${t.toLowerCase()}/`} className="badge m-1">{t}</Link>
                      ))}
                    </span>
                  </span>
                </div>
                {post.thumb && (
                  <div className="col-lg-6 col-md-8 col-sm-10 my-4 mx-auto">
                    <img
                      className="post-image img-fluid"
                      src={post.thumb}
                      alt={post.title}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="mt-3" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
