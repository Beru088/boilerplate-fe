'use client'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, RefreshCcw, Search } from 'lucide-react'
import Link from 'next/link'

import { useQueryClient } from '@tanstack/react-query'
import ThemeToggle from '@/components/themeProvider/themeToggle'

const AdminHeader = () => {
  const queryClient = useQueryClient()

  const handleRefresh = () => {
    queryClient.invalidateQueries()
  }

  return (
    <nav className='relative flex w-full items-center justify-between gap-16 border-b px-10 py-3'>
      <div className='flex flex-col gap-1'>
        <p className='text-base font-bold'>Hello, Profesea</p>
        <p className='text-sm text-gray-400'>Here's what is going on today.</p>
      </div>
      <div className='flex flex-1 items-center justify-between'>
        <div className='relative w-full max-w-[300px]'>
          <Input placeholder='Search...' className='pr-10' />
          <span className='text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2'>
            <Search className='h-4 w-4' />
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <Button variant='outline' onClick={handleRefresh} size='icon'>
            <RefreshCcw />
          </Button>
          <Link href='/notifications'>
            <Button variant='outline' size='icon'>
              <Bell />
            </Button>
          </Link>
          <ThemeToggle />
          <div className='flex items-center gap-4'>
            <Avatar className='h-11 w-11'>
              <AvatarImage src='/images/avatar/default-user.png' alt='Profile Picture' className='' />
            </Avatar>
            <div className='flex flex-col'>
              <p className='text-base font-bold'>John Doe</p>
              <p className='text-sm text-gray-400'>Admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AdminHeader
