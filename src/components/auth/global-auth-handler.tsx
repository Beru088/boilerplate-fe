'use client'

import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, createContext, useContext, useState } from 'react'

interface POVContextType {
  shouldLogActivity: boolean
}

const POVContext = createContext<POVContextType | undefined>(undefined)

export const usePOV = () => {
  const context = useContext(POVContext)
  if (context === undefined) {
    throw new Error('usePOV must be used within GlobalAuthHandler')
  }
  return context
}

interface GlobalAuthHandlerProps {
  children: React.ReactNode
}

const GlobalAuthHandler = ({ children }: GlobalAuthHandlerProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isInUserPOV, setIsInUserPOV] = useState(false)

  const getCorrectPath = (isAdmin: boolean) => {
    console.log('user is', isAdmin)
    return '/dashboard'
  }

  const isPublicRoute = (path: string) => {
    const publicRoutes = ['/', '/auth', '/auth/callback']
    return publicRoutes.includes(path) || path.startsWith('/auth/')
  }

  const isProtectedRoute = (path: string) => {
    const protectedRoutes = ['/dashboard', '/user-management', '/admin']
    return protectedRoutes.some(route => path.startsWith(route))
  }

  useEffect(() => {
    const isUserRoute = Boolean(pathname.match(/^\/[^\/]+\/[^\/]+$/))
    setIsInUserPOV(isUserRoute)

    if (!isLoading && isAuthenticated && user && !pathname.includes('/auth/callback')) {
      const correctPath = getCorrectPath(user.isAdmin)

      if (isPublicRoute(pathname)) {
        router.push(correctPath)
        return
      }

      if (isProtectedRoute(pathname)) {
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router, pathname])

  const shouldLogActivity = !(user?.isAdmin === true && isInUserPOV)

  return <POVContext.Provider value={{ shouldLogActivity }}>{children}</POVContext.Provider>
}

export default GlobalAuthHandler
