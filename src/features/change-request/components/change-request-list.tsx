'use client'

import { useState } from 'react'
import { useChangeRequests } from '../api/change-request'
import type { IChangeRequestQuery, RequestStatus } from '@/types/change-requests'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-gray-100 text-gray-800'
}

const ChangeRequestList = () => {
  const [filters, setFilters] = useState<IChangeRequestQuery>({
    skip: 0,
    take: 10
  })

  const { changeRequests, pagination, changeRequestsLoading, changeRequestsError, refetch } = useChangeRequests(filters)

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      skip: (page - 1) * (prev.take || 10)
    }))
  }

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
            changeRequests.map(request => (
              <Card key={request.id}>
                <CardContent className='p-6'>
                  <div className='flex items-start justify-between'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-2'>
                        <h3 className='font-semibold'>Change Request #{request.id}</h3>
                        <Badge className={statusColors[request.status]}>{request.status}</Badge>
                      </div>
                      <p className='text-sm text-gray-600'>Object: {request.object.title}</p>
                      <p className='text-sm text-gray-600'>Proposed by: {request.proposedBy.name}</p>
                      <p className='text-sm text-gray-600'>
                        Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                      {request.reviewedBy && (
                        <p className='text-sm text-gray-600'>Reviewed by: {request.reviewedBy.name}</p>
                      )}
                      {request.reasonRejected && (
                        <p className='text-sm text-red-600'>Reason: {request.reasonRejected}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {pagination.total > 0 && (
        <div className='flex justify-center'>
          <Pagination
            currentPage={Math.floor(pagination.skip / pagination.take) + 1}
            totalPages={Math.ceil(pagination.total / pagination.take)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ChangeRequestList
