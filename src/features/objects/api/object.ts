'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IObject } from '@/types/objects'
import type { IObjectRelation } from '@/types/object-relations'
import type { IApiResponse, IDataWithMetadata } from '@/types'

export type ObjectListParams = {
  search?: string
  categoryId?: number
  materialId?: number
  tag?: string
  status?: string
  skip?: number
  take?: number
}

export const useObjects = (params: ObjectListParams) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['objects', params],
    queryFn: async (): Promise<IDataWithMetadata<IObject[]>> => {
      const response = await service.get('/objects', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    objects: (data?.data as IObject[]) || [],
    pagination: data?.metadata?.pagination,
    objectsLoading: isLoading,
    objectsFetched: isFetched,
    objectsError: isError,
    error,
    refetch
  }
}

export const useObject = (id?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['object', id],
    queryFn: async (): Promise<IApiResponse<IObject>> => {
      const response = await service.get(`/objects/${id}`)

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    object: data?.data as IObject | undefined,
    objectLoading: isLoading,
    objectFetched: isFetched,
    objectError: isError,
    error,
    refetch
  }
}

export const useRelations = (id?: number) => {
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['object-relations', id],
    queryFn: async (): Promise<IApiResponse<IObjectRelation[]>> => {
      const response = await service.get(`/objects/${id}/relations`)

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000
  })

  return {
    relations: data?.data ?? [],
    relationsLoading: isLoading,
    relationsFetched: isFetched
  }
}
