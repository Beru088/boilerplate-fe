'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from '@/components/ui/sidebar'
import { useAuth } from '@/lib/auth'
import { IUser } from '@/types/users'

export function AppUser({ user }: { user: IUser }) {
  const { isMobile } = useSidebar()
  const { logout, isLogoutLoading } = useAuth()
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  const toggleTheme = () => {
    if (!mounted) return
    const currentTheme = theme === 'system' ? systemTheme : theme
    const isDark = currentTheme === 'dark'
    setTheme(isDark ? 'light' : 'dark')
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className='flex w-full items-center gap-4'>
      <Avatar className='h-[53px] w-[53px] shrink-0 rounded-full'>
        <AvatarImage src='/images/avatar/default-user.png' alt={user.fullname} />
        <AvatarFallback className='rounded-full text-xs'>
          {user.fullname
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {!isCollapsed && (
        <div className='flex flex-1 flex-col gap-1'>
          <p className='text-sm font-medium'>{user.fullname}</p>
          <p className='text-muted-foreground text-xs'>{user.email}</p>
          <p className='text-muted-foreground text-xs'>{user.isAdmin ? 'Admin' : 'User'}</p>
        </div>
      )}
    </div>
  )
}
