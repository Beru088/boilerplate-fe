import type { IPaginationQuery, IListResponse } from './index'
import type { IObject } from './objects'
import type { IUser } from './users'

export type ChangeAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'REVERT'
export type RequestStatus = 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'CANCELED'

export interface IObjectChangeRequest {
  id: number
  objectId: number
  proposedById: number
  reviewedById?: number
  reviewedById2?: number
  status: RequestStatus
  reasonRejected?: string
  requestSnapshot: any
  submittedAt: Date
  reviewedAt?: Date
  reviewedAt2?: Date
  object?: IObject
  proposedBy?: IUser
  reviewedBy?: IUser
  reviewedBy2?: IUser
}

export interface IChangeRequestQuery extends IPaginationQuery {
  objectId?: number
  status?: RequestStatus
  proposedById?: number
  reviewedById?: number
}

export interface IChangeRequestListResponse extends IListResponse {
  requests: IObjectChangeRequest[]
}

export interface IChangeRequestInput {
  requestSnapshot: any
}

export interface IChangeReviewInput {
  status: 'APPROVED' | 'REJECTED' | 'CANCELED'
  reasonRejected?: string
  submit?: boolean
}

export interface IStructuredSnapshot {
  action: ChangeAction
  objectData: {
    basic?: {
      code?: string
      title?: string
      titleEn?: string
      description?: string
      descriptionEn?: string
      dateTaken?: Date
      categoryId?: number
      materialId?: number
      category?: { id: number; name: string; nameEn?: string }
      material?: { id: number; name: string; nameEn?: string }
    }
    media?: {
      toAdd?: Array<{
        url: string
        mime: string
        position: number
        isCover: boolean
        sizeBytes?: number
        durationSec?: number
      }>
      toUpdate?: Array<{
        id: number
        position?: number
        isCover?: boolean
        mime?: string
      }>
      toDelete?: Array<{
        id: number
        url: string
        mime: string
      }>
    }
    tags?: {
      current: Array<{ id: number; name: string }>
      proposed: Array<{ id?: number; name: string }>
    }
    location?: {
      current?: {
        locationId?: number
        subLocationId?: number
        details?: string
        location?: { name: string }
        subLocation?: { name: string }
      }
      proposed?: {
        locationId?: number
        subLocationId?: number
        details?: string
        location?: { name: string }
        subLocation?: { name: string }
      }
    }
    relations?: {
      current: Array<{
        id: number
        relatedId: number
        relationType: string
        relationTypeEn?: string
        relatedObject: { id: number; title: string }
      }>
      proposed: Array<{
        id?: number
        relatedId: number
        relationType: string
        relationTypeEn?: string
        relatedObject: { id: number; title: string }
      }>
    }
  }
  summary: string
  changeReason?: string
}
