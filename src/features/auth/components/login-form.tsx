'use client'

import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'
import { ILoginCredentials } from '@/types'
import { AppConfig } from '@/configs/api'

const LoginForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const [formData, setFormData] = useState<ILoginCredentials>({
    email: '',
    password: ''
  })
  const [error, setError] = useState<string>('')

  const { login, isLoginLoading } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      login(formData)
    } catch (err) {
      setError('Login failed. Please try again.')
      console.error('Login error:', err)
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = `${AppConfig.baseUrl}/auth/google/login`
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border-amber-200/50 bg-amber-50/90'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl text-amber-900'>Welcome back</CardTitle>
          <CardDescription className='text-amber-700'>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className='grid gap-6'>
              <Button
                variant='default'
                className='w-full !border-amber-300 !bg-slate-800 !text-slate-100 hover:cursor-pointer hover:!border-amber-400 hover:!bg-slate-700'
                onClick={handleGoogleLogin}
                type='button'
              >
                <Image src='/images/logo/google.png' alt='Google Icon' width={14} height={14} />
                Login with Google
              </Button>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-amber-300'>
                <span className='relative z-10 bg-amber-50 px-2 text-amber-600'>Or continue with</span>
              </div>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='email' className='font-medium text-slate-700'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className='border-amber-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='password' className='font-medium text-slate-700'>
                    Password
                  </Label>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className='border-amber-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20'
                  />
                </div>
                {error && <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>{error}</div>}
                <Button
                  type='submit'
                  className='w-full bg-amber-600 text-white hover:bg-amber-700'
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
