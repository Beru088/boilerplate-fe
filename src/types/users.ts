import type { IPaginationQuery } from './index'
import type { IRole } from './roles'

export interface IUser {
  id: number
  name: string
  email: string
  password?: string
  roleId: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  role?: IRole
}

export interface IUserQuery extends IPaginationQuery {
  search?: string
  role?: string
  status?: string
}

export interface IUserCreate {
  name: string
  email: string
  password?: string
  roleId: number
}

export interface IUserUpdate {
  name?: string
  email?: string
  password?: string
  roleId?: number
}
