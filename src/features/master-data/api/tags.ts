'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { TagRow } from '@/types/object'
import type { IApiResponse } from '@/types/api'

export const useTags = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<IApiResponse<TagRow[]>> => {
      const response = await service.get('/tags')
      return response.data
    },
    staleTime: 10 * 60 * 1000
  })
  return {
    tags: data?.data ?? [],
    tagsLoading: isLoading,
    tagsFetched: isFetched,
    tagsError: isError,
    error,
    refetch
  }
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: Pick<TagRow, 'name'>): Promise<IApiResponse<TagRow>> => {
      const response = await service.post('/tags', payload)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<TagRow> }): Promise<IApiResponse<TagRow>> => {
      const response = await service.put(`/tags/${id}`, payload)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{ success: boolean }>> => {
      const response = await service.del(`/tags/${id}`)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tags'] })
  })
}
