'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, MoreHorizontal, AlertCircle, RefreshCw, Eye, Filter } from 'lucide-react'
import { useActivityLogs } from '@/features/logs/api/activity'
import { Skeleton } from '@/components/ui/skeleton'
import { IActivityLogQuery } from '@/types/logs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ListPagination from '@/components/shared/pagination'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ArchiveDataLogsPage = () => {
  const router = useRouter()
  const [logOptions, setLogOptions] = useState<IActivityLogQuery>({
    targetType: 'object',
    action: '',
    skip: 0,
    take: 10
  })

  const { activityLogs, activityLogsLoading, activityLogsFetched, activityLogsError, refetch, pagination } =
    useActivityLogs(logOptions)

  const archiveDataLogs = activityLogs
  const totalPages = pagination?.totalPages ?? 1

  const handleRetry = () => {
    refetch()
  }

  const getActionColor = (action: string) => {
    switch (action?.toLowerCase()) {
      case 'create_object':
        return 'bg-green-100 text-green-800'
      case 'update_object':
        return 'bg-blue-100 text-blue-800'
      case 'delete_object':
        return 'bg-red-100 text-red-800'
      case 'restore_object':
        return 'bg-orange-100 text-orange-800'

      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Archive Data Logs</h1>
        <p className='text-muted-foreground'>Track changes to archive objects and data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Archive Data Activity
          </CardTitle>
          <CardDescription>
            View all object changes: creation, updates, deletions, and change request approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Filter className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>Filter by Action:</span>
            </div>
            <Select
              value={logOptions.action || ''}
              onValueChange={value => setLogOptions(prev => ({ ...prev, action: value, skip: 0 }))}
            >
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='All Actions' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>All Actions</SelectItem>
                <SelectItem value='create_object'>Create Object</SelectItem>
                <SelectItem value='update_object'>Update Object</SelectItem>
                <SelectItem value='delete_object'>Delete Object</SelectItem>
                <SelectItem value='restore_object'>Restore Object</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Archive Data Logs
          </CardTitle>
          <CardDescription>
            View all object changes: creation, updates, deletions, and change request approvals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityLogsLoading ? (
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className='flex items-center justify-between rounded-lg border p-4'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-10 w-10 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-32' />
                      <Skeleton className='h-3 w-48' />
                      <Skeleton className='h-3 w-24' />
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-8 w-8' />
                  </div>
                </div>
              ))}
            </div>
          ) : activityLogsError ? (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription className='flex items-center justify-between'>
                <span>Failed to load archive data logs. Please try again.</span>
                <Button variant='outline' size='sm' onClick={handleRetry}>
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : !activityLogsFetched ? (
            <div className='py-8 text-center'>
              <p className='text-muted-foreground'>Loading archive data logs...</p>
            </div>
          ) : archiveDataLogs.length === 0 ? (
            <div className='py-8 text-center'>
              <Activity className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>No archive data logs found</p>
              <p className='text-muted-foreground mt-2 text-sm'>
                Object changes and change request approvals will appear here
              </p>
            </div>
          ) : (
            <>
              <div className='space-y-4'>
                {archiveDataLogs.map((log: any, index: number) => (
                  <div key={log.id || index} className='flex items-center justify-between rounded-lg border p-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                        <Activity className='h-5 w-5 text-blue-600' />
                      </div>
                      <div>
                        <p className='font-medium'>{log.user?.name || 'System'}</p>
                        <p className='text-muted-foreground text-sm'>{log.details || log.action}</p>
                        <p className='text-muted-foreground text-xs'>{formatDate(log.createdAt)}</p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                      {log.targetType && <Badge variant='secondary'>{log.targetType}</Badge>}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant='ghost' size='sm'>
                            <MoreHorizontal className='h-4 w-4' />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem onClick={() => router.push(`/logs/archive-data/${log.id}`)}>
                            <Eye className='mr-2 h-4 w-4' />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>

              <ListPagination
                skip={logOptions.skip || 0}
                take={logOptions.take || 10}
                totalPages={totalPages}
                itemCount={archiveDataLogs.length}
                onChangeSkip={newSkip => setLogOptions(prev => ({ ...prev, skip: newSkip }))}
                className='mt-6'
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ArchiveDataLogsPage
