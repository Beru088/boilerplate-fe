import type { IObject } from './objects'

export interface IObjectRelation {
  id: number
  objectId: number
  relatedId: number
  relationType: string
  relationTypeEn?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  from?: IObject
  to?: IObject
}

export interface IObjectRelationQuery {
  objectId: number
}

export interface IObjectRelationCreate {
  objectId: number
  relatedId: number
  relationType: string
  relationTypeEn?: string
}

export interface IObjectRelationRemove {
  objectId: number
  relatedId: number
}

export interface IObjectRelationUpdate {
  relationType?: string
  relationTypeEn?: string
}
