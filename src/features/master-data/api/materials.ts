'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IMaterial, IMaterialCreate, IMaterialUpdate } from '@/types/materials'
import type { IApiResponse } from '@/types'

export const useMaterials = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['materials'],
    queryFn: async (): Promise<IApiResponse<IMaterial[]>> => {
      const response = await service.get('/materials')

      return response.data
    },
    staleTime: 10 * 60 * 1000
  })

  return {
    materials: data?.data ?? [],
    materialsLoading: isLoading,
    materialsFetched: isFetched,
    materialsError: isError,
    error,
    refetch
  }
}

export const useCreateMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: IMaterialCreate): Promise<IApiResponse<IMaterial>> => {
      const response = await service.post('/materials', payload)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] })
  })
}

export const useUpdateMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: IMaterialUpdate }): Promise<IApiResponse<IMaterial>> => {
      const response = await service.put(`/materials/${id}`, payload)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] })
  })
}

export const useDeleteMaterial = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{ success: boolean }>> => {
      const response = await service.del(`/materials/${id}`)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['materials'] })
  })
}
