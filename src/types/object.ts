import { ISODate } from './api'

export type CategoryRow = {
  id: number
  name: string
  thumbnail?: string
  description?: string
  createdAt: ISODate
  updatedAt: ISODate
}

export type MaterialRow = {
  id: number
  name: string
  createdAt: ISODate
  updatedAt: ISODate
}

export type TagRow = {
  id: number
  name: string
  createdAt: ISODate
  updatedAt: ISODate
}

export type CategoryCreateInput = {
  name: string
  description?: string
  thumbnail: File | null
}

export type CategoryUpdateInput = {
  name?: string
  description?: string
  thumbnail?: File | null
}

export type ObjectMediaItem = {
  id: number
  objectId: number
  url: string
  mime: string
  isCover: boolean
  position: number
  durationSec?: number
  sizeBytes?: number
  meta?: any
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt?: ISODate | null
}

export type ArchiveObjectListItem = {
  id: number
  title: string
  description?: string
  category: CategoryRow
  material: MaterialRow
  objectTags: { tag: TagRow }[]
  media: ObjectMediaItem[]
  createdAt: ISODate
  updatedAt: ISODate
  deletedAt?: ISODate | null
}

export type ArchiveObjectDetail = ArchiveObjectListItem & {
  relatedFrom: { to: { id: number; title: string } }[]
  relatedTo: { from: { id: number; title: string } }[]
}

export type ObjectRelationRow = {
  id: number
  objectId: number
  relatedId: number
  relationType: string
  createdAt: ISODate
  updatedAt: ISODate
  from?: { id: number; title: string }
  to?: { id: number; title: string }
}

export type ChangeRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELED'

export type ChangeRequestRow = {
  id: number
  objectId: number
  proposedById: number
  reviewedById?: number | null
  status: ChangeRequestStatus
  reasonRejected?: string | null
  requestSnapshot: any
  submittedAt: ISODate
  reviewedAt?: ISODate | null
}

export type IObjectCreate = {
  title: string
  description?: string
  categoryId: number
  materialId: number
  coverIndex?: number
  media?: {
    url: string
    mime: string
    position?: number
    isCover?: boolean
  }[]
  tags?: string[]
}

export type IObjectUpdate = {
  title?: string
  description?: string
  categoryId?: number
  materialId?: number
  deleteMediaIds?: number[]
  mediaUpdates?: {
    id: number
    position?: number
    isCover?: boolean
  }[]
  coverIndexNew?: number
  tags?: string[]
}

export type IRelationCreate = {
  relatedId: number
  relationType: string
}

export type IChangeRequestInput = {
  requestSnapshot: any
}

export type IChangeReviewInput = {
  status: 'APPROVED' | 'REJECTED' | 'CANCELED'
  reasonRejected?: string
}

export type IObjectQuery = {
  search?: string
  categoryId?: number | string
  materialId?: number | string
  tag?: string
  status?: 'active' | 'inactive' | ''
  skip?: number
  take?: number
}
