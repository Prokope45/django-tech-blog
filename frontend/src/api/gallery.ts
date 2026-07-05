import client from './client';
import type {
  CountryAlbum as CountryAlbumDetail,
  CountryAlbumList,
  City,
  PaginatedResponse,
} from '../types/api';

export async function getAlbums(): Promise<CountryAlbumList[]> {
  const response = await client.get<PaginatedResponse<CountryAlbumList>>('/country-albums/');
  return response.data.results || (response.data as any);
}

export async function getAlbum(slug: string): Promise<CountryAlbumDetail> {
  const response = await client.get<CountryAlbumDetail>(`/country-albums/${slug}/`);
  return response.data;
}

export async function getCities(country?: string): Promise<City[]> {
  const response = await client.get<City[]>('/cities/', {
    params: country ? { country } : {},
  });
  return response.data;
}
