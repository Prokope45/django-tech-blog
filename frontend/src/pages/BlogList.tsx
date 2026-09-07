import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import TagBadge from '../components/common/TagBadge';
import SelectPicker from '../components/common/SelectPicker';
import TagSelectPicker from '../components/common/TagSelectPicker';
import { getPosts, getTags } from '../api/blog';
import { slugToTagName } from '../utils/format';
import type { Post, Tag } from '../types/api';

const PAGE_SIZE = 5;

export default function BlogList() {
  const { tag: tagSlug } = useParams<{ tag: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = tagSlug
      ? `Prokope | Articles tagged "${tagSlug}"`
      : 'Prokope | Articles';
  }, [tagSlug]);

  useEffect(() => {
    const el = document.getElementById('content');
    if (el) el.setAttribute('data-loading', (loading && posts.length === 0) ? 'true' : 'false');
    return () => {
      el?.removeAttribute('data-loading');
    };
  }, [loading, posts.length]);

  useEffect(() => {
    getTags().then(setTags).catch(() => {});
  }, []);

  const currentPage = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const currentSort = searchParams.get('sort') || '';
  const currentOrder = searchParams.get('order') || 'desc';

  // Tag selection: path param (post_by_tag slug) supersedes ?tags= query list.
  const activeTagName = useMemo(() => slugToTagName(tags, tagSlug || ''), [tags, tagSlug]);
  const selectedTags = useMemo(() => {
    if (tagSlug) return activeTagName ? [activeTagName] : [];
    return searchParams.get('tags')?.split(',').filter(Boolean) || [];
  }, [tagSlug, activeTagName, searchParams]);
  const selectedTagsKey = selectedTags.join(',');

  useEffect(() => {
    if (tagSlug && tags.length === 0) return;
    let cancelled = false;
    setLoading(true);
    const tagNames = selectedTagsKey ? selectedTagsKey.split(',') : [];

    getPosts({
      page: currentPage,
      sort: currentSort || undefined,
      order: currentOrder,
      tags: tagNames.length > 0 ? tagNames : undefined,
    })
      .then(data => {
        if (cancelled) return;
        setTotalCount(data.count);
        if (!cancelled) setPosts(data.results);
      })
      .catch(() => {
        if (!cancelled) setPosts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentPage, currentSort, currentOrder, selectedTagsKey, tagSlug, tags.length]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const setParam = (key: string, value: string) => {
    if (tagSlug && key === 'sort') {
      navigate(`/blog?${key}=${value}&page=1`);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    setSearchParams(params);
  };

  const toggleTag = (tagName: string) => {
    if (tagSlug) {
      navigate(`/blog?tags=${encodeURIComponent(tagName)}`);
      return;
    }
    const current = new Set(selectedTags);
    if (current.has(tagName)) {
      current.delete(tagName);
    } else {
      current.add(tagName);
    }
    const params = new URLSearchParams(searchParams);
    const list = Array.from(current);
    if (list.length > 0) {
      params.set('tags', list.join(','));
    } else {
      params.delete('tags');
    }
    params.delete('page');
    setSearchParams(params);
  };

  if (loading && posts.length === 0) return <LoadingSpinner delay={800} />;

  return (
    <div className="pt-4">
      <div className="container">
        <h1 className="text-center">
          {tagSlug ? `Articles tagged "${activeTagName || tagSlug}"` : 'Articles'}
        </h1>

        <div className="d-flex flex-wrap justify-content-end mb-2">
          <div className="w-auto w-100 mb-2 mb-md-0 mr-md-2">
            <div className="input-group">
              <SelectPicker
                id="sort-select"
                value={currentSort}
                onChange={val => setParam('sort', val)}
                options={[
                  { value: 'created_on', label: 'Created' },
                  { value: 'updated_on', label: 'Updated' },
                  { value: 'title', label: 'Title' },
                ]}
                placeholder="Sort by..."
              />
              <div className="input-group-append">
                <button
                  type="button"
                  id="filter-button"
                  onClick={() => setParam('order', 'asc')}
                  className="btn btn-outline-secondary"
                  disabled={!currentSort}
                  title="Sort ascending"
                >
                  <i className="fa fa-sort-amount-asc"></i>
                </button>
                <button
                  type="button"
                  id="filter-button"
                  onClick={() => setParam('order', 'desc')}
                  className="btn btn-outline-secondary"
                  disabled={!currentSort}
                  title="Sort descending"
                >
                  <i className="fa fa-sort-amount-desc"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="w-auto w-100">
            <div className="input-group">
              <TagSelectPicker
                tags={tags}
                selectedTags={selectedTags}
                onToggle={toggleTag}
                onSelectAll={() => {
                  const allNames = tags.map(t => t.name);
                  const params = new URLSearchParams(searchParams);
                  params.set('tags', allNames.join(','));
                  params.delete('page');
                  setSearchParams(params);
                }}
                onDeselectAll={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('tags');
                  params.delete('page');
                  setSearchParams(params);
                }}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  id="filter-button"
                  className="btn btn-outline-secondary my-auto"
                  title="Filter by tags"
                >
                  <i className="fa fa-filter"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {posts.map(post => (
          <PostCard key={post.id} post={post} tags={tags} />
        ))}

        {!loading && posts.length === 0 && (
          <div className="text-center my-5">
            <h4>No articles found.</h4>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

function PostCard({ post, tags }: { post: Post; tags: Tag[] }) {
  const navigate = useNavigate();
  const thumb = post.thumb;
  const content = post.content;
  const hasLongExcerpt = content.length >= 450;

  const slugMap = useMemo(() => new Map(tags.map(t => [t.name, t.slug])), [tags]);
  const postTags = useMemo(
    () =>
      post.tag.map(tagName => {
        const slug = slugMap.get(tagName) || tagName.toLowerCase();
        return { name: tagName, slug, key: slug };
      }),
    [post.tag, slugMap]
  );

  return (
    <div id="blog" className="card mb-2 lazy-section" data-lazy="section">
      <div className="card-body" onClick={() => navigate(`/blog/${post.slug}`)} style={{ cursor: 'pointer' }}>
        <h2 className="card-title">{post.title}</h2>
        <div className="card-text">
          <div className="row mb-2">
            <span className="col-auto text-muted pr-0">
              <i className="fa fa-clock-o mr-2"></i>
              {post.created_on}
            </span>
            {post.created_on !== post.updated_on && (
              <span className="col-auto text-muted pr-0">
                <i className="fa fa-pencil mr-2"></i>
                {post.updated_on}
              </span>
            )}
            <span id="tag" className="col-auto col-xs-12 ml-3">
              <span id="tag" className="row">
                <i className="fa fa-tags text-muted my-auto"></i>
                {postTags.map(({ name, slug, key }) => (
                  <TagBadge key={key} name={name} slug={slug} stopPropagation />
                ))}
              </span>
            </span>
          </div>

          {thumb ? (
            <div className="row no-gutters">
              <div className="col-lg-8 order-2 order-lg-1">
                <p dangerouslySetInnerHTML={{ __html: content.slice(0, 450) }} />
                {hasLongExcerpt && <span>...</span>}
              </div>
              <div className="col-lg-4 order-1 order-lg-2 text-center mx-auto p-0">
                <img
                  className="post-image-preview img-fluid"
                  src={thumb}
                  alt={post.title}
                  style={{ maxWidth: 250 }}
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <p dangerouslySetInnerHTML={{ __html: content.slice(0, 450) }} />
          )}
        </div>
        <span className="read-more">Read More...</span>
      </div>
    </div>
  );
}