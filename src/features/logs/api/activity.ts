'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IActivityLogQuery, ILogListResponse } from '@/types/logs'
import type { IApiResponse } from '@/types'

export const useActivityLogs = (params: IActivityLogQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['activity-logs', params],
    queryFn: async (): Promise<IApiResponse<ILogListResponse>> => {
      const response = await service.get('/logs/activities', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    activityLogs: (data?.data?.logs as any[]) || [],
    pagination: {
      total: data?.data?.total || 0,
      skip: data?.data?.skip || 0,
      take: data?.data?.take || 10,
      hasMore: data?.data?.hasMore || false
    },
    activityLogsLoading: isLoading,
    activityLogsFetched: isFetched,
    activityLogsError: isError,
    error,
    refetch
  }
}
