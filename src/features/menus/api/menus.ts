'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IDataWithMetadata } from '@/types'
import { IMenu } from '@/types'

export const useMenus = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['menus'],
    queryFn: async (): Promise<IDataWithMetadata<IMenu[]>> => {
      const response = await service.get('/menus')
      return response.data
    }
  })

  return {
    menus: data?.data || [],
    menusLoading: isLoading,
    menusFetched: isFetched,
    menusError: isError,
    error,
    refetch
  }
}

export const useMenu = (id: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['menu', id],
    queryFn: async (): Promise<IDataWithMetadata<IMenu>> => {
      const response = await service.get(`/menus/${id}`)
      return response.data
    },
    enabled: !!id
  })

  return {
    menu: data?.data,
    menuLoading: isLoading,
    menuFetched: isFetched,
    menuError: isError,
    error,
    refetch
  }
}

export const useMyMenus = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['my-menus'],
    queryFn: async (): Promise<IDataWithMetadata<IMenu[]>> => {
      const response = await service.get('/menus/my-menus')
      return response.data
    }
  })

  return {
    myMenus: data?.data || [],
    myMenusLoading: isLoading,
    myMenusFetched: isFetched,
    myMenusError: isError,
    error,
    refetch
  }
}
