'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IObjectChangeLog } from '@/types/logs'
import type { IApiResponse } from '@/types'

export const useObjectChangeLog = (activityLogId: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['object-change-log', activityLogId],
    queryFn: async (): Promise<IApiResponse<IObjectChangeLog[]>> => {
      const response = await service.get(`/logs/activities/${activityLogId}/object-changes`)

      return response.data
    },
    enabled: !!activityLogId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    objectChangeLog: data?.data || [],
    objectChangeLogLoading: isLoading,
    objectChangeLogFetched: isFetched,
    objectChangeLogError: isError,
    error,
    refetch
  }
}
