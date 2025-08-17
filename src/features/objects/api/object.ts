'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { ArchiveObjectDetail, ArchiveObjectListItem, ObjectRelationRow } from '@/types/object'
import type { IApiResponse } from '@/types/api'

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
    queryFn: async (): Promise<IApiResponse<ArchiveObjectListItem[]>> => {
      const response = await service.get('/objects', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    objects: (data?.data as ArchiveObjectListItem[]) || [],
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
    queryFn: async (): Promise<IApiResponse<ArchiveObjectDetail>> => {
      const response = await service.get(`/objects/${id}`)

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    object: data?.data as ArchiveObjectDetail | undefined,
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
    queryFn: async (): Promise<IApiResponse<ObjectRelationRow[]>> => {
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
