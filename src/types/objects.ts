import type { IPaginationQuery } from './index'
import type { ICategory } from './categories'
import type { IMaterial } from './materials'
import type { ITag } from './tags'
import type { IObjectMedia, IObjectMediaInputItem, IObjectMediaUpdateItem } from './object-media'

export interface IObject {
  id: number
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  categoryId: number
  materialId: number
  category?: ICategory
  material?: IMaterial
  media?: IObjectMedia[]
  objectTags?: Array<{ tag: ITag }>
  relatedFrom?: Array<{ to: IObject }>
  relatedTo?: Array<{ from: IObject }>
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface IObjectQuery extends IPaginationQuery {
  search?: string
  categoryId?: number | string
  materialId?: number | string
  tag?: string
  status?: 'active' | 'inactive' | ''
}

export interface IObjectCreate {
  title: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  categoryId: number
  materialId: number
  tags?: string[]
}

export interface IObjectUpdate {
  title?: string
  titleEn?: string
  description?: string
  descriptionEn?: string
  categoryId?: number
  materialId?: number
  tags?: string[]
}

export interface IObjectCreateWithMedia extends IObjectCreate {
  media?: IObjectMediaInputItem[]
  coverIndex?: number
}

export interface IObjectUpdateWithMedia extends IObjectUpdate {
  media?: IObjectMediaInputItem[]
  mediaAdd?: IObjectMediaInputItem[]
  mediaRemoveIds?: number[]
  mediaUpdates?: IObjectMediaUpdateItem[]
  deleteMediaIds?: number[]
  coverIndexNew?: number
}

// Re-export media types for convenience
export type { IObjectMediaInputItem, IObjectMediaUpdateItem } from './object-media'
