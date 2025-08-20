import type { IPaginationQuery } from './index'

export interface ICategory {
  id: number
  name: string
  nameEn?: string
  thumbnail?: string
  description?: string
  descriptionEn?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface ICategoryQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface ICategoryCreate {
  name: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  thumbnail?: string
}

export interface ICategoryUpdate {
  name?: string
  nameEn?: string
  description?: string
  descriptionEn?: string
  thumbnail?: string
}

export interface ICategoryCreateWithFile extends Omit<ICategoryCreate, 'thumbnail'> {
  thumbnail?: File
}
