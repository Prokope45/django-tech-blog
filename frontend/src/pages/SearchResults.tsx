import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TagBadge from '../components/common/TagBadge';
import { search } from '../api/search';
import { stripTags, truncateWords } from '../utils/format';
import type { SearchResults as SearchResultsType, SearchBlogItem } from '../types/api';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResultsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    document.title = `Prokope | Search Results for "${query}"`;
    setLoading(true);
    search(query)
      .then(data => {
        if (!cancelled) setResults(data);
      })
      .catch(() => {
        if (!cancelled) setResults(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query]);

  if (loading) return <LoadingSpinner />;

  const errorMessage = results?.error;
  const empty =
    results &&
    !results.about_me?.length &&
    !results.about_prokope?.length &&
    !results.blog?.length &&
    !results.gallery?.length;

  return (
    <div className="mt-4">
      <div id="search" className="container">
        {errorMessage ? (
          <div className="alert alert-danger">{errorMessage}</div>
        ) : (
          <>
            <h2>Search Results for &ldquo;{query}&rdquo;</h2>

            {empty && (
              <>
                <h3>No results found.</h3>
                <dotlottie-player
                  id="links"
                  className="mx-auto"
                  src="https://lottie.host/9c2c19f7-9b81-463f-a47a-7c90425f1f90/Qbzk1DIKrd.lottie"
                  background="transparent"
                  speed={1}
                  style={{ width: 300, height: 300 }}
                  loop
                  autoplay
                ></dotlottie-player>
              </>
            )}

            {((results?.about_me?.length ?? 0) + (results?.about_prokope?.length ?? 0)) > 0 && (
              <div className="search-results-link">
                <h3>Home</h3>
                {results!.about_me.map(item => (
                  <ul key={item.id} className="search-results-link lazy-section" data-lazy="section">
                    <li>
                      <h4>
                        <Link to={`/#${encodeURIComponent(item.about_me_title)}`}>{item.about_me_title}</Link>
                      </h4>
                      <p>{truncateWords(item.about_me_description, 30)}</p>
                    </li>
                  </ul>
                ))}
                {results!.about_prokope.map(item => (
                  <ul key={item.id} className="search-results-link lazy-section" data-lazy="section">
                    <li>
                      <h4>
                        <Link to={`/#${encodeURIComponent(item.about_prokope_title)}`}>
                          {item.about_prokope_title}
                        </Link>
                      </h4>
                      <p>{truncateWords(item.about_prokope_description, 30)}</p>
                    </li>
                  </ul>
                ))}
              </div>
            )}

            {results?.blog && results.blog.length > 0 && (
              <div className="search-results-link">
                <h3>Blog Articles</h3>
                <ul>
                  {results.blog.map((post, idx) => (
                    <SearchBlogItemRow key={post.id} post={post} isLast={idx === results!.blog!.length - 1} />
                  ))}
                </ul>
              </div>
            )}

            {results?.gallery && results.gallery.length > 0 && (
              <div className="search-results-link">
                <h3>Galleries</h3>
                <ul>
                  {results.gallery.map(result => (
                    <li key={result.id} className="lazy-section" data-lazy="section">
                      <h4 className="mb-2">
                        <Link to={`/gallery/${result.slug}`}>
                          {result.country}
                        </Link>
                      </h4>
                      <div className="mb-2">
                        {result.city_galleries?.map(gallery => (
                          <div key={gallery.id}>
                            <h5>{gallery.city?.name}</h5>
                            <div className="row photo-row">
                              <div>
                                {gallery.city_photos?.slice(0, 5).map(photo => (
                                  <img
                                    key={photo.id}
                                    className="travel-photo m-2"
                                    src={photo.get_thumbnail_url}
                                    alt={`${photo.title}: ${photo.caption}`}
                                    loading="lazy"
                                    style={{ width: 200, height: 'auto' }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchBlogItemRow({ post, isLast }: { post: SearchBlogItem; isLast: boolean }) {
  return (
    <li className="mb-2 search-results-link lazy-section" data-lazy="section">
      <h4>
        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
      </h4>
      <p>{truncateWords(stripTags(post.content || ''), 50)}</p>
      <span id="tag" className="d-inline">
        <i className="fa text-muted fa-tags"></i>
        {post.tag.map((name, i) => (
          <TagBadge key={`${name}-${i}`} name={name} />
        ))}
      </span>
      {!isLast && <hr />}
    </li>
  );
}