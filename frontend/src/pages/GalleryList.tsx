import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAlbums } from '../api/gallery';
import { getCached } from '../api/client';
import type { CountryAlbumList, CityPhoto, PaginatedResponse } from '../types/api';

export default function GalleryList() {
  const [albums, setAlbums] = useState<CountryAlbumList[]>(() => {
    const cached = getCached<PaginatedResponse<CountryAlbumList> | CountryAlbumList[]>('/country-albums/');
    if (!cached) return [];
    return Array.isArray(cached) ? cached : (cached.results ?? []);
  });
  const [loading, setLoading] = useState(albums.length === 0);

  useEffect(() => {
    document.title = 'Prokope | Gallery';
  }, []);

  useEffect(() => {
    const el = document.getElementById('content');
    if (el) el.setAttribute('data-loading', (loading && albums.length === 0) ? 'true' : 'false');
    return () => {
      el?.removeAttribute('data-loading');
    };
  }, [loading, albums.length]);

  useEffect(() => {
    getAlbums()
      .then(data => setAlbums(data))
      .catch(() => {
        setAlbums(prev => (prev.length === 0 ? [] : prev));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading && albums.length === 0) return <LoadingSpinner delay={800} />;

  return (
    <div className="mt-4">
      <div className="container">
        <h1 className="text-center mb-4">Travel Gallery</h1>
        <div className="row justify-content-center">
          {albums.map(album => {
            const firstGallery = album.city_galleries?.find(g => g.city_photos.length > 0);
            if (!firstGallery) return null;
            return (
              <Link
                key={album.id}
                id="carousel-link"
                className="col-lg-3 col-md-4 col-sm-6 col-xs-6 p-0 m-2"
                to={`/gallery/${album.slug}`}
              >
                <AlbumCarousel photos={firstGallery.city_photos.slice(0, 5)} country={album.country} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function AlbumCarousel({ photos, country }: { photos: CityPhoto[]; country: string }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const start = () => {
    stop();
    timerRef.current = window.setInterval(() => {
      setActive(prev => (prev + 1) % photos.length);
    }, 1500);
  };

  const stop = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      id="hover-carousel"
      className="carousel slide"
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      <div className="carousel-inner">
        <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
          <h5>{country}</h5>
        </div>
        {photos.map((photo, idx) => (
          <div key={photo.id} className={`carousel-item ${idx === active ? 'active' : ''}`}>
            <img src={photo.get_display_url} className="d-block w-100" alt={photo.title} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  );
}