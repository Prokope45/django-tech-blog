import client from './client';
import type { Post, PostDetail, Tag, PaginatedResponse } from '../types/api';

export interface GetPostsParams {
  page?: number;
  sort?: string;
  order?: string;
  tags?: string[];
}

export async function getPosts(params: GetPostsParams = {}): Promise<PaginatedResponse<Post>> {
  const { page = 1, sort, order = 'desc', tags } = params;
  const query: Record<string, unknown> = { page };
  if (sort) {
    query.ordering = `${order === 'asc' ? '' : '-'}${sort}`;
  }
  if (tags && tags.length > 0) {
    query.tags = tags;
  }
  const response = await client.get<PaginatedResponse<Post>>('/posts/', { params: query });
  return response.data;
}

export async function getPost(slug: string): Promise<PostDetail> {
  const response = await client.get<PostDetail>(`/posts/${slug}/`);
  return response.data;
}

export async function getTags(): Promise<Tag[]> {
  const response = await client.get<Tag[]>('/tags/');
  return response.data;
}