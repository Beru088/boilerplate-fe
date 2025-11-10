'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IDataWithMetadata } from '@/types'
import { IAuditLog, IAuditLogQuery, IAuditStats } from '@/types/audit'

export const useAuditLogs = (params: IAuditLogQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: [`audit-logs`, params],
    queryFn: async (): Promise<IDataWithMetadata<IAuditLog[]>> => {
      const response = await service.get('/audit/logs', params)
      return response.data
    }
  })

  return {
    auditLogs: data?.data || [],
    pagination: data?.metadata?.pagination,
    auditLogsLoading: isLoading,
    auditLogsFetched: isFetched,
    auditLogsError: isError,
    error,
    refetch
  }
}

export const useAuditStats = () => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['audit-stats'],
    queryFn: async (): Promise<IDataWithMetadata<IAuditStats>> => {
      const response = await service.get('/audit/stats')
      return response.data
    }
  })

  return {
    auditStats: data?.data,
    auditStatsLoading: isLoading,
    auditStatsFetched: isFetched,
    auditStatsError: isError,
    error,
    refetch
  }
}

export const useRecentActivity = (limit?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['recent-activity', limit],
    queryFn: async (): Promise<IDataWithMetadata<IAuditLog[]>> => {
      const response = await service.get('/audit/recent', { limit })
      return response.data
    }
  })

  return {
    recentActivity: data?.data || [],
    recentActivityLoading: isLoading,
    recentActivityFetched: isFetched,
    recentActivityError: isError,
    error,
    refetch
  }
}

export const useUserActivity = (userId: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['user-activity', userId],
    queryFn: async (): Promise<IDataWithMetadata<IAuditLog[]>> => {
      const response = await service.get(`/audit/user/${userId}`)
      return response.data
    },
    enabled: !!userId
  })

  return {
    userActivity: data?.data || [],
    userActivityLoading: isLoading,
    userActivityFetched: isFetched,
    userActivityError: isError,
    error,
    refetch
  }
}
