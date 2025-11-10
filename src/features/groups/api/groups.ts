'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IDataWithMetadata } from '@/types'
import { IGroup, IGroupQuery } from '@/types/groups'

export const useGroups = (params: IGroupQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: [`groups`, params],
    queryFn: async (): Promise<IDataWithMetadata<IGroup[]>> => {
      const response = await service.get('/groups', params)
      return response.data
    }
  })

  return {
    groups: data?.data || [],
    pagination: data?.metadata?.pagination,
    groupsLoading: isLoading,
    groupsFetched: isFetched,
    groupsError: isError,
    error,
    refetch
  }
}

export const useGroup = (id: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['group', id],
    queryFn: async (): Promise<IDataWithMetadata<IGroup>> => {
      const response = await service.get(`/groups/${id}`)
      return response.data
    },
    enabled: !!id
  })

  return {
    group: data?.data,
    pagination: data?.metadata,
    groupLoading: isLoading,
    groupFetched: isFetched,
    groupError: isError,
    error,
    refetch
  }
}

export const useMenuPermissions = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['menu-permissions'],
    queryFn: async (): Promise<IDataWithMetadata<any[]>> => {
      const response = await service.get('/groups/menus/permissions')
      return response.data
    }
  })

  return {
    menuPermissions: data?.data || [],
    menuPermissionsLoading: isLoading,
    menuPermissionsFetched: isFetched,
    menuPermissionsError: isError,
    error,
    refetch
  }
}
