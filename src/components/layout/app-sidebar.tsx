'use client'

import { UserLock, Users } from 'lucide-react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AppMain } from './app-main'
import { AppUser } from './app-user'
import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const data = {
  navAdmin: [
    {
      title: 'User Management',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Admin',
          url: '/user-management/admin',
          icon: UserLock
        },
        {
          title: 'User',
          url: '/user-management/user',
          icon: Users
        }
      ]
    }
  ]
}

function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className={`flex w-full items-center justify-between gap-3 ${isCollapsed ? 'flex-col' : 'flex-row'}`}>
      {isCollapsed ? (
        <div className='flex w-full items-center'>
          <Image
            src='/images/logo/company/samudera-logo.png'
            alt='logo'
            width={32}
            height={32}
            className='object-contain'
          />
        </div>
      ) : (
        <div className='flex w-full items-center'>
          <Image
            src='/images/logo/company/samudera.svg'
            alt='logo'
            width={239}
            height={41}
            className='object-contain dark:hidden'
          />
          <Image
            src='/images/logo/company/samudera-white.svg'
            alt='logo'
            width={239}
            height={41}
            className='hidden object-contain dark:block'
          />
        </div>
      )}
      <SidebarTrigger />
    </div>
  )
}

export function AppSidebar() {
  const { user, isLoading } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const [showSwitchDialog, setShowSwitchDialog] = useState(false)
  const handleSwitchToUserView = () => {
    setShowSwitchDialog(true)
  }

  const confirmSwitch = () => {
    setShowSwitchDialog(false)
    window.location.href = '/dashboard'
  }

  return (
    <Sidebar collapsible='icon' className={`py-11 ${isCollapsed ? 'px-3' : 'px-6'}`}>
      <SidebarHeader className='flex flex-col gap-10'>
        <SidebarLogo isCollapsed={isCollapsed} />
        {!user || isLoading ? <Skeleton className='h-12 w-full bg-gray-200' /> : <AppUser user={user} />}
      </SidebarHeader>
      <SidebarContent>
        <AppMain items={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
        <DialogContent className='sm:max-w-md' showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Switch to User View</DialogTitle>
            <DialogDescription>
              You are about to switch to the user perspective. This will take you to the dashboard where you can view
              the application as a regular user would see it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex w-full flex-col gap-6'>
            <div className='flex w-full gap-6'>
              <Button variant='outline' onClick={() => setShowSwitchDialog(false)} className='flex-1'>
                Cancel
              </Button>
              <Button onClick={confirmSwitch} className='flex-1'>
                Switch to User View
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  )
}
