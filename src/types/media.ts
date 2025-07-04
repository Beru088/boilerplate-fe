import { get, post, put, del } from '@/lib/axios';

export type MediaType = 'image' | 'video';

export interface MediaItem {
  id: number;
  type: MediaType;
  url: string;
}

export interface Media {
  id: number;
  title: string;
  description?: string;
  items: MediaItem[];
  createdAt: string;
  updatedAt: string;
}

import { z } from 'zod';

export const MediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().url(),
});

export const MediaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  items: z.array(MediaItemSchema).min(1),
});

export type CreateMediaInput = z.infer<typeof MediaSchema>;

export const getMedia = async () => {
  const res = await get('/media');
  return res.data;
};

export const createMedia = async (data: CreateMediaInput) => {
  const res = await post('/media', data);
  return res.data;
};

export const updateMedia = async (id: number, data: CreateMediaInput) => {
  const res = await put(`/media/${id}`, data);
  return res.data;
};

export const deleteMedia = async (id: number) => {
  const res = await del(`/media/${id}`);
  return res.data;
};
