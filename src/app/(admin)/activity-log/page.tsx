'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, AlertCircle, RefreshCw } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuditLogs, useAuditStats } from '@/features/audit/api/audit'
import { IAuditLog, IAuditLogQuery } from '@/types/audit'
import { Alert, AlertDescription } from '@/components/ui/alert'
import QueryLayout from '@/components/shared/query-layout'
import ListPagination from '@/components/shared/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ActivityLogPage() {
  // Audit logs state
  const [auditOptions, setAuditOptions] = useState<IAuditLogQuery>({
    page: 1,
    limit: 20
  })

  // Data fetching
  const {
    auditLogs,
    auditLogsLoading,
    auditLogsFetched,
    auditLogsError,
    refetch: refetchAuditLogs,
    pagination: auditPagination
  } = useAuditLogs(auditOptions)

  const { auditStats, auditStatsLoading } = useAuditStats()

  const auditTotalPages = auditPagination?.totalPages ?? 1

  const handleRetry = () => {
    refetchAuditLogs()
  }

  const renderAuditLogList = (
    auditLogs: IAuditLog[],
    auditLogsLoading: boolean,
    auditLogsFetched: boolean,
    auditLogsError: any
  ) => {
    if (auditLogsLoading) {
      return Array.from({ length: 5 }).map((_, index) => (
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

    if (auditLogsError) {
      return (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription className='flex items-center justify-between'>
            <span>Failed to load audit logs. Please try again.</span>
            <Button variant='outline' size='sm' onClick={handleRetry}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    if (!auditLogsFetched) {
      return (
        <div className='py-8 text-center'>
          <p className='text-muted-foreground'>Loading audit logs...</p>
        </div>
      )
    }

    if (!auditLogs || auditLogs.length === 0) {
      return (
        <div className='py-8 text-center'>
          <Activity className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
          <p className='text-muted-foreground'>No audit logs found</p>
          <p className='text-muted-foreground mt-2 text-sm'>
            Activity will appear here as users interact with the system
          </p>
        </div>
      )
    }

    return (
      <>
        {auditLogs.map((log: IAuditLog) => (
          <div key={log.id} className='flex items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-3'>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${log.success ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <Activity className={`h-5 w-5 ${log.success ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className='font-medium'>{log.action}</p>
                <p className='text-muted-foreground text-sm'>{log.resource}</p>
                <p className='text-muted-foreground text-xs'>
                  {log.user ? `${log.user.fullname} (${log.user.email})` : 'System'}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant={log.success ? 'default' : 'destructive'}>{log.success ? 'Success' : 'Failed'}</Badge>
              <span className='text-muted-foreground text-xs'>{new Date(log.timestamp).toLocaleString()}</span>
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
          <h1 className='text-3xl font-bold'>Activity Log</h1>
          <p className='text-muted-foreground'>Monitor system activity and user actions.</p>
        </div>
        {auditStats && (
          <div className='flex items-center gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold'>{auditStats.totalLogs}</p>
              <p className='text-muted-foreground text-sm'>Total Logs</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-green-600'>{auditStats.successRate.toFixed(1)}%</p>
              <p className='text-muted-foreground text-sm'>Success Rate</p>
            </div>
          </div>
        )}
      </div>

      <QueryLayout
        searchPlaceholder='Search activity...'
        searchValue=''
        onSearch={() => {}}
        sortValue='newest'
        onSortChange={() => {}}
        filters={
          <div className='flex items-center gap-2'>
            <Select value='all' onValueChange={() => {}}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='All Actions' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Actions</SelectItem>
                <SelectItem value='success'>Success</SelectItem>
                <SelectItem value='error'>Errors</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Activity Log
          </CardTitle>
          <CardDescription>Recent system activity and user actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {renderAuditLogList(auditLogs, auditLogsLoading, auditLogsFetched, auditLogsError)}
            {auditLogs && auditLogs.length > 0 && (
              <ListPagination
                skip={((auditOptions.page || 1) - 1) * (auditOptions.limit || 20)}
                take={auditOptions.limit || 20}
                totalPages={auditTotalPages}
                itemCount={auditLogs.length}
                onChangeSkip={nextSkip =>
                  setAuditOptions(prev => ({
                    ...prev,
                    page: Math.floor(nextSkip / (prev.limit || 20)) + 1
                  }))
                }
                className='mt-4'
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
