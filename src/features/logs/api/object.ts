'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IObjectChangeLogQuery, ILogListResponse } from '@/types/logs'
import type { IApiResponse } from '@/types'

export const useObjectChangeLogs = (params: IObjectChangeLogQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['object-change-logs', params],
    queryFn: async (): Promise<IApiResponse<ILogListResponse>> => {
      const response = await service.get('/logs/object-changes', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    objectChangeLogs: (data?.data?.logs as any[]) || [],
    pagination: {
      total: data?.data?.total || 0,
      skip: data?.data?.skip || 0,
      take: data?.data?.take || 10,
      hasMore: data?.data?.hasMore || false
    },
    objectChangeLogsLoading: isLoading,
    objectChangeLogsFetched: isFetched,
    objectChangeLogsError: isError,
    error,
    refetch
  }
}
