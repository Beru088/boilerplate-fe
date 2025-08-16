'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import type {
  ArchiveObjectDetail,
  IChangeRequestInput,
  IChangeReviewInput,
  IObjectCreate,
  IObjectUpdate,
  IRelationCreate,
  ObjectRelationRow
} from '@/types/object'
import type { IApiResponse } from '@/types/api'

export const useCreateObject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: IObjectCreate & { files?: File[] }): Promise<IApiResponse<ArchiveObjectDetail>> => {
      const formData = new FormData()
      if (payload?.files && payload.files.length) {
        payload.files.forEach(f => formData.append('files', f))
      }
      const { files: _omitFiles, ...dataJson } = payload as any
      formData.append('data', JSON.stringify(dataJson))
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
      payload: IObjectUpdate & { files?: File[] }
    }): Promise<IApiResponse<ArchiveObjectDetail>> => {
      const formData = new FormData()
      if (payload?.files && payload.files.length) {
        payload.files.forEach(f => formData.append('files', f))
      }
      const { files: _omitFiles, ...dataJson } = payload as any
      formData.append('data', JSON.stringify(dataJson))
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
    mutationFn: async (id: number): Promise<IApiResponse<{}>> => {
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
    mutationFn: async (id: number): Promise<IApiResponse<ArchiveObjectDetail>> => {
      const response = await service.post(`/objects/${id}/restore`)
      return response.data
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['objects'] })
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
      payload: IRelationCreate
    }): Promise<IApiResponse<ObjectRelationRow>> => {
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
    mutationFn: async ({ id, relatedId }: { id: number; relatedId: number }): Promise<IApiResponse<{}>> => {
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
    mutationFn: async ({ id, tagId }: { id: number; tagId: number }): Promise<IApiResponse<{}>> => {
      const response = await service.del(`/objects/${id}/tags/${tagId}`)
      return response.data
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['object', vars.id] })
    }
  })
}

export const useCreateChangeRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload
    }: {
      id: number
      payload: IChangeRequestInput
    }): Promise<IApiResponse<ArchiveObjectDetail['relatedFrom'][number]>> => {
      const response = await service.post(`/objects/${id}/change-request`, payload)
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
      const response = await service.put(`/objects/change-request/${id}/review`, payload)
      return response.data
    }
  })
}

export const useCancelChangeRequest = () => {
  return useMutation({
    mutationFn: async (id: number): Promise<IApiResponse<any>> => {
      const response = await service.del(`/objects/change-request/${id}`)
      return response.data
    }
  })
}
