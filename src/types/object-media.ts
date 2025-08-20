export interface IObjectMedia {
  id: number
  objectId: number
  isCover: boolean
  position: number
  url: string
  mime: string
  durationSec?: number
  sizeBytes?: number
  meta?: any
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface IObjectMediaInputItem {
  url: string
  mime: string
  position?: number
  isCover?: boolean
  durationSec?: number
  sizeBytes?: number
  meta?: any
}

export interface IObjectMediaUpdateItem extends Partial<IObjectMediaInputItem> {
  id: number
}
