'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Menu, MoreHorizontal, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useMenus } from '@/features/menus/api/menus'
import { IMenu } from '@/types'
import CreateMenuForm from '@/features/menus/components/create-menu-form'
import UpdateMenuForm from '@/features/menus/components/update-menu-form'
import DeleteMenu from '@/features/menus/components/delete-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QueryLayout from '@/components/shared/query-layout'
import ListPagination from '@/components/shared/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function MenuManagementPage() {
  // Menu state
  const [menuOptions, setMenuOptions] = useState({
    search: '',
    isActive: true,
    skip: 0,
    take: 10,
    sort: 'newest' as 'newest' | 'oldest'
  })

  // Dialog state
  const [selectedMenu, setSelectedMenu] = useState<IMenu | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Data fetching
  const { menus, menusLoading, menusFetched, menusError, refetch: refetchMenus } = useMenus()

  const handleRetry = () => {
    refetchMenus()
  }

  const handleSuccess = () => {
    setShowEditDialog(false)
    setShowDeleteDialog(false)
    setSelectedMenu(null)
  }

  const handleEdit = (menu: IMenu) => {
    setSelectedMenu(menu)
    setShowEditDialog(true)
  }

  const handleDelete = (menu: IMenu) => {
    setSelectedMenu(menu)
    setShowDeleteDialog(true)
  }

  const renderMenuList = (menus: IMenu[], menusLoading: boolean, menusFetched: boolean, menusError: any) => {
    if (menusLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className='flex items-center justify-between rounded-lg border p-4'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-5 w-12' />
          </div>
        </div>
      ))
    }

    if (menusError) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>Failed to load menus. Please try again.</span>
            <Button variant='outline' size='sm' onClick={handleRetry}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    if (!menusFetched) {
      return (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>Loading menus...</p>
        </div>
      )
    }

    if (!menus || menus.length === 0) {
      return (
        <div className='py-8 text-center'>
          <Menu className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground'>No menus found</p>
          <p className='text-muted-foreground mt-2 text-sm'>Create your first menu to get started</p>
        </div>
      )
    }

    return (
      <>
        {menus.map((menu: IMenu) => (
          <div key={menu.id} className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <Menu className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='font-medium'>{menu.name}</p>
                <p className='text-muted-foreground text-sm'>{menu.code}</p>
                <p className='text-muted-foreground text-xs'>{menu.children?.length || 0} children</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary'>{menu.order}</Badge>
              <Badge>{menu.isActive ? 'Active' : 'Inactive'}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleEdit(menu)}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(menu)} className='text-red-600 focus:text-red-600'>
                    <Trash2 className='mr-2 h-4 w-4' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Menu Management</h1>
          <p className='text-muted-foreground'>Create and manage navigation menus with nested children.</p>
        </div>
        <CreateMenuForm onSuccess={handleSuccess} />
      </div>

      <QueryLayout
        searchPlaceholder='Search menus...'
        searchValue={menuOptions.search}
        onSearch={search => setMenuOptions(prev => ({ ...prev, search, skip: 0 }))}
        sortValue={menuOptions.sort}
        onSortChange={sort => setMenuOptions(prev => ({ ...prev, sort: sort as 'newest' | 'oldest', skip: 0 }))}
        filters={
          <div className='flex items-center gap-2'>
            <Select
              value={menuOptions.isActive ? 'active' : 'inactive'}
              onValueChange={status => setMenuOptions(prev => ({ ...prev, isActive: status === 'active', skip: 0 }))}
            >
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Menu className='h-5 w-5' />
            Menu List
          </CardTitle>
          <CardDescription>Manage your application navigation structure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>{renderMenuList(menus, menusLoading, menusFetched, menusError)}</div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedMenu && showEditDialog && (
        <UpdateMenuForm
          menu={selectedMenu}
          onSuccess={handleSuccess}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {/* Delete Dialog */}
      {selectedMenu && showDeleteDialog && (
        <DeleteMenu
          menu={selectedMenu}
          onSuccess={handleSuccess}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}
    </div>
  )
}
