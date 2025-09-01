'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type { IChangeReviewInput } from '@/types/change-requests'
import type { IObjectCreate, IObjectUpdate, IObject } from '@/types/objects'
import type { IObjectRelationCreate, IObjectRelation } from '@/types/object-relations'
import type { IApiResponse } from '@/types'

export const useCreateObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: IObjectCreate & { files?: File[]; coverIndex?: number }
    ): Promise<IApiResponse<IObject>> => {
      const formData = new FormData()
      const { files, coverIndex, ...dataJson } = payload as any

      formData.append('data', JSON.stringify(dataJson))
      if (files && files.length) {
        files.forEach((f: File) => formData.append('files', f))
      }
      if (coverIndex !== undefined) {
        formData.append('coverIndex', JSON.stringify(coverIndex))
      }
      const response = await service.post('/objects', formData)

      return response.data
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      if (data?.data?.id) {
        queryClient.setQueryData(['object', data.data.id], data)
      }
    }
  })
}

export const useUpdateObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: IObjectUpdate & {
        files?: File[]
        deleteMediaIds?: number[]
        mediaUpdates?: any[]
        coverIndex?: number
      }
    }): Promise<IApiResponse<IObject>> => {
      console.log('Mutation payload received:', payload)

      const formData = new FormData()
      const { files, deleteMediaIds, mediaUpdates, coverIndex, ...dataJson } = payload as any

      console.log('Form data being sent:', {
        dataJson,
        filesCount: files?.length || 0,
        deleteMediaIds,
        mediaUpdates,
        coverIndex
      })

      formData.append('data', JSON.stringify(dataJson))
      if (files && files.length) {
        files.forEach((f: File) => formData.append('files', f))
      }
      if (deleteMediaIds && deleteMediaIds.length) {
        formData.append('deleteMediaIds', JSON.stringify(deleteMediaIds))
      }
      if (mediaUpdates && mediaUpdates.length) {
        formData.append('mediaUpdates', JSON.stringify(mediaUpdates))
      }
      if (coverIndex !== undefined) {
        formData.append('coverIndex', JSON.stringify(coverIndex))
      }

      console.log('FormData entries:')
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value)
      }

      const response = await service.put(`/objects/${id}`, formData)

      return response.data
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
      if (data?.data) queryClient.setQueryData(['object', vars.id], data)
    }
  })
}

export const useDeleteObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse> => {
      const response = await service.del(`/objects/${id}`)

      return response.data
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.removeQueries({ queryKey: ['object', id] })
    }
  })
}

export const useRestoreObject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<IObject>> => {
      const response = await service.post(`/objects/${id}/restore`)

      return response.data
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
      queryClient.invalidateQueries({ queryKey: ['deleted-objects'] })
      queryClient.invalidateQueries({ queryKey: ['object', id] })
    }
  })
}

export const useUploadMedia = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, files }: { id: number; files: File[] }): Promise<IApiResponse<{ count: number }>> => {
      const formData = new FormData()
      files.forEach(f => formData.append('media', f))
      const response = await service.post(`/objects/${id}/media`, formData)

      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useCreateRelation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: IObjectRelationCreate
    }): Promise<IApiResponse<IObjectRelation>> => {
      const response = await service.post(`/objects/${id}/relations`, payload)

      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object-relations', vars.id] })
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useDeleteRelation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, relatedId }: { id: number; relatedId: number }): Promise<IApiResponse> => {
      const response = await service.del(`/objects/${id}/relations/${relatedId}`)

      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object-relations', vars.id] })
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useAddTags = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, tags }: { id: number; tags: string[] }): Promise<IApiResponse<{ count: number }>> => {
      const response = await service.post(`/objects/${id}/tags`, { tags })

      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useRemoveTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, tagId }: { id: number; tagId: number }): Promise<IApiResponse> => {
      const response = await service.del(`/objects/${id}/tags/${tagId}`)

      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useReviewChangeRequest = () => {
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: IChangeReviewInput }): Promise<IApiResponse<any>> => {
      const response = await service.put(`/change-requests/${id}/review`, payload)

      return response.data
    }
  })
}

export const useCancelChangeRequest = () => {
  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<any>> => {
      const response = await service.del(`/change-requests/${id}`)

      return response.data
    }
  })
}
