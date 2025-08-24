'use client'

import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles?: string[]
  redirectTo?: string
  fallback?: ReactNode
}

const RoleGuard = ({
  children,
  allowedRoles = ['superadmin', 'admin', 'contributor'],
  redirectTo = '/explore',
  fallback
}: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const hasAccess = (userRole: string, requiredRoles: string[]) => {
    return requiredRoles.includes(userRole)
  }

  const handleGoBack = () => {
    router.push(redirectTo)
  }

  const handleGoHome = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='space-y-4'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-4 w-48' />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20'>
              <AlertTriangle className='h-8 w-8 text-blue-600 dark:text-blue-400' />
            </div>
            <CardTitle className='text-xl font-semibold'>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 text-center'>
            <p className='text-muted-foreground'>
              You need to be signed in to access this page. Please log in with your account credentials.
            </p>
            <Button onClick={handleGoBack} className='flex-1'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (user?.role?.name && !hasAccess(user.role.name, allowedRoles)) {
    return (
      fallback || (
        <div className='flex min-h-screen items-center justify-center p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20'>
                <AlertTriangle className='h-8 w-8 text-red-600 dark:text-red-400' />
              </div>
              <CardTitle className='text-xl font-semibold'>Access Restricted</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-center'>
              <p className='text-muted-foreground'>
                You are not authorized to access this page. Please login with the correct credentials or go back to
                login page.
              </p>
              <div className='flex gap-2'>
                <Button onClick={handleGoBack} variant='outline' className='flex-1'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Back
                </Button>
                <Button onClick={handleGoHome} className='flex-1'>
                  <Home className='mr-2 h-4 w-4' />
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    )
  }

  return <>{children}</>
}

export default RoleGuard
