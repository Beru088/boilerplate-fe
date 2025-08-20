'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
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
    login(formData)
  }

  const handleGoogleLogin = () => {
    window.location.href = `${AppConfig.serverUrl}/auth/google/login`
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='bg-zinc-900/90'>
        <CardHeader className='text-center'>
          <CardTitle className='text-xl text-zinc-100'>Welcome back</CardTitle>
          <CardDescription className='text-zinc-400'>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className='grid gap-6'>
              <Button
                variant='outline'
                className='w-full border-0 bg-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:text-zinc-100'
                onClick={handleGoogleLogin}
                type='button'
              >
                <Image src='/images/logo/google.png' alt='Google Icon' width={14} height={14} />
                Login with Google
              </Button>
              <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-0 after:border-t'>
                <span className='relative z-10 bg-zinc-900 px-2 text-zinc-500'>Or continue with</span>
              </div>
              <div className='grid gap-6'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='email' className='text-zinc-300'>
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
                    className='border-0 bg-zinc-700/80 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-zinc-400'
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor='password' className='text-zinc-300'>
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
                    className='border-0 bg-zinc-700/80 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-zinc-400'
                  />
                </div>
                <Button type='submit' className='w-full' onClick={handleLogin} disabled={isLoginLoading}>
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
