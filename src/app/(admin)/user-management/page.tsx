'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserLock, Users, MoreHorizontal, Edit, Trash2, RotateCcw, AlertCircle, RefreshCw } from 'lucide-react'
import { useUsers } from '@/features/user-management/api/user'
import { Skeleton } from '@/components/ui/skeleton'
import { IUser, IUserQuery } from '@/types/users'
import CreateUserForm from '@/features/user-management/components/create-user-form'
import UpdateUserForm from '@/features/user-management/components/update-user-form'
import DeleteUser from '@/features/user-management/components/delete-user'
import RestoreUser from '@/features/user-management/components/restore-user'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QueryLayout from '@/components/shared/query-layout'
import ListPagination from '@/components/shared/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth'

export default function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const isSuperAdmin = currentUser?.isAdmin

  // Admin users state
  const [adminUserOptions, setAdminUserOptions] = useState<IUserQuery>({
    search: '',
    isAdmin: true,
    status: 'active',
    skip: 0,
    take: 10,
    sort: 'newest'
  })

  // Regular users state
  const [userOptions, setUserOptions] = useState<IUserQuery>({
    search: '',
    isAdmin: false,
    status: 'active',
    skip: 0,
    take: 10,
    sort: 'newest'
  })

  // Shared state for dialogs
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)

  // Data fetching
  const {
    users: adminUsers,
    usersLoading: adminUsersLoading,
    usersFetched: adminUsersFetched,
    pagination: adminPagination
  } = useUsers(adminUserOptions)
  const {
    users: regularUsers,
    usersLoading: usersLoading,
    usersFetched: usersFetched,
    usersError,
    refetch,
    pagination
  } = useUsers(userOptions)

  const adminTotalPages = adminPagination?.totalPages ?? 1
  const totalPages = pagination?.totalPages ?? 1

  const handleSuccess = () => {
    setShowEditDialog(false)
    setShowDeleteDialog(false)
    setShowRestoreDialog(false)
    setSelectedUser(null)
  }

  const handleEdit = (user: IUser) => {
    setSelectedUser(user)
    setShowEditDialog(true)
  }

  const handleDelete = (user: IUser) => {
    setSelectedUser(user)
    setShowDeleteDialog(true)
  }

  const handleRestore = (user: IUser) => {
    setSelectedUser(user)
    setShowRestoreDialog(true)
  }

  const handleRetry = () => {
    refetch()
  }

  const renderUserList = (
    users: IUser[],
    usersLoading: boolean,
    usersFetched: boolean,
    usersError: any,
    isAdmin: boolean
  ) => {
    if (usersLoading) {
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

    if (usersError) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>Failed to load users. Please try again.</span>
            <Button variant='outline' size='sm' onClick={handleRetry}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    if (!usersFetched) {
      return (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>Loading {isAdmin ? 'admin' : ''} users...</p>
        </div>
      )
    }

    if (!users || users.length === 0) {
      return (
        <div className='py-8 text-center'>
          {isAdmin ? (
            <>
              <UserLock className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>No admin users found</p>
              <p className='text-muted-foreground mt-2 text-sm'>Create your first admin user to get started</p>
            </>
          ) : (
            <>
              <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>No users found</p>
              <p className='text-muted-foreground mt-2 text-sm'>Create your first user to get started</p>
            </>
          )}
        </div>
      )
    }

    return (
      <>
        {users.map((user: IUser) => (
          <div key={user.id} className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${isAdmin ? 'bg-primary/10' : 'bg-blue-100'}`}
              >
                {isAdmin ? (
                  <UserLock className={`h-5 w-5 ${isAdmin ? 'text-primary' : 'text-blue-600'}`} />
                ) : (
                  <Users className='h-5 w-5 text-blue-600' />
                )}
              </div>
              <div>
                <p className='font-medium'>{user.fullname}</p>
                <p className='text-muted-foreground text-sm'>{user.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary'>{user.isAdmin ? 'Admin' : 'User'}</Badge>
              <Badge>{user.deletedAt ? 'Deleted' : 'Active'}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleEdit(user)}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  {user.deletedAt ? (
                    isSuperAdmin && (
                      <DropdownMenuItem
                        onClick={() => handleRestore(user)}
                        className='text-green-600 focus:text-green-600'
                      >
                        <RotateCcw className='mr-2 h-4 w-4' />
                        Restore
                      </DropdownMenuItem>
                    )
                  ) : (
                    <DropdownMenuItem onClick={() => handleDelete(user)} className='text-red-600 focus:text-red-600'>
                      <Trash2 className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  )}
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
          <h1 className='text-3xl font-bold'>User Management</h1>
          <p className='text-muted-foreground'>Manage user accounts and access permissions.</p>
        </div>
      </div>

      <Tabs defaultValue='admin' className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='admin'>Admin</TabsTrigger>
          <TabsTrigger value='users'>User</TabsTrigger>
        </TabsList>

        <TabsContent value='admin' className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-semibold'>Admin</h2>
              <p className='text-muted-foreground'>Manage administrator accounts.</p>
            </div>
            <CreateUserForm onSuccess={handleSuccess} defaultIsAdmin={true} />
          </div>

          <QueryLayout
            searchPlaceholder='Search admin users...'
            searchValue={adminUserOptions.search}
            onSearch={search => setAdminUserOptions(prev => ({ ...prev, search, skip: 0 }))}
            sortValue={adminUserOptions.sort || 'newest'}
            onSortChange={sort =>
              setAdminUserOptions(prev => ({ ...prev, sort: sort as 'newest' | 'oldest', skip: 0 }))
            }
            filters={
              <div className='flex items-center gap-2'>
                <Select
                  value={adminUserOptions.status || 'active'}
                  onValueChange={status => setAdminUserOptions(prev => ({ ...prev, status: status, skip: 0 }))}
                >
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Active' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <UserLock className='h-5 w-5' />
                Admin List
              </CardTitle>
              <CardDescription>Users with administrative privileges and system access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {renderUserList(adminUsers, adminUsersLoading, adminUsersFetched, null, true)}
                {adminUsers && adminUsers.length > 0 && (
                  <ListPagination
                    skip={adminUserOptions.skip ?? 0}
                    take={adminUserOptions.take ?? 10}
                    totalPages={adminTotalPages}
                    itemCount={adminUsers.length}
                    onChangeSkip={nextSkip => setAdminUserOptions(prev => ({ ...prev, skip: nextSkip }))}
                    className='mt-4'
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='users' className='space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-semibold'>User</h2>
              <p className='text-muted-foreground'>Manage regular user accounts and access permissions.</p>
            </div>
            <CreateUserForm onSuccess={handleSuccess} defaultIsAdmin={false} />
          </div>

          <QueryLayout
            searchPlaceholder='Search users...'
            searchValue={userOptions.search}
            onSearch={search => setUserOptions(prev => ({ ...prev, search, skip: 0 }))}
            sortValue={userOptions.sort || 'newest'}
            onSortChange={sort => setUserOptions(prev => ({ ...prev, sort: sort as 'newest' | 'oldest', skip: 0 }))}
            filters={
              <div className='flex items-center gap-2'>
                <Select
                  value={userOptions.status || 'active'}
                  onValueChange={status => setUserOptions(prev => ({ ...prev, status: status, skip: 0 }))}
                >
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Active' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='active'>Active</SelectItem>
                    <SelectItem value='inactive'>Deleted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          />

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                User List (Viewers)
              </CardTitle>
              <CardDescription>Regular users with access to the Cockpit platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {renderUserList(regularUsers, usersLoading, usersFetched, usersError, false)}
                {regularUsers && regularUsers.length > 0 && (
                  <ListPagination
                    skip={userOptions.skip ?? 0}
                    take={userOptions.take ?? 10}
                    totalPages={totalPages}
                    itemCount={regularUsers.length}
                    onChangeSkip={nextSkip => setUserOptions(prev => ({ ...prev, skip: nextSkip }))}
                    className='mt-4'
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {selectedUser && showEditDialog && (
        <UpdateUserForm
          user={selectedUser}
          onSuccess={handleSuccess}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {/* Delete Dialog */}
      {selectedUser && showDeleteDialog && (
        <DeleteUser
          user={selectedUser}
          onSuccess={handleSuccess}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}

      {/* Restore Dialog */}
      {selectedUser && showRestoreDialog && (
        <RestoreUser
          user={selectedUser}
          onSuccess={handleSuccess}
          open={showRestoreDialog}
          onOpenChange={setShowRestoreDialog}
        />
      )}
    </div>
  )
}
