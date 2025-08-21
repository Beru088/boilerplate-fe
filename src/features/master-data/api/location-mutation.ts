'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type {
  ILocation,
  ISubLocation,
  ILocationCreate,
  ILocationUpdate,
  ISubLocationCreate,
  ISubLocationUpdate
} from '@/types/location'
import type { IApiResponse } from '@/types'

export const useCreateLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ILocationCreate): Promise<IApiResponse<ILocation>> => {
      const response = await service.post('/locations', payload)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] })
  })
}

export const useUpdateLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: ILocationUpdate }): Promise<IApiResponse<ILocation>> => {
      const response = await service.put(`/locations/${id}`, payload)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] })
  })
}

export const useDeleteLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{ success: boolean }>> => {
      const response = await service.del(`/locations/${id}`)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] })
  })
}

export const useCreateSubLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ISubLocationCreate): Promise<IApiResponse<ISubLocation>> => {
      const response = await service.post('/sub-locations', payload)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-locations'] })
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export const useUpdateSubLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: ISubLocationUpdate
    }): Promise<IApiResponse<ISubLocation>> => {
      const response = await service.put(`/sub-locations/${id}`, payload)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-locations'] })
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}

export const useDeleteSubLocation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{ success: boolean }>> => {
      const response = await service.del(`/sub-locations/${id}`)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub-locations'] })
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    }
  })
}
