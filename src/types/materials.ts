import type { IPaginationQuery } from './index'

export interface IMaterial {
  id: number
  name: string
  nameEn?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface IMaterialQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface IMaterialCreate {
  name: string
  nameEn?: string
}

export interface IMaterialUpdate {
  name?: string
  nameEn?: string
}
