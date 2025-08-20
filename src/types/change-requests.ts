import type { IPaginationQuery, IListResponse } from './index'
import type { IObject } from './objects'
import type { IUser } from './users'

export type ChangeAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'REVERT'
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED'

export interface IObjectChangeRequest {
  id: number
  objectId: number
  proposedById: number
  reviewedById?: number
  status: RequestStatus
  reasonRejected?: string
  requestSnapshot: any
  submittedAt: Date
  reviewedAt?: Date
  object?: IObject
  proposedBy?: IUser
  reviewedBy?: IUser
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
}
