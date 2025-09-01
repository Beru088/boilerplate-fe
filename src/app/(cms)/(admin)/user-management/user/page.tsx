'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Search, Filter, MoreHorizontal, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { useUsers } from '@/features/users/api/user'
import { Skeleton } from '@/components/ui/skeleton'
import { IUserQuery, IUser } from '@/types/users'
import CreateUserForm from '@/features/users/components/create-user-form'
import UpdateUserForm from '@/features/users/components/update-user-form'
import DeleteUser from '@/features/users/components/delete-user'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ListPagination from '@/components/shared/pagination'

const UsersPage = () => {
  const [userOptions, setUserOptions] = useState<IUserQuery>({
    search: '',
    role: 'viewer',
    status: '',
    skip: 0,
    take: 10
  })

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { users, usersLoading, usersFetched, usersError, refetch, pagination } = useUsers(userOptions)
  const totalPages = pagination?.totalPages ?? 1

  const handleSuccess = () => {
    // The query will automatically refetch due to cache invalidation
    setShowEditDialog(false)
    setShowDeleteDialog(false)
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

  const handleRetry = () => {
    refetch()
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Users</h1>
          <p className='text-muted-foreground'>Manage regular user accounts and access permissions.</p>
        </div>
        <CreateUserForm onSuccess={handleSuccess} allowedRoleNames={['viewer']} />
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='outline'>
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>
        <Button variant='outline'>
          <Filter className='mr-2 h-4 w-4' />
          Filter
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              User List
            </CardTitle>
            <CardDescription>Regular users with access to the Historia platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {usersLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
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
              ) : usersError ? (
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
              ) : !usersFetched ? (
                <div className='py-8 text-center'>
                  <p className='text-muted-foreground'>Loading users...</p>
                </div>
              ) : !users || users.length === 0 ? (
                <div className='py-8 text-center'>
                  <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>No users found</p>
                  <p className='text-muted-foreground mt-2 text-sm'>Create your first user to get started</p>
                </div>
              ) : (
                <>
                  {users.map((user: IUser) => (
                    <div key={user.id} className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                          <Users className='h-5 w-5 text-blue-600' />
                        </div>
                        <div>
                          <p className='font-medium'>{user.name}</p>
                          <p className='text-muted-foreground text-sm'>{user.email}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary'>{user.role.name || 'No role'}</Badge>
                        <Badge>{user.deletedAt ? 'Inactive' : 'Active'}</Badge>
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
                            <DropdownMenuItem
                              onClick={() => handleDelete(user)}
                              className='text-red-600 focus:text-red-600'
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  <ListPagination
                    skip={userOptions.skip ?? 0}
                    take={userOptions.take ?? 10}
                    totalPages={totalPages}
                    itemCount={users.length}
                    onChangeSkip={nextSkip => setUserOptions(prev => ({ ...prev, skip: nextSkip }))}
                    className='mt-4'
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

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
    </div>
  )
}

export default UsersPage
