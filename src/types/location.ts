import { IPaginationQuery } from '@/types'

export interface ICountry {
  id: number
  iso3: string
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  provinces?: IProvince[]
}

export interface IProvince {
  id: number
  countryId?: number
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  country?: ICountry
  cities?: ICity[]
}

export interface ICity {
  id: number
  provinceId: number
  name: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  province?: IProvince
}

export interface ILocation {
  id: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  subLocations?: ISubLocation[]
}

export interface ISubLocation {
  id: number
  locationId: number
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  location?: ILocation
}

export interface IObjectLocation {
  id: number
  objectId: number
  locationId?: number
  subLocationId?: number
  countryId?: number
  provinceId?: number
  cityId?: number
  details?: string
  coordinates?: any
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  object?: any
  location?: ILocation
  subLocation?: ISubLocation
  country?: ICountry
  province?: IProvince
  city?: ICity
}

export interface ICountryQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface IProvinceQuery extends IPaginationQuery {
  search?: string
  countryId?: number
  status?: 'active' | 'inactive' | ''
}

export interface ICityQuery extends IPaginationQuery {
  search?: string
  provinceId?: number
  status?: 'active' | 'inactive' | ''
}

export interface ILocationQuery extends IPaginationQuery {
  search?: string
  status?: 'active' | 'inactive' | ''
}

export interface ISubLocationQuery extends IPaginationQuery {
  search?: string
  locationId?: number
  status?: 'active' | 'inactive' | ''
}
