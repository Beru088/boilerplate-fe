export type MediaType = 'image' | 'video';

export default interface Media {
  id: number;
  title: string;
  description?: string;
  items?: MediaItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: number;
  mediaId: number;
  type: MediaType;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
