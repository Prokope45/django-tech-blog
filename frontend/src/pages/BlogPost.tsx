import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TagBadge from '../components/common/TagBadge';
import { getPost } from '../api/blog';
import { formatDate } from '../utils/format';
import type { PostDetail } from '../types/api';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      navigate('/404', { replace: true });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setPost(null);
    getPost(slug)
      .then(data => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) navigate('/404', { replace: true });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  useEffect(() => {
    if (post) {
      document.title = `Prokope | ${post.title}`;
    }
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const content = document.getElementById('blog-content');
    if (!content) return;

    // Highlight code blocks added from the serialized content.
    if (typeof Prism !== 'undefined') {
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }

    // Wrap content images in lightbox anchors (skip images already wrapped).
    const images = content.querySelectorAll<HTMLImageElement>('img');
    images.forEach(img => {
      if (img.parentElement?.tagName.toLowerCase() === 'a' && img.parentElement.hasAttribute('data-lightbox')) {
        return;
      }
      if (img.closest('#blog-content img') === null) return;
      const link = document.createElement('a');
      link.href = img.currentSrc || img.src;
      link.setAttribute('data-lightbox', 'article-images');
      link.style.display = 'inline-block';
      img.parentNode?.insertBefore(link, img);
      link.appendChild(img);
    });
  }, [post]);

  if (loading) return <LoadingSpinner />;
  if (!post) return null;

  return (
    <div className="mt-4">
      <div className="container">
        <div className="mb-2">
          <button className="post-back-button btn btn-outline-secondary btn-sm" onClick={() => window.history.back()}>
            <span>Back to Blog</span>
          </button>
        </div>
        <div id="blog-detail" className="card">
          <div className="card-body">
            <h1 className="card-title">{post.title}</h1>
            <div className="card-text">
              <div className="row mb-2">
                <p className="col-auto text-muted pr-0">
                  <i className="fa fa-clock-o mr-2"></i>
                  {formatDate(post.created_on)}
                </p>
                {post.created_on !== post.updated_on && (
                  <p className="col-auto text-muted pr-0">
                    <i className="fa fa-pencil mr-2"></i>
                    {formatDate(post.updated_on)}
                  </p>
                )}
                <span id="tag" className="col-auto col-xs-12 ml-3">
                  <span id="tag" className="row">
                    <i className="fa fa-tags text-muted my-auto"></i>
                    {post.tag.map(tag => (
                      <TagBadge key={tag.name} name={tag.name} slug={tag.slug} />
                    ))}
                  </span>
                </span>
              </div>
              {post.thumb && (
                <div className="col-lg-6 col-md-8 col-sm-10 my-4 mx-auto p-0">
                  <img className="post-image img-fluid" src={post.thumb} alt={post.title} loading="lazy" />
                </div>
              )}
              <div id="blog-content" className="mt-3" dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}