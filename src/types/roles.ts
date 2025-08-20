import type { IPaginationQuery } from './index'

export interface IRole {
  id: number
  name: string
  description?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface IRoleQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface IRoleCreate {
  name: string
  description?: string
}

export interface IRoleUpdate {
  name?: string
  description?: string
}
