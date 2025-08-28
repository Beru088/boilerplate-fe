import { AdminSidebar } from './admin-sidebar'
import AdminHeader from './admin-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const AdminGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <div className='flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminGroupLayout
