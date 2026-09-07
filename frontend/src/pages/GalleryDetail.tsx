import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ReactMasonry from '../components/common/ReactMasonry';
import SelectPicker from '../components/common/SelectPicker';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAlbum } from '../api/gallery';
import { getCached } from '../api/client';
import type { CountryAlbum, CityPhoto } from '../types/api';

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState<CountryAlbum | null>(() => {
    return slug ? getCached<CountryAlbum>(`/country-albums/${slug}/`) : null;
  });
  const [loading, setLoading] = useState(!album);

  const selectedCity = searchParams.get('city') || 'all';

  useEffect(() => {
    const el = document.getElementById('content');
    if (el) el.setAttribute('data-loading', (loading && !album) ? 'true' : 'false');
    return () => {
      el?.removeAttribute('data-loading');
    };
  }, [loading, album]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const cached = getCached<CountryAlbum>(`/country-albums/${slug}/`);
    if (cached) {
      setAlbum(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    getAlbum(slug)
      .then(data => {
        if (!cancelled) setAlbum(data);
      })
      .catch(() => {
        if (!cancelled && !cached) setAlbum(null);
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

  const cityOptions = useMemo(() => {
    return [
      { value: 'all', label: 'All' },
      ...cities.map(c => ({ value: c, label: c })),
    ];
  }, [cities]);

  const onCityChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('city');
    } else {
      params.set('city', value);
    }
    setSearchParams(params);
  };

  const allFilteredPhotos = useMemo(() => {
    if (!album) return [];
    const list: { photo: CityPhoto; cityName: string }[] = [];
    const galleries =
      selectedCity === 'all'
        ? album.city_galleries
        : album.city_galleries.filter(g => g.city.name === selectedCity);

    galleries.forEach(gallery => {
      gallery.city_photos.forEach(photo => {
        list.push({ photo, cityName: gallery.city.name });
      });
    });
    return list;
  }, [album, selectedCity]);

  if (loading && !album) return <LoadingSpinner delay={800} />;
  if (!album) return <LoadingSpinner delay={800} />;

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
              <button
                className="post-back-button btn btn-outline-secondary"
                onClick={() => navigate('/gallery')}
              >
                <span>Back to Gallery</span>
              </button>
            </div>

            <div className="form-group my-auto">
              <SelectPicker
                id="city-filter"
                name="city"
                value={selectedCity}
                onChange={onCityChange}
                options={cityOptions}
                placeholder="Filter by city"
              />
            </div>
          </div>

          <ReactMasonry id="masonry-container">
            {allFilteredPhotos.map(({ photo, cityName }, idx) => (
              <div
                key={`${photo.id}-${idx}`}
                className={`gallery_product m-2 filter ${cityName}`}
                data-city={cityName}
              >
                <a
                  title={`${photo.title} on ${photo.date_taken}`}
                  href={photo.get_display_url}
                  data-lightbox="gallery"
                >
                  <span className="lazy-image-wrapper" data-masonry-item>
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
          </ReactMasonry>
        </div>
      </section>
    </div>
  );
}
