import type { IPaginationQuery } from './index'

export interface ITag {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface ITagQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface ITagCreate {
  name: string
}

export interface ITagUpdate {
  name?: string
}

export interface IObjectTagCreate {
  objectId: number
  tagIds: number[]
}

export interface IObjectTagRemove {
  objectId: number
  tagId: number
}
