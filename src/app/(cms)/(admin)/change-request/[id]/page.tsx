'use client'

import { useParams } from 'next/navigation'
import { useChangeRequest } from '@/features/change-request/api/change-request'
import ChangeRequestViewer from '@/features/change-request/components/change-request-viewer'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'

export default function ChangeRequestDetailPage() {
  const params = useParams()
  const requestId = Number(params.id)
  const { user } = useAuth()

  const { changeRequest, changeRequestLoading, changeRequestError } = useChangeRequest(requestId)

  if (changeRequestLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Card>
          <CardContent className='p-6'>
            <div className='animate-pulse space-y-4'>
              <div className='h-8 w-1/3 rounded bg-gray-200'></div>
              <div className='h-4 w-1/2 rounded bg-gray-200'></div>
              <div className='h-4 w-2/3 rounded bg-gray-200'></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (changeRequestError || !changeRequest) {
    return (
      <div className='container mx-auto py-8'>
        <Card>
          <CardContent className='p-6 text-center'>
            <p className='mb-4 text-red-600'>Failed to load change request</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <ChangeRequestViewer changeRequest={changeRequest} currentUserId={user?.id} />
    </div>
  )
}
