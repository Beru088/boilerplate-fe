'use client'

import {
  BookOpen,
  FileBox,
  FileChartColumn,
  FileKey2,
  LayoutDashboard,
  LibraryBig,
  Package,
  PackageSearch,
  Settings2,
  Tags,
  UserCog,
  UserLock,
  Users
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail
} from '@/components/ui/sidebar'
import { AdminMain } from './admin-main'
import { AdminUser } from './admin-user'
import { useAuth } from '@/hooks/use-auth'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

const data = {
  navMain: [
    { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
    {
      title: 'Archive Management',
      url: '#',
      icon: LibraryBig,
      items: [
        {
          title: 'Object',
          url: '/admin/archive/objects',
          icon: Package
        },
        {
          title: 'Object Category',
          url: '/admin/archive/categories',
          icon: PackageSearch
        },
        {
          title: 'Object Tags',
          url: '/admin/archive/tags',
          icon: Tags
        }
      ]
    },
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
        },
        {
          title: 'Role',
          url: '/user-management/role',
          icon: UserCog
        }
      ]
    }
  ],
  navAdmin: [
    {
      title: 'Historia Logs',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Activity Logs',
          url: '/admin/logs/activity',
          icon: FileChartColumn
        },
        {
          title: 'Change Logs',
          url: '/admin/logs/changes',
          icon: FileBox
        }
      ]
    },
    {
      title: 'Master Data',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'Category',
          url: '/admin/master/categories',
          icon: FileKey2
        },
        {
          title: 'Material',
          url: '/admin/master/materials',
          icon: FileKey2
        },
        {
          title: 'Tags',
          url: '/admin/master/tags',
          icon: FileKey2
        },
        {
          title: 'Location',
          url: '/admin/master/locations',
          icon: FileKey2
        }
      ]
    }
  ]
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useAuth()

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenuButton
          size='lg'
          className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
        >
          <div className='bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center overflow-hidden rounded-md'>
            <Image src='/images/logo/company/samudera-logo.png' alt='logo' width={42} height={32} />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-medium'>Samudera</span>
            <span className='truncate text-xs'>Historia</span>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <AdminMain items={data.navMain} />
        <AdminMain title='Admin Platform' items={data.navAdmin} />
      </SidebarContent>
      <SidebarFooter>
        {!user || isLoading ? <Skeleton className='h-12 w-full bg-gray-200' /> : <AdminUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
