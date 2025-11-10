export interface IGroup {
  id: number
  name: string
  code: string
  description?: string
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  users: Array<{
    id: number
    user: {
      id: number
      fullname: string
      username: string
      email: string
    }
  }>
}

export interface IGroupCreate {
  name: string
  code: string
  description?: string
  permissions: string[]
  isActive?: boolean
}

export interface IGroupUpdate {
  name?: string
  code?: string
  description?: string
  permissions?: string[]
  isActive?: boolean
}

export interface IGroupQuery {
  search?: string
  isActive?: boolean
  skip?: number
  take?: number
  sort?: 'newest' | 'oldest'
}

export interface IMenuPermission {
  id: number
  name: string
  code: string
  parentId?: number
  children?: IMenuPermission[]
}
