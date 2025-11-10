'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { IGroupCreate, IGroupUpdate } from '@/types/groups'
import { toast } from 'sonner'

export const useCreateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (groupData: IGroupCreate) => {
      const response = await service.post('/groups', groupData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Group created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create group')
    }
  })
}

export const useUpdateGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...groupData }: { id: number } & IGroupUpdate) => {
      const response = await service.put(`/groups/${id}`, groupData)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group', variables.id] })
      toast.success('Group updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update group')
    }
  })
}

export const useDeleteGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (groupId: number) => {
      const response = await service.del(`/groups/${groupId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Group deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete group')
    }
  })
}

export const useAssignUserToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: number; userId: number }) => {
      const response = await service.post(`/groups/${groupId}/assign-user`, { userId })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      toast.success('User assigned to group successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to assign user to group')
    }
  })
}

export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: number; userId: number }) => {
      const response = await service.post(`/groups/${groupId}/remove-user`, { userId })
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] })
      toast.success('User removed from group successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove user from group')
    }
  })
}
