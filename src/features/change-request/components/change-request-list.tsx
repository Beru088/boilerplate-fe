'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useChangeRequests } from '../api/change-request'
import type { IChangeRequestQuery, RequestStatus, IStructuredSnapshot } from '@/types/change-requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'
import ListPagination from '@/components/shared/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-gray-100 text-gray-800'
}

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className='h-4 w-4' />
    case 'REVIEWED':
      return <CheckCircle className='h-4 w-4' />
    case 'APPROVED':
      return <CheckCircle className='h-4 w-4' />
    case 'REJECTED':
      return <XCircle className='h-4 w-4' />
    case 'CANCELED':
      return <AlertCircle className='h-4 w-4' />
  }
}

const ChangeRequestList = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<IChangeRequestQuery>({
    skip: 0,
    take: 10
  })

  const { changeRequests, changeRequestsLoading, changeRequestsError, refetch, pagination } = useChangeRequests(filters)
  const totalPages = Math.ceil(((pagination?.total as number) || 0) / ((filters.take as number) || 10))

  const handleStatusFilter = (status: RequestStatus | undefined) => {
    setFilters(prev => ({
      ...prev,
      status,
      skip: 0
    }))
  }

  if (changeRequestsError) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>
            <p className='mb-4 text-red-600'>Error loading change requests</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>Change Requests</h2>
        <div className='flex gap-2'>
          <Button variant={!filters.status ? 'default' : 'outline'} onClick={() => handleStatusFilter(undefined)}>
            All
          </Button>
          <Button
            variant={filters.status === 'PENDING' ? 'default' : 'outline'}
            onClick={() => handleStatusFilter('PENDING')}
          >
            Pending
          </Button>
          <Button
            variant={filters.status === 'REVIEWED' ? 'default' : 'outline'}
            onClick={() => handleStatusFilter('REVIEWED')}
          >
            Reviewed
          </Button>
          <Button
            variant={filters.status === 'APPROVED' ? 'default' : 'outline'}
            onClick={() => handleStatusFilter('APPROVED')}
          >
            Approved
          </Button>
          <Button
            variant={filters.status === 'REJECTED' ? 'default' : 'outline'}
            onClick={() => handleStatusFilter('REJECTED')}
          >
            Rejected
          </Button>
        </div>
      </div>

      {changeRequestsLoading ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className='p-6'>
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-1/3' />
                  <Skeleton className='h-4 w-1/2' />
                  <Skeleton className='h-4 w-1/4' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className='space-y-4'>
          {changeRequests.length === 0 ? (
            <Card>
              <CardContent className='p-6 text-center'>
                <p className='text-gray-500'>No change requests found</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className='p-0'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-center'>No</TableHead>
                      <TableHead>Object</TableHead>
                      <TableHead className='text-center'>Action</TableHead>
                      <TableHead className='text-center'>Status</TableHead>
                      <TableHead>Proposed By</TableHead>
                      <TableHead className='text-center'>Submitted</TableHead>
                      <TableHead className='text-center'>Reviewed By</TableHead>
                      <TableHead className='text-center'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeRequests.map((request, idx) => {
                      const snapshot = request.requestSnapshot as IStructuredSnapshot

                      return (
                        <TableRow key={request.id}>
                          <TableCell className='text-center'>{(filters.skip || 0) + idx + 1}</TableCell>
                          <TableCell className='font-medium'>
                            {request.object?.title || (snapshot?.action === 'CREATE' ? 'New Object' : 'Unknown')}
                          </TableCell>
                          <TableCell className='text-center capitalize'>
                            <div className='inline-flex items-center gap-2'>
                              {(snapshot?.action || 'UPDATE').toLowerCase()}
                            </div>
                          </TableCell>
                          <TableCell className='text-center'>
                            <Badge className={statusColors[request.status]}>
                              <div className='inline-flex items-center gap-1'>
                                {getStatusIcon(request.status)}
                                {request.status}
                              </div>
                            </Badge>
                          </TableCell>
                          <TableCell>{request.proposedBy?.name || '-'}</TableCell>
                          <TableCell className='text-center'>
                            {new Date(request.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className='text-center'>{request.reviewedBy?.name || '-'}</TableCell>
                          <TableCell className='text-center'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => router.push(`/change-request/${request.id}`)}
                            >
                              <Eye className='mr-2 h-4 w-4' /> Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          <ListPagination
            skip={filters.skip || 0}
            take={filters.take || 10}
            totalPages={totalPages}
            itemCount={changeRequests.length}
            onChangeSkip={nextSkip => setFilters(prev => ({ ...prev, skip: nextSkip }))}
            className='mt-4'
          />
        </div>
      )}
    </div>
  )
}

export default ChangeRequestList
