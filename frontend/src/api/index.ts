import client from './client';
import type { IndexData, Post, CountryAlbum } from '../types/api';

export async function getIndexData(): Promise<IndexData> {
  const response = await client.get<IndexData[]>('/index/');
  return response.data[0];
}

export async function getRecentPosts(): Promise<Post[]> {
  const response = await client.get('/posts/', {
    params: { limit: 2, ordering: '-updated_on' },
  });
  const data = response.data as any;
  return data.results || data;
}

export async function getRandomAlbum(): Promise<{ album: CountryAlbum; city: string; photos: any[] } | null> {
  const response = await client.get('/country-albums/');
  const data = response.data as any;
  const albums: CountryAlbum[] = data.results || data;
  if (albums.length === 0) return null;
  const album = albums[Math.floor(Math.random() * albums.length)];
  const galleries = album.city_galleries;
  if (galleries.length === 0) return null;
  const gallery = galleries[Math.floor(Math.random() * galleries.length)];
  return {
    album,
    city: gallery.city.name,
    photos: gallery.city_photos.slice(0, 10),
  };
}
