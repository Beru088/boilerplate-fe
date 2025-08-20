'use client'

import { useChangeRequest } from '../api/change-request'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELED: 'bg-gray-100 text-gray-800'
}

interface ChangeRequestDetailProps {
  id: number
}

const ChangeRequestDetail = ({ id }: ChangeRequestDetailProps) => {
  const router = useRouter()
  const { changeRequest, changeRequestLoading, changeRequestError, refetch } = useChangeRequest(id)

  if (changeRequestError) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>
            <p className='mb-4 text-red-600'>Error loading change request</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (changeRequestLoading) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-4'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-48' />
        </div>
        <Card>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              <Skeleton className='h-6 w-1/3' />
              <Skeleton className='h-4 w-1/2' />
              <Skeleton className='h-4 w-2/3' />
              <Skeleton className='h-4 w-1/3' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!changeRequest) {
    return (
      <Card>
        <CardContent className='p-6 text-center'>
          <p className='text-gray-500'>Change request not found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='sm' onClick={() => router.back()}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back
        </Button>
        <h1 className='text-2xl font-bold'>Change Request #{changeRequest.id}</h1>
        <Badge className={statusColors[changeRequest.status]}>{changeRequest.status}</Badge>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-600'>Object</label>
              <p className='text-sm'>{changeRequest.object.title}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-600'>Category</label>
              <p className='text-sm'>{changeRequest.object.category?.name || 'N/A'}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-600'>Material</label>
              <p className='text-sm'>{changeRequest.object.material?.name || 'N/A'}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-600'>Submitted At</label>
              <p className='text-sm'>{new Date(changeRequest.submittedAt).toLocaleString()}</p>
            </div>
            {changeRequest.reviewedAt && (
              <div>
                <label className='text-sm font-medium text-gray-600'>Reviewed At</label>
                <p className='text-sm'>{new Date(changeRequest.reviewedAt).toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label className='text-sm font-medium text-gray-600'>Proposed By</label>
              <p className='text-sm'>{changeRequest.proposedBy.name}</p>
              <p className='text-xs text-gray-500'>{changeRequest.proposedBy.email}</p>
            </div>
            {changeRequest.reviewedBy && (
              <div>
                <label className='text-sm font-medium text-gray-600'>Reviewed By</label>
                <p className='text-sm'>{changeRequest.reviewedBy.name}</p>
                <p className='text-xs text-gray-500'>{changeRequest.reviewedBy.email}</p>
              </div>
            )}
            {changeRequest.reasonRejected && (
              <div>
                <label className='text-sm font-medium text-gray-600'>Rejection Reason</label>
                <p className='text-sm text-red-600'>{changeRequest.reasonRejected}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Snapshot</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className='overflow-x-auto rounded-lg bg-gray-50 p-4 text-sm'>
            {JSON.stringify(changeRequest.requestSnapshot, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

export default ChangeRequestDetail
