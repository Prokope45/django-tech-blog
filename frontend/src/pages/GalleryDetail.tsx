import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAlbum } from '../api/gallery';
import type { CountryAlbum, CityGallery } from '../types/api';

export default function GalleryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [album, setAlbum] = useState<CountryAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedCity = searchParams.get('city') || 'all';

  useEffect(() => {
    if (!slug) return;
    getAlbum(slug).then(data => {
      setAlbum(data);
      setLoading(false);
    });
  }, [slug]);

  useEffect(() => {
    if (loading || !album) return;

    const select = document.getElementById('city-filter') as HTMLSelectElement;
    if (select) {
      const handler = () => {
        const params = new URLSearchParams(searchParams);
        if (select.value === 'all') {
          params.delete('city');
        } else {
          params.set('city', select.value);
        }
        setSearchParams(params);
      };
      select.addEventListener('change', handler);
      return () => select.removeEventListener('change', handler);
    }
  }, [loading, album]);

  useEffect(() => {
    if (loading || !album) return;
    const elem = document.querySelector('#masonry-container');
    if (!elem) return;

    let msnry: any = null;
    const imagesLoaded = (window as any).imagesLoaded;

    function initializeMasonry() {
      if (msnry) msnry.destroy();
      msnry = new (window as any).Masonry(elem, {
        itemSelector: '.gallery_product:not(.hidden)',
        columnWidth: '.gallery_product',
        isFitWidth: true,
      });
      msnry.layout();
    }

    if (imagesLoaded) {
      imagesLoaded(elem).on('always', () => {
        initializeMasonry();
      });
    } else {
      initializeMasonry();
    }

    const items = document.querySelectorAll('.gallery_product');
    const filter = () => {
      items.forEach(item => {
        if (selectedCity === 'all') {
          item.classList.remove('hidden');
        } else if (item.classList.contains(selectedCity)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
      if (msnry) {
        msnry.reloadItems();
        msnry.layout();
      }
    };
    filter();
  }, [loading, album, selectedCity]);

  if (loading) return <LoadingSpinner />;
  if (!album) return null;

  const cities = Array.from(
    new Set(
      album.city_galleries.flatMap(g => g.city_photos.map(p => p.city?.toString()).filter(Boolean))
    )
  );

  return (
    <>
      <Navbar />
      <div id="content" className="mt-4">
        <section className="portfolio" id="portfolio">
          <div className="container">
            <div className="text-center">
              <h1 className="mb-0 card-title">{(album.country as any).name || album.country}</h1>
            </div>
            <div className="controls mx-2 mb-3" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div className="back-button-container">
                <button
                  className="post-back-button btn btn-outline-secondary"
                  onClick={() => window.history.back()}
                >
                  <span>Back to Gallery</span>
                </button>
              </div>
              <div className="form-group my-auto">
                <select
                  id="city-filter"
                  className="form-control"
                  value={selectedCity}
                  onChange={e => {
                    const params = new URLSearchParams(searchParams);
                    if (e.target.value === 'all') {
                      params.delete('city');
                    } else {
                      params.set('city', e.target.value);
                    }
                    setSearchParams(params);
                  }}
                >
                  <option value="all">All</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div id="masonry-container">
              {album.city_galleries.map((gallery: CityGallery) =>
                gallery.city_photos.map((photo, idx) => (
                  <div
                    key={`${photo.id}-${idx}`}
                    className={`gallery_product m-2 filter ${photo.city ? (photo.city as any).name || photo.city : ''}`}
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
      <Footer />
    </>
  );
}
