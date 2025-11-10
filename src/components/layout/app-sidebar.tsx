'use client'

import { Info, Settings, LogOut } from 'lucide-react'
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
import { AppMain } from '@/components/layout/app-main'
import { AppUser } from '@/components/layout/app-user'
import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const data = {
  navAdmin: [
    {
      title: 'Dashboard',
      url: '/dashboard'
    },
    {
      title: 'Menu Management',
      url: '/menu-management'
    },
    {
      title: 'Group Access Control',
      url: '/group-access-management'
    },
    {
      title: 'User Management',
      url: '/user-management'
    },
    {
      title: 'Activity Log',
      url: '/activity-log'
    }
  ]
}

function SidebarLogo({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className={`flex w-full items-center justify-between gap-3 ${isCollapsed ? 'flex-col' : 'flex-row'}`}>
      {isCollapsed ? (
        <div className='flex w-full justify-center'>
          <Image
            src='/images/logo/company/samudera-logo.png'
            alt='logo'
            width={52}
            height={30}
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

function SidebarFooterButtons({ isCollapsed }: { isCollapsed: boolean }) {
  const { logout } = useAuth()

  const handleInfo = () => {
    alert('Info page - Coming soon!')
  }

  const handleSettings = () => {
    alert('Settings page - Coming soon!')
  }

  const handleLogout = () => {
    logout()
  }

  if (isCollapsed) {
    return (
      <div className='flex flex-col items-center gap-2'>
        <Button variant='ghost' size='icon' onClick={handleInfo} className='h-8 w-8'>
          <Info className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleSettings} className='h-8 w-8'>
          <Settings className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={handleLogout} className='h-8 w-8'>
          <LogOut className='h-4 w-4' />
        </Button>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <Button variant='ghost' onClick={handleInfo} className='h-8 justify-start px-2'>
        <Info className='mr-2 h-4 w-4' />
        <span className='text-sm'>Info</span>
      </Button>
      <Button variant='ghost' onClick={handleSettings} className='h-8 justify-start px-2'>
        <Settings className='mr-2 h-4 w-4' />
        <span className='text-sm'>Settings</span>
      </Button>
      <Button variant='ghost' onClick={handleLogout} className='h-8 justify-start px-2'>
        <LogOut className='mr-2 h-4 w-4' />
        <span className='text-sm'>Logout</span>
      </Button>
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
    <Sidebar collapsible='icon'>
      <SidebarHeader className={`flex flex-col gap-10 pt-11 pb-10 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        <SidebarLogo isCollapsed={isCollapsed} />
        {!user || isLoading ? <Skeleton className='h-12 w-full bg-gray-200' /> : <AppUser user={user} />}
      </SidebarHeader>
      <SidebarContent className={`${isCollapsed ? 'px-3' : 'px-6'}`}>
        <AppMain items={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter className={`pb-11 ${isCollapsed ? 'px-3' : 'px-6'}`}>
        <SidebarFooterButtons isCollapsed={isCollapsed} />
      </SidebarFooter>
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
