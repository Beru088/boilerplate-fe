import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from './admin-sidebar'
import AdminHeader from './admin-header'

const AdminGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className='flex h-screen w-screen overflow-hidden'>
        <AdminSidebar />
        <div className='flex h-screen min-w-0 flex-1 flex-col overflow-hidden'>
          <AdminHeader />
          <main className='w-full max-w-full flex-1 overflow-y-auto p-10'>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminGroupLayout
