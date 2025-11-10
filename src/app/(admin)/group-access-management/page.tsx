'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Shield, MoreHorizontal, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useGroups } from '@/features/groups/api/groups'
import { IGroup, IGroupQuery } from '@/types/groups'
import CreateGroupForm from '@/features/groups/components/create-group-form'
import UpdateGroupForm from '@/features/groups/components/update-group-form'
import DeleteGroup from '@/features/groups/components/delete-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QueryLayout from '@/components/shared/query-layout'
import ListPagination from '@/components/shared/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function GroupAccessManagementPage() {
  // Groups state
  const [groupOptions, setGroupOptions] = useState<IGroupQuery>({
    search: '',
    isActive: true,
    skip: 0,
    take: 10,
    sort: 'newest'
  })

  // Dialog state
  const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Data fetching
  const {
    groups,
    groupsLoading,
    groupsFetched,
    groupsError,
    refetch: refetchGroups,
    pagination: groupPagination
  } = useGroups(groupOptions)

  const totalPages = groupPagination?.totalPages ?? 1

  const handleRetry = () => {
    refetchGroups()
  }

  const handleSuccess = () => {
    setShowEditDialog(false)
    setShowDeleteDialog(false)
    setSelectedGroup(null)
  }

  const handleEdit = (group: IGroup) => {
    setSelectedGroup(group)
    setShowEditDialog(true)
  }

  const handleDelete = (group: IGroup) => {
    setSelectedGroup(group)
    setShowDeleteDialog(true)
  }

  const renderGroupList = (groups: IGroup[], groupsLoading: boolean, groupsFetched: boolean, groupsError: any) => {
    if (groupsLoading) {
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

    if (groupsError) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>Failed to load groups. Please try again.</span>
            <Button variant='outline' size='sm' onClick={handleRetry}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    if (!groupsFetched) {
      return (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>Loading groups...</p>
        </div>
      )
    }

    if (!groups || groups.length === 0) {
      return (
        <div className='py-8 text-center'>
          <Shield className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground'>No groups found</p>
          <p className='text-muted-foreground mt-2 text-sm'>Create your first group to get started</p>
        </div>
      )
    }

    return (
      <>
        {groups.map((group: IGroup) => (
          <div key={group.id} className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                <Shield className='h-5 w-5 text-blue-600' />
              </div>
              <div>
                <p className='font-medium'>{group.name}</p>
                <p className='text-muted-foreground text-sm'>{group.description || group.code}</p>
                <p className='text-muted-foreground text-xs'>{group.permissions.length} permissions</p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary'>{group.users.length} users</Badge>
              <Badge>{group.isActive ? 'Active' : 'Inactive'}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem onClick={() => handleEdit(group)}>
                    <Edit className='mr-2 h-4 w-4' />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(group)} className='text-red-600 focus:text-red-600'>
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
          <h1 className='text-3xl font-bold'>Group Access Control</h1>
          <p className='text-muted-foreground'>Manage user groups and their permissions.</p>
        </div>
        <CreateGroupForm onSuccess={handleSuccess} />
      </div>

      <QueryLayout
        searchPlaceholder='Search groups...'
        searchValue={groupOptions.search}
        onSearch={search => setGroupOptions(prev => ({ ...prev, search, skip: 0 }))}
        sortValue={groupOptions.sort || 'newest'}
        onSortChange={sort => setGroupOptions(prev => ({ ...prev, sort: sort as 'newest' | 'oldest', skip: 0 }))}
        filters={
          <div className='flex items-center gap-2'>
            <Select
              value={groupOptions.isActive ? 'active' : 'inactive'}
              onValueChange={status => setGroupOptions(prev => ({ ...prev, isActive: status === 'active', skip: 0 }))}
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
            <Shield className='h-5 w-5' />
            Group List
          </CardTitle>
          <CardDescription>Manage user groups and their access permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {renderGroupList(groups, groupsLoading, groupsFetched, groupsError)}
            {groups && groups.length > 0 && (
              <ListPagination
                skip={groupOptions.skip ?? 0}
                take={groupOptions.take ?? 10}
                totalPages={totalPages}
                itemCount={groups.length}
                onChangeSkip={nextSkip => setGroupOptions(prev => ({ ...prev, skip: nextSkip }))}
                className='mt-4'
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {selectedGroup && showEditDialog && (
        <UpdateGroupForm
          group={selectedGroup}
          onSuccess={handleSuccess}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
        />
      )}

      {/* Delete Dialog */}
      {selectedGroup && showDeleteDialog && (
        <DeleteGroup
          group={selectedGroup}
          onSuccess={handleSuccess}
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
        />
      )}
    </div>
  )
}
