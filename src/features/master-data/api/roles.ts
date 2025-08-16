'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IApiResponse } from '@/types/api'
import { IRole } from '@/types/role'

export const useRoles = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['roles'],
    queryFn: async (): Promise<IApiResponse<IRole[]>> => {
      const response = await service.get('/roles')
      return response.data
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000
  })

  return {
    roles: data?.data || [],
    rolesLoading: isLoading,
    rolesFetched: isFetched,
    rolesError: isError,
    error,
    refetch
  }
}
