'use client'

import { LayoutDashboard, Users, Files, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar'
import { useAuth } from '@/hooks/use-auth'

const items = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Users', url: '/user-management', icon: Users },
  { title: 'Objects', url: '/object-management', icon: Files },
  { title: 'Settings', url: '/settings', icon: Settings }
]

const AdminSidebar = () => {
  const pathname = usePathname()
  const { logout, isLogoutLoading } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <Sidebar className='bg-muted/40 group relative' collapsible='icon'>
      <SidebarHeader className='px-[30px] py-6 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:pb-10'>
        <div className='flex flex-col justify-center gap-2 text-center group-data-[collapsible=icon]:items-center'>
          <p
            className='bg-clip-text text-5xl font-semibold text-transparent transition-all group-data-[collapsible=icon]:text-xl'
            style={{
              background: 'var(--gradient-community, linear-gradient(180deg, #2662EC 0%, #163886 100%))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            <span className='group-data-[collapsible=icon]:hidden'>Historia</span>
            <Image
              src='/images/logo/company/samudera-logo.png'
              alt='Logo'
              width={49}
              height={49}
              className='hidden group-data-[collapsible=icon]:block'
            />
          </p>
        </div>
        <SidebarTrigger className='absolute top-[62px] right-[-10px]' />
      </SidebarHeader>
      <SidebarContent className='px-[30px] group-data-[collapsible=icon]:px-2'>
        <SidebarMenu className='gap-2'>
          {items.map((item, i) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='px-[30px] group-data-[collapsible=icon]:px-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout}
              disabled={isLogoutLoading}
            >
              <LogOut />
              <span>{isLogoutLoading ? 'Logging out...' : 'Logout'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default AdminSidebar
