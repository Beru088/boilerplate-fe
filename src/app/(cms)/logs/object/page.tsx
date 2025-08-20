'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Search, Filter, MoreHorizontal, AlertCircle, RefreshCw, Eye } from 'lucide-react'
import { useObjectChangeLogs } from '@/features/logs/api/object'
import { Skeleton } from '@/components/ui/skeleton'
import { IObjectChangeLogQuery } from '@/types/logs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ListPagination from '@/components/shared/pagination'

const ObjectChangeLogsPage = () => {
  const [logOptions, setLogOptions] = useState<IObjectChangeLogQuery>({
    objectId: undefined,
    action: undefined,
    skip: 0,
    take: 10
  })

  const {
    objectChangeLogs,
    objectChangeLogsLoading,
    objectChangeLogsFetched,
    objectChangeLogsError,
    refetch,
    pagination
  } = useObjectChangeLogs(logOptions)
  const totalPages = Math.ceil((pagination?.total || 0) / (logOptions.take || 10))

  const handleRetry = () => {
    refetch()
  }

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'CREATE':
        return 'bg-green-100 text-green-800'
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      case 'REVERT':
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
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Object Change Logs</h1>
          <p className='text-muted-foreground'>Track changes and modifications made to archive objects.</p>
        </div>
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
              <FileText className='h-5 w-5' />
              Object Change Logs
            </CardTitle>
            <CardDescription>Detailed logs of all changes made to archive objects in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {objectChangeLogsLoading ? (
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
              ) : objectChangeLogsError ? (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription className='flex items-center justify-between'>
                    <span>Failed to load object change logs. Please try again.</span>
                    <Button variant='outline' size='sm' onClick={handleRetry}>
                      <RefreshCw className='mr-2 h-4 w-4' />
                      Retry
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : !objectChangeLogsFetched ? (
                <div className='py-8 text-center'>
                  <p className='text-muted-foreground'>Loading object change logs...</p>
                </div>
              ) : !objectChangeLogs || objectChangeLogs.length === 0 ? (
                <div className='py-8 text-center'>
                  <FileText className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
                  <p className='text-muted-foreground'>No object change logs found</p>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    Object change logs will appear here as objects are modified
                  </p>
                </div>
              ) : (
                <>
                  {objectChangeLogs.map((log: any, index: number) => (
                    <div key={log.id || index} className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                          <FileText className='h-5 w-5 text-blue-600' />
                        </div>
                        <div>
                          <p className='font-medium'>{log.user?.name || 'System'}</p>
                          <p className='text-muted-foreground text-sm'>
                            {log.object?.title || `Object ID: ${log.objectId}`}
                          </p>
                          <p className='text-muted-foreground text-xs'>{formatDate(log.createdAt)}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        {log.object?.category?.name && <Badge variant='secondary'>{log.object.category.name}</Badge>}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <MoreHorizontal className='h-4 w-4' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem>
                              <Eye className='mr-2 h-4 w-4' />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  <ListPagination
                    skip={logOptions.skip || 0}
                    take={logOptions.take || 10}
                    totalPages={totalPages}
                    itemCount={objectChangeLogs.length}
                    onChangeSkip={nextSkip => setLogOptions(prev => ({ ...prev, skip: nextSkip }))}
                    className='mt-4'
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ObjectChangeLogsPage
