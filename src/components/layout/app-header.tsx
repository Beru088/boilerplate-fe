'use client'

import { useAuth } from '@/lib/auth'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Bell, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

const AppHeader = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const handleRefresh = () => {
    queryClient.invalidateQueries()
  }

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b px-10 py-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex flex-1 items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex flex-col gap-1'>
            <p className='text-base font-bold'>{`Hello, ${user?.fullname}`}</p>
            <p className='text-sm text-gray-400'>Here's what is going on today</p>
          </div>
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
        </div>
      </div>
    </header>
  )
}

export default AppHeader
