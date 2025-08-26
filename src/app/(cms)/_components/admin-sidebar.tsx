'use client'

import {
  ArchiveRestore,
  BookOpen,
  FileChartColumn,
  FileKey2,
  LibraryBig,
  PackagePlus,
  PackageSearch,
  Settings2,
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
import { useAuth } from '@/lib/auth'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { isAdmin } from '@/utils/helper'

const data = {
  navMain: [
    {
      title: 'Create Object',
      url: '/object-archive/create',
      icon: PackagePlus
    },
    {
      title: 'Archive Management',
      url: '#',
      icon: LibraryBig,
      items: [
        {
          title: 'Objects',
          url: '/object-archive',
          icon: PackageSearch
        },
        {
          title: 'Deleted Objects',
          url: '/object-archive/deleted',
          icon: ArchiveRestore
        }
      ]
    },
    {
      title: 'Historia Logs',
      url: '#',
      icon: BookOpen,
      items: [
        {
          title: 'Activity Logs',
          url: '/logs/activity',
          icon: FileChartColumn
        }
      ]
    }
  ],
  navAdmin: [
    {
      title: 'Object Change Request',
      url: '/change-request',
      icon: ArchiveRestore
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
          title: 'Contributor',
          url: '/user-management/contributor',
          icon: UserCog
        },
        {
          title: 'User',
          url: '/user-management/user',
          icon: Users
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
          url: '/master/categories',
          icon: FileKey2
        },
        {
          title: 'Material',
          url: '/master/materials',
          icon: FileKey2
        },
        {
          title: 'Tags',
          url: '/master/tags',
          icon: FileKey2
        },
        {
          title: 'Location',
          url: '/master/locations',
          icon: FileKey2
        },
        {
          title: 'Sub Location',
          url: '/master/sub-locations',
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
        {isAdmin(user) && <AdminMain title='Admin Platform' items={data.navAdmin} />}
      </SidebarContent>
      <SidebarFooter>
        {!user || isLoading ? <Skeleton className='h-12 w-full bg-gray-200' /> : <AdminUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
