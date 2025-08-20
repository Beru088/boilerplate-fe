export interface IPaginationQuery {
  skip?: number
  take?: number
}

export interface IPaginationMetadata {
  totalData: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface IListResponse<T = any> {
  total: number
  skip: number
  take: number
  hasMore: boolean
  [key: string]: T[] | number | boolean
}

export interface IApiResponse<T = any> {
  data: T
  message: string
  status?: number
}

export interface IApiError {
  message: string
  errors?: any
  status: number
}

export interface IDataWithMetadata<T = any> {
  data: T
  metadata: {
    pagination?: IPaginationMetadata
  }
}

export interface ILoginCredentials {
  email: string
  password: string
}

export interface ILoginResponse {
  user: any
  token: string
  message: string
}

export interface IDataStoredInToken {
  id: number
}

export interface ITokenData {
  token: string
  expiresIn: number
}

export interface IGoogleUser {
  id: string
  displayName: string
  emails: Array<{ value: string; verified: boolean }>
  photos?: Array<{ value: string }>
}

export interface IFormData<T> {
  data: T
  media?: File[]
}

export enum ObjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum MaterialStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum TagStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}
