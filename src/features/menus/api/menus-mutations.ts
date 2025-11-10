'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IMenu } from '@/types'
import { IMenuCreate, IMenuUpdate } from '@/types/menus'
import { toast } from 'sonner'

export const useCreateMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (menuData: IMenuCreate) => {
      const response = await service.post('/menus', menuData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      toast.success('Menu created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create menu')
    }
  })
}

export const useUpdateMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...menuData }: { id: number } & IMenuUpdate) => {
      const response = await service.put(`/menus/${id}`, menuData)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      queryClient.invalidateQueries({ queryKey: ['menu', variables.id] })
      toast.success('Menu updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update menu')
    }
  })
}

export const useDeleteMenu = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (menuId: number) => {
      const response = await service.del(`/menus/${menuId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] })
      toast.success('Menu deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete menu')
    }
  })
}
