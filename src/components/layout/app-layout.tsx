import { AppSidebar } from './app-sidebar'
import AppHeader from './app-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const AppGroupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='flex flex-col overflow-hidden'>
        <AppHeader />
        <div className='flex min-h-0 min-w-0 flex-1 flex-col gap-4 overflow-hidden p-4 pt-0'>{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppGroupLayout
