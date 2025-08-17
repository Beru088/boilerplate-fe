'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IApiResponse } from '@/types/api'
import { IUser, IUserOption } from '@/types/user'

export const useUsers = (params: IUserOption) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: [`users/${params.role}`, params],
    queryFn: async (): Promise<IApiResponse<IUser[]>> => {
      const response = await service.get('/users', params)

      return response.data
    }
  })

  return {
    users: data?.data || [],
    pagination: data?.metadata?.pagination,
    usersLoading: isLoading,
    usersFetched: isFetched,
    usersError: isError,
    error,
    refetch
  }
}

export const useUser = (id: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<IApiResponse<IUser>> => {
      const response = await service.get(`users/${id}`)

      return response.data
    },
    enabled: !!id
  })

  return {
    user: data?.data,
    pagination: data?.metadata,
    userLoading: isLoading,
    userFetched: isFetched,
    userError: isError,
    error,
    refetch
  }
}
