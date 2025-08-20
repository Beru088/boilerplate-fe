'use client'

import { useQuery } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IObjectChangeRequest, IChangeRequestQuery, IChangeRequestListResponse } from '@/types/change-requests'
import type { IApiResponse } from '@/types'

export const useChangeRequests = (params: IChangeRequestQuery) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['change-requests', params],
    queryFn: async (): Promise<IApiResponse<IChangeRequestListResponse>> => {
      const response = await service.get('/change-requests', params)

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    changeRequests: (data?.data?.requests as IObjectChangeRequest[]) || [],
    pagination: {
      total: data?.data?.total || 0,
      skip: data?.data?.skip || 0,
      take: data?.data?.take || 10,
      hasMore: data?.data?.hasMore || false
    },
    changeRequestsLoading: isLoading,
    changeRequestsFetched: isFetched,
    changeRequestsError: isError,
    error,
    refetch
  }
}

export const useChangeRequest = (id?: number) => {
  const { data, isLoading, isFetched, isError, error, refetch } = useQuery({
    queryKey: ['change-request', id],
    queryFn: async (): Promise<IApiResponse<IObjectChangeRequest>> => {
      const response = await service.get(`/change-requests/${id}`)

      return response.data
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })

  return {
    changeRequest: data?.data as IObjectChangeRequest | undefined,
    changeRequestLoading: isLoading,
    changeRequestFetched: isFetched,
    changeRequestError: isError,
    error,
    refetch
  }
}
