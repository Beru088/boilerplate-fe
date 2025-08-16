export type ISODate = string

export interface ILoginCredentials {
  email: string
  password: string
}

export interface IApiError {
  message: string
  status?: number
}

export interface IPaginationMetadataType {
  totalData: number
  totalPages: number
  currentPage: number
  pageSize: number
}

export interface IMetadataType {
  pagination?: IPaginationMetadataType
}

export interface IDataWithMetadataType<TData = any> {
  data: TData
  metadata: IMetadataType
}

export interface IApiResponse<T = any> {
  data: T
  metadata?: IMetadataType
  message?: string
  status?: number
}

export interface IPaginatedResponse<T = any> {
  data: T[]
  metadata: IMetadataType
  message?: string
  status?: number
}
