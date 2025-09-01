'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Users } from 'lucide-react'
import { useVisitLogsForActivityLog, useActivityLog } from '@/features/logs/api/activity'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

const UserActivityLogDetailPage = () => {
  const params = useParams()
  const activityLogId = Number(params.id)

  // Get the activity log to determine its type
  const { activityLog } = useActivityLog(activityLogId)
  const isVisitActivity = activityLog?.action === 'VISIT'

  const {
    visitLogs,
    visitLogsLoading,
    visitLogsFetched,
    visitLogsError,
    refetch: refetchVisitLogs
  } = useVisitLogsForActivityLog(activityLogId)

  const handleRetry = () => {
    refetchVisitLogs()
  }

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
      case 'VISIT':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  // If this is not a visit activity, show error
  if (!isVisitActivity) {
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>User Activity Log Details</h1>
          <p className='text-muted-foreground'>This is not a user visit activity</p>
        </div>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            This activity log is not for a user visit. Please view archive data changes in the Archive Data section.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>User Activity Log Details</h1>
        <p className='text-muted-foreground'>Detailed view of user visit for activity log #{activityLogId}</p>
      </div>

      <div className='grid gap-6'>
        {visitLogsLoading ? (
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
        ) : visitLogsError ? (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='flex items-center justify-between'>
              <span>Failed to load visit logs. Please try again.</span>
              <Button variant='outline' size='sm' onClick={handleRetry}>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : !visitLogsFetched ? (
          <div className='py-8 text-center'>
            <p className='text-muted-foreground'>Loading visit logs...</p>
          </div>
        ) : !visitLogs || visitLogs.length === 0 ? (
          <div className='py-8 text-center'>
            <Users className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
            <p className='text-muted-foreground'>No visit logs found</p>
            <p className='text-muted-foreground mt-2 text-sm'>
              This activity log doesn't have any associated visit logs
            </p>
          </div>
        ) : (
          visitLogs.map((visitLog: any, index: number) => (
            <Card key={visitLog.id || index}>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <div>
                    <CardTitle className='text-lg'>
                      {visitLog.object?.title || `Object ID: ${visitLog.objectId}`}
                    </CardTitle>
                    <CardDescription>User visit to object</CardDescription>
                  </div>
                  <Badge className={getActionColor('VISIT')}>VISIT</Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Visited By</div>
                    <div className='text-sm font-medium'>{visitLog.user?.name || 'Unknown User'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Object Code</div>
                    <div className='text-sm font-medium'>{visitLog.object?.code || 'N/A'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>IP Address</div>
                    <div className='text-sm font-medium'>{visitLog.ipAddress || 'N/A'}</div>
                  </div>
                  <div className='space-y-1'>
                    <div className='text-muted-foreground text-xs'>Visit Time</div>
                    <div className='text-sm font-medium'>{formatDate(visitLog.visitedAt)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default UserActivityLogDetailPage
