import client from './client';
import type { SearchResults } from '../types/api';

export async function search(query: string): Promise<SearchResults> {
  const response = await client.get<SearchResults>('/search/', {
    params: { q: query },
  });
  return response.data;
}
