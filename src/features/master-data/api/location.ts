'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { ICountry, IProvince, ICity } from '@/types/location'
import type { IApiResponse } from '@/types'

export const useCountries = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['countries'],
    queryFn: async (): Promise<IApiResponse<ICountry[]>> => {
      const response = await service.get('/locations/countries')

      return response.data
    },
    staleTime: 10 * 60 * 1000
  })

  return {
    countries: data?.data ?? [],
    countriesLoading: isLoading,
    countriesFetched: isFetched,
    countriesError: isError,
    error,
    refetch
  }
}

export const useProvinces = (countryId?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['provinces', countryId],
    queryFn: async (): Promise<IApiResponse<IProvince[]>> => {
      const params = countryId ? `?countryId=${countryId}` : ''
      const response = await service.get(`/locations/provinces${params}`)

      return response.data
    },
    enabled: !countryId || countryId > 0,
    staleTime: 10 * 60 * 1000
  })

  return {
    provinces: data?.data ?? [],
    provincesLoading: isLoading,
    provincesFetched: isFetched,
    provincesError: isError,
    error,
    refetch
  }
}

export const useCities = (provinceId?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['cities', provinceId],
    queryFn: async (): Promise<IApiResponse<ICity[]>> => {
      const params = provinceId ? `?provinceId=${provinceId}` : ''
      const response = await service.get(`/locations/cities${params}`)

      return response.data
    },
    enabled: !provinceId || provinceId > 0,
    staleTime: 10 * 60 * 1000
  })

  return {
    cities: data?.data ?? [],
    citiesLoading: isLoading,
    citiesFetched: isFetched,
    citiesError: isError,
    error,
    refetch
  }
}
