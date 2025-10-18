'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { service } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import authConfig from '@/configs/auth'
import { ILoginCredentials } from '@/types'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const useAuth = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const authApi = {
    login: async (credentials: ILoginCredentials) => {
      const payload = {
        email: credentials.email,
        password: credentials.password
      }

      const response = await service.post('/auth/login', payload)

      return response.data
    },

    loginWithToken: async (token: string) => {
      const response = await service.post('/auth/verify-token', { token })

      return response.data
    },

    logout: async () => {
      const response = await service.post('/auth/logout')

      return response.data
    },

    getCurrentUser: async () => {
      const response = await service.get('/auth/me')

      return response.data
    }
  }

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      const { user, token } = data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem(authConfig.storageTokenKeyName)

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem(authConfig.storageTokenKeyName, token)
      }
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.setQueryData(['me'], { data: user })

      toast.success('Login successful', {
        description: `Welcome back, ${user.fullname}!`
      })

      router.push('/dashboard')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed. Please check your credentials.'
      toast.error('Login failed', {
        description: message
      })
    }
  })

  const loginWithTokenMutation = useMutation({
    mutationFn: authApi.loginWithToken,
    onSuccess: data => {
      const { user, token } = data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem(authConfig.storageTokenKeyName)

        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem(authConfig.storageTokenKeyName, token)
      }
      queryClient.removeQueries({ queryKey: ['user'] })
      queryClient.setQueryData(['me'], { data: user })

      toast.success('Authentication successful', {
        description: `Welcome back, ${user.fullname}!`
      })

      router.push('/dashboard')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Authentication failed. Please try logging in again.'
      toast.error('Authentication failed', {
        description: message
      })
    }
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem(authConfig.storageTokenKeyName)
      }
      queryClient.clear()

      toast.success('Logged out successfully', {
        description: 'You have been signed out of your account'
      })

      router.push('/')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Logout failed'
      toast.error('Logout failed', {
        description: message
      })

      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        localStorage.removeItem(authConfig.storageTokenKeyName)
      }
      queryClient.clear()
      router.push('/')
    }
  })

  const {
    data: userData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: isClient && typeof window !== 'undefined' && !!localStorage.getItem(authConfig.storageTokenKeyName)
  })

  const user = userData?.data
  const isAuthenticated = !!user

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginWithToken: loginWithTokenMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending
  }
}
