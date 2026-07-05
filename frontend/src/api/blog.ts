import client from './client';
import type { Post, PostDetail, Tag, PaginatedResponse } from '../types/api';

export async function getPosts(params?: {
  page?: number;
  sort?: string;
  order?: string;
  tags?: string;
}): Promise<PaginatedResponse<Post>> {
  const response = await client.get<PaginatedResponse<Post>>('/posts/', {
    params: {
      page: params?.page || 1,
      ordering: params?.sort
        ? `${params.order === 'desc' ? '-' : ''}${params.sort}`
        : undefined,
      tags__name__in: params?.tags,
    },
  });
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
