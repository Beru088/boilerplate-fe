'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IApiResponse } from '@/types'
import { IUser } from '@/types/users'

export interface ICreateUserData {
  email: string
  name: string
  roleId: number
  password?: string
  userAbility?: { canDownload?: boolean }
}

export interface IUpdateUserData {
  email?: string
  name?: string
  roleId?: number
  password?: string
  userAbility?: { canDownload?: boolean }
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: ICreateUserData): Promise<IApiResponse<IUser>> => {
      const response = await service.post('/users', userData)

      return response.data
    },
    onSuccess: data => {
      const role = data.data?.role?.name || 'viewer'
      const normalizedRole = role === 'superadmin' ? 'admin' : role

      queryClient.invalidateQueries({
        queryKey: [`users/${normalizedRole}`]
      })

      if (data.data) {
        queryClient.setQueryData(['user', data.data.id], data)
      }
    },
    onError: error => {
      console.error('Create user failed:', error)
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: IUpdateUserData }): Promise<IApiResponse<IUser>> => {
      const response = await service.put(`/users/${id}`, userData)

      return response.data
    },
    onSuccess: (data, variables) => {
      const role = data.data?.role?.name || 'viewer'
      const normalizedRole = role === 'superadmin' ? 'admin' : role

      queryClient.invalidateQueries({
        queryKey: [`users/${normalizedRole}`]
      })

      if (data.data) {
        queryClient.setQueryData(['user', variables.id], data)
      }
    },
    onError: error => {
      console.error('Update user failed:', error)
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<{ success: boolean }>> => {
      const response = await service.del(`/users/${id}`)

      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false
      })

      queryClient.removeQueries({ queryKey: ['user', id] })
    },
    onError: error => {
      console.error('Delete user failed:', error)
    }
  })
}
