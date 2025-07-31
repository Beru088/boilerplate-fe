'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { LoginCredentials } from '@/types/api'

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
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
    console.log('Attempting login with:', formData)
    login(formData)
  }

  const handleGoogleLogin = () => {
    alert('Google SSO (to be implemented)')
  }

  return (
    <Card className='w-full max-w-sm border-none bg-black/40 shadow-xl backdrop-blur-lg'>
      <CardHeader>
        <CardTitle className='text-2xl text-white'>Sign In</CardTitle>
      </CardHeader>
      <form onSubmit={handleLogin} autoComplete='off'>
        <CardContent className='flex flex-col gap-6 pb-6'>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email' className='text-white'>
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
              className='border border-zinc-700 bg-zinc-900/80 text-white placeholder:text-zinc-400'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='password' className='text-white'>
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
              className='border border-zinc-700 bg-zinc-900/80 text-white placeholder:text-zinc-400'
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col gap-6'>
          <Button type='submit' className='w-full font-semibold' disabled={isLoginLoading}>
            {isLoginLoading ? 'Logging in...' : 'Login'}
          </Button>
          <div className='flex w-full items-center gap-1'>
            <Separator className='h-px flex-1 bg-zinc-700' />
            <span className='px-2 text-sm text-zinc-400 select-none'>or</span>
            <Separator className='h-px flex-1 bg-zinc-700' />
          </div>
          <Button
            type='button'
            variant='secondary'
            onClick={handleGoogleLogin}
            className='w-full border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700'
          >
            <Image src='/images/logo/google.png' alt='Google Icon' width={14} height={14} />
            <span>Continue with Google</span>
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default LoginForm
