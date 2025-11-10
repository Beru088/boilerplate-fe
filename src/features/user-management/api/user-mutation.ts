'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IApiResponse } from '@/types'
import { IUser } from '@/types/users'
import { toast } from 'sonner'

export interface ICreateUserData {
  fullname: string
  username: string
  email: string
  phone?: string
  isAdmin: boolean
  password: string
}

export interface IUpdateUserData {
  fullname?: string
  username?: string
  email?: string
  phone?: string
  isAdmin?: boolean
  password?: string
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userData: ICreateUserData): Promise<IApiResponse<IUser>> => {
      const response = await service.post('/users', userData)

      return response.data
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false
      })

      if (data.data) {
        queryClient.setQueryData(['user', data.data.id], data)
      }

      toast.success('User created successfully', {
        description: `${data.data?.fullname} has been added to the system`
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to create user'
      toast.error('User creation failed', {
        description: message
      })
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
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false
      })

      if (data.data) {
        queryClient.setQueryData(['user', variables.id], data)
      }

      toast.success('User updated successfully', {
        description: `${data.data?.fullname}'s information has been updated`
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update user'
      toast.error('User update failed', {
        description: message
      })
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

      queryClient.invalidateQueries({
        queryKey: ['users/contributor'],
        exact: false
      })
      queryClient.invalidateQueries({
        queryKey: ['users/admin'],
        exact: false
      })
      queryClient.invalidateQueries({
        queryKey: ['users/viewer'],
        exact: false
      })

      queryClient.removeQueries({ queryKey: ['user', id] })

      toast.success('User deleted successfully', {
        description: 'The user has been removed from the system'
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete user'
      toast.error('User deletion failed', {
        description: message
      })
    }
  })
}

export const useRestoreUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<IUser>> => {
      const response = await service.patch(`/users/${id}/restore`)

      return response.data
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        exact: false
      })

      if (data.data) {
        queryClient.setQueryData(['user', id], data)
      }

      toast.success('User restored successfully', {
        description: `${data.data?.fullname} has been restored and is now active`
      })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to restore user'
      toast.error('User restoration failed', {
        description: message
      })
    }
  })
}
