'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IVisitLogCreate } from '@/types/logs'
import type { IApiResponse } from '@/types'

export const useRecordVisit = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IVisitLogCreate): Promise<IApiResponse<any>> => {
      const response = await service.post('/logs/visits', data)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visit-logs'] })
      queryClient.invalidateQueries({ queryKey: ['visit-stats'] })
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
    }
  })
}

export const useRecordDownload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { objectId: number; userId: number }): Promise<IApiResponse<any>> => {
      const response = await service.post('/logs/downloads', data)

      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] })
    }
  })
}
