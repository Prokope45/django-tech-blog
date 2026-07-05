import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { search } from '../api/search';
import type { SearchResults as SearchResultsType } from '../types/api';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResultsType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults(null);
      return;
    }
    setLoading(true);
    search(query).then(data => {
      setResults(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [query]);

  return (
    <>
      <Navbar />
      <div id="content" className="mt-4">
        <div id="search" className="container">
          {loading ? (
            <LoadingSpinner />
          ) : !results ? (
            <h3>No results found.</h3>
          ) : (
            <>
              <h2>Search Results for &ldquo;{query}&rdquo;</h2>

              {!results.index_results?.about_me?.length &&
                !results.index_results?.about_prokope?.length &&
                !results.blog_results?.length &&
                !results.gallery_results?.length && (
                <h3>No results found.</h3>
              )}

              {(results.index_results?.about_me?.length > 0 || results.index_results?.about_prokope?.length > 0) && (
                <div className="search-results-link">
                  <h3>Home</h3>
                  {results.index_results.about_me.map(item => (
                    <ul key={item.id} className="search-results-link">
                      <li>
                        <h4><Link to={`/#${item.about_me_title}`}>{item.about_me_title}</Link></h4>
                        <p>{item.about_me_description?.slice(0, 200)}...</p>
                      </li>
                    </ul>
                  ))}
                  {results.index_results.about_prokope.map(item => (
                    <ul key={item.id} className="search-results-link">
                      <li>
                        <h4><Link to={`/#${item.about_prokope_title}`}>{item.about_prokope_title}</Link></h4>
                        <p>{item.about_prokope_description?.slice(0, 200)}...</p>
                      </li>
                    </ul>
                  ))}
                </div>
              )}

              {results.blog_results?.length > 0 && (
                <div className="search-results-link">
                  <h3>Blog Articles</h3>
                  <ul>
                    {results.blog_results.map(post => (
                      <li key={post.id} className="mb-2 search-results-link">
                        <h4><Link to={`/blog/${post.slug}/`}>{post.title}</Link></h4>
                        <div dangerouslySetInnerHTML={{
                          __html: (post.content || '').replace(/<[^>]*>/g, '').slice(0, 200),
                        }} />
                        <span id="tag" className="d-inline">
                          <i className="fa text-muted fa-tags"></i>
                          {post.tag.map(t => (
                            <Link key={t} to={`/blog/tags/${t.toLowerCase()}/`} className="badge">{t}</Link>
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.gallery_results?.length > 0 && (
                <div className="search-results-link">
                  <h3>Galleries</h3>
                  <ul>
                    {results.gallery_results.map(result => (
                      <li key={result.id}>
                        <h4 className="mb-2">
                          <Link to={`/gallery/${result.slug}/`}>
                            {typeof result.country === 'string' ? result.country : (result.country as any).name}
                          </Link>
                        </h4>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
