import client from './client';
import type { ContactPayload } from '../types/api';

export async function submitContact(data: ContactPayload): Promise<void> {
  await client.post('/contact/', data);
}
