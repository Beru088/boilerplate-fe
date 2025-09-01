'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Activity, Plus, Minus, Edit } from 'lucide-react'
import { useObjectChangeLog } from '@/features/logs/api/object'
import { useActivityLog } from '@/features/logs/api/activity'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

const ArchiveDataLogDetailPage = () => {
  const params = useParams()
  const activityLogId = Number(params.id)

  // Get the activity log to determine its type
  const { activityLog } = useActivityLog(activityLogId)
  const isVisitActivity = activityLog?.action === 'VISIT'

  const {
    objectChangeLog,
    objectChangeLogLoading,
    objectChangeLogFetched,
    objectChangeLogError,
    refetch: refetchObjectChanges
  } = useObjectChangeLog(activityLogId)

  const handleRetry = () => {
    refetchObjectChanges()
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

  const renderSnapshotChanges = (log: any) => {
    const { previousSnapshot, newSnapshot, action } = log

    if (action === 'CREATE') {
      return (
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-green-700'>
            <Plus className='h-4 w-4' />
            New Object Created
          </div>
          <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
            <pre className='max-h-96 overflow-auto text-xs whitespace-pre-wrap text-green-800'>
              {JSON.stringify(newSnapshot, null, 2)}
            </pre>
          </div>
        </div>
      )
    }

    if (action === 'UPDATE') {
      const changes: { field: string; oldValue: any; newValue: any }[] = []
      const allKeys = new Set([...Object.keys(previousSnapshot || {}), ...Object.keys(newSnapshot || {})])

      allKeys.forEach(key => {
        const oldValue = previousSnapshot?.[key]
        const newValue = newSnapshot?.[key]

        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes.push({
            field: key,
            oldValue,
            newValue
          })
        }
      })

      return (
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-blue-700'>
            <Edit className='h-4 w-4' />
            Changes Made ({changes.length} field{changes.length !== 1 ? 's' : ''})
          </div>
          <div className='space-y-2'>
            {changes.map((change, index) => (
              <div key={index} className='rounded-lg border p-3'>
                <div className='mb-2 text-sm font-medium'>{change.field}</div>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <div className='mb-1 flex items-center gap-1 text-xs font-medium text-red-600'>
                      <Minus className='h-3 w-3' />
                      Previous Value
                    </div>
                    <div className='rounded border border-red-200 bg-red-50 p-2'>
                      <pre className='max-h-32 overflow-auto text-xs whitespace-pre-wrap text-red-800'>
                        {JSON.stringify(change.oldValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <div className='mb-1 flex items-center gap-1 text-xs font-medium text-green-600'>
                      <Plus className='h-3 w-3' />
                      New Value
                    </div>
                    <div className='rounded border border-green-200 bg-green-50 p-2'>
                      <pre className='max-h-32 overflow-auto text-xs whitespace-pre-wrap text-green-800'>
                        {JSON.stringify(change.newValue, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (action === 'DELETE') {
      return (
        <div className='space-y-3'>
          <div className='flex items-center gap-2 text-sm font-medium text-red-700'>
            <Minus className='h-4 w-4' />
            Object Deleted
          </div>
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <pre className='max-h-96 overflow-auto text-xs whitespace-pre-wrap text-red-800'>
              {JSON.stringify(previousSnapshot, null, 2)}
            </pre>
          </div>
        </div>
      )
    }

    return null
  }

  // If this is a visit activity, redirect or show error
  if (isVisitActivity) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Archive Data Log Details</h1>
          <p className='text-muted-foreground'>This is a visit activity, not an archive data change</p>
        </div>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            This activity log is for a user visit, not an archive data change. Please view visit logs in the User Activity section.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Archive Data Log Details</h1>
        <p className='text-muted-foreground'>Detailed view of archive data changes for activity log #{activityLogId}</p>
      </div>

      <div className='grid gap-6'>
        {objectChangeLogLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-64' />
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <Skeleton className='h-20 w-full' />
                  <Skeleton className='h-32 w-full' />
                </div>
              </CardContent>
            </Card>
          ))
        ) : objectChangeLogError ? (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex items-center justify-between'>
              <span>Failed to load archive data changes. Please try again.</span>
              <Button variant='outline' size='sm' onClick={handleRetry}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : !objectChangeLogFetched ? (
          <div className='py-8 text-center'>
            <p className='text-muted-foreground'>Loading archive data changes...</p>
          </div>
        ) : !objectChangeLog || objectChangeLog.length === 0 ? (
          <div className='py-8 text-center'>
            <Activity className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground'>No archive data changes found</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              This activity log doesn't have any associated archive data changes
            </p>
          </div>
        ) : (
          objectChangeLog.map((log: any, index: number) => (
            <Card key={log.id || index}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg'>{log.object?.title || `Object ID: ${log.objectId}`}</CardTitle>
                    <CardDescription>{log.changeSummary}</CardDescription>
                  </div>
                  <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Changed By</div>
                    <div className='text-sm font-medium'>{log.user?.name || 'System'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Object Code</div>
                    <div className='text-sm font-medium'>{log.object?.code || 'N/A'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Category</div>
                    <div className='text-sm font-medium'>{log.object?.category?.name || 'N/A'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Timestamp</div>
                    <div className='text-sm font-medium'>{formatDate(log.createdAt)}</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className='mb-4 text-lg font-semibold'>Changes</h3>
                  {renderSnapshotChanges(log)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ArchiveDataLogDetailPage
