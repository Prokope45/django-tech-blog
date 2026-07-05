import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getPosts, getTags } from '../api/blog';
import type { Post, Tag } from '../types/api';

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSort = searchParams.get('sort') || '';
  const currentOrder = searchParams.get('order') || 'desc';
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts({
      page: currentPage,
      sort: currentSort || undefined,
      order: currentOrder,
      tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
    }).then(data => {
      setPosts(data.results);
      setTotalCount(data.count);
      setLoading(false);
    });
  }, [currentPage, currentSort, currentOrder, selectedTags.join(',')]);

  const totalPages = Math.ceil(totalCount / 20);

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const toggleTag = (tagName: string) => {
    const current = new Set(selectedTags);
    if (current.has(tagName)) {
      current.delete(tagName);
    } else {
      current.add(tagName);
    }
    const params = new URLSearchParams(searchParams);
    const tags = Array.from(current);
    if (tags.length > 0) {
      params.set('tags', tags.join(','));
    } else {
      params.delete('tags');
    }
    params.delete('page');
    setSearchParams(params);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div id="content" className="mt-4">
        <div className="container">
          <h1 className="text-center">Articles</h1>

          <div className="d-flex flex-wrap justify-content-end mb-2">
            <div className="w-auto w-100 mb-2 mb-md-0 mr-md-2">
              <div className="input-group">
                <select
                  className="form-control"
                  value={currentSort}
                  onChange={e => setParam('sort', e.target.value)}
                >
                  <option value="" disabled>Sort by...</option>
                  <option value="created_on">Created</option>
                  <option value="updated_on">Updated</option>
                  <option value="title">Title</option>
                </select>
                <div className="input-group-append">
                  <button
                    id="filter-button"
                    onClick={() => setParam('order', 'asc')}
                    className="btn btn-outline-secondary"
                    disabled={!currentSort}
                  >
                    <i className="fa fa-sort-amount-asc"></i>
                  </button>
                  <button
                    id="filter-button"
                    onClick={() => setParam('order', 'desc')}
                    className="btn btn-outline-secondary"
                    disabled={!currentSort}
                  >
                    <i className="fa fa-sort-amount-desc"></i>
                  </button>
                </div>
              </div>
            </div>

            <div className="w-auto w-100">
              <div className="input-group">
                <div className="btn-group-toggle flex-wrap" data-toggle="buttons">
                  {tags.map(tag => (
                    <label
                      key={tag.id}
                      className={`btn btn-outline-secondary m-1 ${selectedTags.includes(tag.name) ? 'active' : ''}`}
                      style={{
                        backgroundColor: selectedTags.includes(tag.name) ? 'var(--button-bg-color)' : 'transparent',
                        color: selectedTags.includes(tag.name) ? 'var(--button-text-color)' : undefined,
                        borderColor: 'var(--button-border-color)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.name)}
                        onChange={() => toggleTag(tag.name)}
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {posts.map(post => (
            <div key={post.id} id="blog" className="card mb-2">
              <Link to={`/blog/${post.slug}/`} className="card-body" style={{ display: 'block' }}>
                <h2 className="card-title">{post.title}</h2>
                <div className="card-text">
                  <div className="row mb-2">
                    <span className="col-auto text-muted pr-0">
                      <i className="fa fa-clock-o mr-2"></i>{post.created_on}
                    </span>
                    {post.created_on !== post.updated_on && (
                      <span className="col-auto text-muted pr-0">
                        <i className="fa fa-pencil mr-2"></i>{post.updated_on}
                      </span>
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
                </div>
                <span className="read-more">Read More...</span>
              </Link>
            </div>
          ))}

          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
      <Footer />
    </>
  );
}
