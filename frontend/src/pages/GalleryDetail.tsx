import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAlbum } from '../api/gallery';
import type { CountryAlbum } from '../types/api';

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [album, setAlbum] = useState<CountryAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<MasonryInstance | null>(null);

  const selectedCity = searchParams.get('city') || 'all';

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setAlbum(null);
    getAlbum(slug)
      .then(data => {
        if (!cancelled) setAlbum(data);
      })
      .catch(() => {
        if (!cancelled) setAlbum(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (album) {
      document.title = `Prokope | ${album.country.name || album.country}`;
    }
  }, [album]);

  const cities = useMemo(() => {
    if (!album) return [] as string[];
    return Array.from(new Set(album.city_galleries.map(g => g.city.name))).sort();
  }, [album]);

  const onCityChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('city');
    } else {
      params.set('city', value);
    }
    setSearchParams(params);
  };

  useEffect(() => {
    if (loading || !album) return;
    const elem = containerRef.current;
    if (!elem) return;

    const filterAndLayout = () => {
      const items = elem.querySelectorAll<HTMLElement>('.gallery_product');
      items.forEach(item => {
        const cityName = item.getAttribute('data-city');
        const hidden = selectedCity !== 'all' && cityName !== selectedCity;
        item.classList.toggle('hidden', hidden);
      });
      if (masonryRef.current) {
        masonryRef.current.reloadItems();
        masonryRef.current.layout();
      }
    };

    const initMasonry = () => {
      if (masonryRef.current) masonryRef.current.destroy();
      if (typeof window.Masonry !== 'function') return;
      masonryRef.current = new window.Masonry(elem, {
        itemSelector: '.gallery_product:not(.hidden)',
        columnWidth: '.gallery_product',
        isFitWidth: true,
      });
      filterAndLayout();
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
    filterAndLayout();

    return () => {
      window.removeEventListener('lazyload:image', onImageLoaded);
      if (masonryRef.current) masonryRef.current.destroy();
      masonryRef.current = null;
    };
  }, [loading, album, selectedCity]);

  if (loading) return <LoadingSpinner />;
  if (!album) return <LoadingSpinner />;

  const countryName = album.country.name;

  return (
    <div className="mt-4">
      <section className="portfolio" id="portfolio">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-0 card-title">{countryName}</h1>
          </div>
          <div className="controls mx-2 mb-3">
            <div className="back-button-container">
              <button className="post-back-button btn btn-outline-secondary" onClick={() => window.history.back()}>
                <span>Back to Gallery</span>
              </button>
            </div>

            <div className="form-group my-auto">
              <select
                id="city-filter"
                className="form-control"
                name="city"
                value={selectedCity}
                onChange={e => onCityChange(e.target.value)}
              >
                <option value="all">All</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div id="masonry-container" ref={containerRef}>
            {album.city_galleries.map(gallery =>
              gallery.city_photos.map((photo, idx) => (
                <div
                  key={`${photo.id}-${idx}`}
                  className={`gallery_product m-2 filter ${gallery.city.name}`}
                  data-city={gallery.city.name}
                >
                  <a
                    title={`${photo.title} on ${photo.date_taken}`}
                    href={photo.get_display_url}
                    data-lightbox={gallery.slug}
                  >
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
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}