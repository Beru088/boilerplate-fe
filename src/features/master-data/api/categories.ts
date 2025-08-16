'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { CategoryRow } from '@/types/object'
import type { IApiResponse } from '@/types/api'

export const useCategories = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<IApiResponse<CategoryRow[]>> => {
      const response = await service.get('/categories')
      return response.data
    },
    staleTime: 10 * 60 * 1000
  })
  return {
    categories: data?.data ?? [],
    categoriesLoading: isLoading,
    categoriesFetched: isFetched,
    categoriesError: isError,
    error,
    refetch
  }
}

type CreateCategoryInput = (Pick<CategoryRow, 'name'> & { description?: string; thumbnail?: string }) | FormData

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateCategoryInput): Promise<IApiResponse<CategoryRow>> => {
      const response = await service.post('/categories', payload)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  })
}

type UpdateCategoryInput = Partial<CategoryRow> | FormData

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: UpdateCategoryInput
    }): Promise<IApiResponse<CategoryRow>> => {
      const response = await service.put(`/categories/${id}`, payload)
      return response.data
    },
    onSuccess: (_d, v) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{}>> => {
      const response = await service.del(`/categories/${id}`)
      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  })
}
