import { Service } from '@/lib/axios';
import { z } from 'zod';

export const CreateMediaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateMediaSchema = CreateMediaSchema.partial().extend({
  items: z
    .array(
      z.object({
        id: z.number(),
        action: z.enum(['keep', 'delete']),
      })
    )
    .optional(),
});

export const MediaItemSchema = z.object({
  file: z
    .any()
    .refine((f): f is File => f instanceof File, { message: 'File is required' }),
});

export type CreateMediaData = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaData = z.infer<typeof UpdateMediaSchema>;

export const getMedia = () => {
  return Service.get('/media');
};

export const getMediaById = (id: number) =>
  Service.get(`/media/${id}`);

export const createMedia = async (
  data: CreateMediaData,
  files: File[]
) => {
  CreateMediaSchema.parse(data);

  const form = new FormData();
  form.append('media', JSON.stringify(data));
  files.forEach((file) => form.append('mediaFiles', file));

  return Service.post('/media', form);
};

export const updateMedia = async (
  id: number,
  data: UpdateMediaData,
  files: File[] = []
) => {
  UpdateMediaSchema.parse(data);

  const form = new FormData();
  form.append('media', JSON.stringify(data));
  files.forEach((file) => form.append('mediaFiles', file));

  return Service.put(`/media/${id}`, form);
};

export const deleteMedia = (id: number) =>
  Service.del(`/media/${id}`);

export const deleteMediaItem = (itemId: number) =>
  Service.del(`/media/items/${itemId}`);