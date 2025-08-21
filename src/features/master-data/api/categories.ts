'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { ICategory, ICategoryCreate, ICategoryUpdate } from '@/types/categories'
import type { IApiResponse } from '@/types'

export const useCategories = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<IApiResponse<ICategory[]>> => {
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

type CreateCategoryInput = ICategoryCreate & { files?: File }

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateCategoryInput): Promise<IApiResponse<ICategory>> => {
      const formData = new FormData()
      const { files, ...dataJson } = payload as any

      formData.append('data', JSON.stringify(dataJson))
      if (files) {
        formData.append('files', files)
      }
      const response = await service.post('/categories', formData)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  })
}

type UpdateCategoryInput = ICategoryUpdate & { files?: File }

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: UpdateCategoryInput
    }): Promise<IApiResponse<ICategory>> => {
      const formData = new FormData()
      const { files, ...dataJson } = payload as any

      formData.append('data', JSON.stringify(dataJson))
      if (files) {
        formData.append('files', files)
      }
      const response = await service.put(`/categories/${id}`, formData)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse> => {
      const response = await service.del(`/categories/${id}`)

      return response.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
  })
}
