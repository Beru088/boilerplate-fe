'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const AuthCallbackContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithToken } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      handleTokenLogin(token)
    } else {
      setError('No token provided')
    }
  }, [searchParams])

  const handleTokenLogin = async (token: string) => {
    try {
      loginWithToken(token)
    } catch (err) {
      console.error('Token login failed:', err)
      setError('Authentication failed. Please try again.')
    }
  }

  const handleRetry = () => {
    router.push('/')
  }

  if (error) {
    return (
      <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
        <Card className='w-full max-w-md bg-zinc-900/90'>
          <CardHeader className='text-center'>
            <CardTitle className='text-xl text-zinc-100'>Authentication Error</CardTitle>
            <CardDescription className='text-zinc-400'>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} className='w-full'>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
      <Card className='w-full max-w-md bg-zinc-900/90'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl text-zinc-100'>Completing Login</CardTitle>
          <CardDescription className='text-zinc-400'>
            Please wait while we complete your authentication...
          </CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center'>
          <Loader2 className='h-8 w-8 animate-spin text-zinc-400' />
        </CardContent>
      </Card>
    </div>
  )
}

const AuthCallback = () => {
  return (
    <Suspense
      fallback={
        <div className='bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10'>
          <Card className='w-full max-w-md bg-zinc-900/90'>
            <CardHeader className='text-center'>
              <CardTitle className='text-xl text-zinc-100'>Loading</CardTitle>
              <CardDescription className='text-zinc-400'>Please wait...</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
              <Loader2 className='h-8 w-8 animate-spin text-zinc-400' />
            </CardContent>
          </Card>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}

export default AuthCallback
