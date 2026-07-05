import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer } from '../components/layout/BaseLayout';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getAlbums } from '../api/gallery';
import type { CountryAlbumList } from '../types/api';

export default function GalleryList() {
  const [albums, setAlbums] = useState<CountryAlbumList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAlbums().then(data => {
      setAlbums(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading || albums.length === 0) return;
    const carouselElements = document.querySelectorAll('#hover-carousel');
    carouselElements.forEach(carouselEl => {
      const carousel = new (window as any).bootstrap.Carousel(carouselEl, {
        interval: 1500,
        ride: false,
        pause: false,
        wrap: true,
      });
      carouselEl.addEventListener('mouseenter', () => {
        carousel.next();
        carousel.cycle();
      });
      carouselEl.addEventListener('mouseleave', () => {
        carousel.pause();
      });
    });
  }, [loading, albums]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div id="content" className="mt-4">
        <div className="container">
          <h1 className="text-center mb-4">Travel Gallery</h1>
          <div className="row justify-content-center">
            {albums.map(album => {
              const firstGallery = album.city_galleries?.[0];
              if (!firstGallery) return null;
              return (
                <Link
                  key={album.id}
                  id="carousel-link"
                  className="col-lg-3 col-md-4 col-sm-6 col-xs-6 p-0 m-2"
                  to={`/gallery/${album.slug}/`}
                >
                  <div id="hover-carousel" className="carousel slide">
                    <div className="carousel-inner">
                      <div className="carousel-caption d-flex h-100 align-items-center justify-content-center">
                        <h5>{album.country}</h5>
                      </div>
                      {firstGallery.city_photos.slice(0, 5).map((photo, idx) => (
                        <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                          <img src={photo.get_display_url} className="d-block w-100" alt={photo.title} />
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
