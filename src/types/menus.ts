export interface IMenuCreate {
  name: string
  code: string
  embedUrl?: string
  provider?: string
  icon?: string
  parentId?: number
  order?: number
  children?: Array<{
    name: string
    code: string
    embedUrl?: string
    provider?: string
    icon?: string
    order?: number
    children?: Array<{
      name: string
      code: string
      embedUrl: string
      provider?: string
      order?: number
    }>
  }>
}

export interface IMenuUpdate {
  name?: string
  code?: string
  embedUrl?: string
  provider?: string
  icon?: string
  parentId?: number
  order?: number
  isActive?: boolean
}

export interface IMenuQuery {
  search?: string
  isActive?: boolean
  parentId?: number
  skip?: number
  take?: number
  sort?: 'newest' | 'oldest'
}
