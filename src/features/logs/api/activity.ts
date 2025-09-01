'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IActivityLogQuery, ILogListResponse, IVisitLog, IVisitLogQuery } from '@/types/logs'
import type { IApiResponse, IDataWithMetadata } from '@/types'

export const useActivityLogs = (params: IActivityLogQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['activity-logs', params],
    queryFn: async (): Promise<IDataWithMetadata<ILogListResponse>> => {
      const response = await service.get('/logs/activities', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    activityLogs: (data?.data?.logs as any[]) || [],
    pagination: data?.metadata?.pagination,
    activityLogsLoading: isLoading,
    activityLogsFetched: isFetched,
    activityLogsError: isError,
    error,
    refetch
  }
}

export const useVisitLogsForActivityLog = (activityLogId: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['visit-logs-for-activity', activityLogId],
    queryFn: async (): Promise<IApiResponse<IVisitLog[]>> => {
      const response = await service.get(`/logs/activities/${activityLogId}/visits`)

      return response.data
    },
    enabled: !!activityLogId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    visitLogs: data?.data || [],
    visitLogsLoading: isLoading,
    visitLogsFetched: isFetched,
    visitLogsError: isError,
    error,
    refetch
  }
}

export const useActivityLog = (id: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['activity-log', id],
    queryFn: async (): Promise<IApiResponse<any>> => {
      const response = await service.get(`/logs/activities`, { id, take: 1 })

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    activityLog: data?.data?.logs?.[0],
    activityLogLoading: isLoading,
    activityLogFetched: isFetched,
    activityLogError: isError,
    error,
    refetch
  }
}

export const useVisitLogs = (params: IVisitLogQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['visit-logs', params],
    queryFn: async (): Promise<IApiResponse<{ data: IVisitLog[]; metadata: any }>> => {
      const response = await service.get('/logs/visits', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    visitLogs: data?.data?.data || [],
    pagination: data?.data?.metadata || {},
    visitLogsLoading: isLoading,
    visitLogsFetched: isFetched,
    visitLogsError: isError,
    error,
    refetch
  }
}

export const useVisitLog = (id: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['visit-log', id],
    queryFn: async (): Promise<IApiResponse<IVisitLog>> => {
      const response = await service.get(`/logs/visits/${id}`)

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    visitLog: data?.data,
    visitLogLoading: isLoading,
    visitLogFetched: isFetched,
    visitLogError: isError,
    error,
    refetch
  }
}

export const useVisitStats = (objectId?: number, userId?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['visit-stats', objectId, userId],
    queryFn: async (): Promise<IApiResponse<any>> => {
      const params: any = {}
      if (objectId) params.objectId = objectId
      if (userId) params.userId = userId
      const response = await service.get('/logs/visits/stats', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    visitStats: data?.data,
    visitStatsLoading: isLoading,
    visitStatsFetched: isFetched,
    visitStatsError: isError,
    error,
    refetch
  }
}
