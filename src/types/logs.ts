import type { IPaginationQuery, IListResponse } from './index'
import type { IObject } from './objects'
import type { IUser } from './users'
import type { ChangeAction } from './change-requests'

export interface IObjectChangeLog {
  id: number
  objectId: number
  userId: number
  activityLogId: number
  action: ChangeAction
  changeSummary: string
  previousSnapshot: any
  newSnapshot: any
  createdAt: Date
  object?: IObject
  user?: IUser
}

export interface IActivityLog {
  id: number
  userId: number
  action: string
  targetId: number
  targetType: string
  details?: string
  createdAt: Date
  user?: IUser
}

export interface IVisitLog {
  id: number
  objectId: number
  userId: number
  ipAddress: string
  visitedAt: Date
  object?: IObject
  user?: IUser
}

export interface ILogQuery extends IPaginationQuery {
  userId?: number
  objectId?: number
  action?: string
  targetType?: string
}

export interface IActivityLogQuery extends ILogQuery {
  targetType?: string
  action?: string
}

export interface ILogListResponse extends IListResponse {
  logs: Array<IObjectChangeLog | IActivityLog>
}

export interface IActivityLogCreate {
  userId: number
  action: string
  targetId: number
  targetType: string
  details?: string
}

export interface IVisitLogQuery extends IPaginationQuery {
  objectId?: number
  userId?: number
  ipAddress?: string
}

export interface IVisitLogCreate {
  objectId: number
  userId: number
  ipAddress: string
}
