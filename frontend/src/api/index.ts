import client from './client';
import type { IndexData, Post, CountryAlbumList, PaginatedResponse } from '../types/api';

export async function getIndexData(): Promise<IndexData> {
  const response = await client.get('/index/');
  const data = response.data as PaginatedResponse<IndexData>;
  return (data.results ?? data)[0];
}

export async function getRecentPosts(): Promise<Post[]> {
  const response = await client.get('/posts/', {
    params: { ordering: '-updated_on', page: 1 },
  });
  const data = response.data as PaginatedResponse<Post>;
  return (data.results ?? []).slice(0, 2);
}

export interface RandomGallery {
  album: CountryAlbumList;
  countryName: string;
  city: string;
  photos: CountryAlbumList['city_galleries'][number]['city_photos'];
  slug: string;
}

export async function getRandomAlbum(): Promise<RandomGallery | null> {
  const response = await client.get('/country-albums/', { params: { page: 1 } });
  const data = response.data as PaginatedResponse<CountryAlbumList>;
  const albums = (data.results ?? []).filter(
    album => album.city_galleries.length > 0 &&
      album.city_galleries.some(g => g.city_photos.length > 0)
  );
  if (albums.length === 0) return null;
  const album = albums[Math.floor(Math.random() * albums.length)];
  const galleries = album.city_galleries.filter(g => g.city_photos.length > 0);
  if (galleries.length === 0) return null;
  const gallery = galleries[Math.floor(Math.random() * galleries.length)];
  return {
    album,
    countryName: album.country,
    city: gallery.city.name,
    photos: gallery.city_photos.slice(0, 10),
    slug: album.slug,
  };
}