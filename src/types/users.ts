import type { IPaginationQuery } from './index'

export interface IUser {
  id: number
  fullname: string
  username: string
  email: string
  phone?: string
  password?: string
  isAdmin: boolean
  groups?: Array<{
    id: number
    group: {
      id: number
      name: string
      code: string
      description?: string
      permissions: string[]
      isActive: boolean
    }
  }>
  deletedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface IUserQuery extends IPaginationQuery {
  search?: string
  isAdmin?: boolean
  status?: string
}

export interface IUserCreate {
  fullname: string
  username: string
  email: string
  phone?: string
  password: string
  isAdmin?: boolean
}

export interface IUserUpdate {
  fullname?: string
  username?: string
  email?: string
  phone?: string
  password?: string
  isAdmin?: boolean
}
