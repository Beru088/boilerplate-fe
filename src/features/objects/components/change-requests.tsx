'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCancelChangeRequest, useReviewChangeRequest } from '@/features/objects/api/object-mutation'

export const ChangeRequests = ({ id }: { id: number }) => {
  const review = useReviewChangeRequest()
  const cancel = useCancelChangeRequest()
  const [reviewReason, setReviewReason] = useState('')

  return (
    <div className='space-y-3'>
      <div className='space-y-2'>
        <div className='text-sm font-medium'>Review a request</div>
        <input className='w-full rounded border p-2 text-sm' placeholder='Change Request ID' id='cr-id' />
        <input
          className='w-full rounded border p-2 text-sm'
          placeholder='Reason (optional for REJECTED)'
          value={reviewReason}
          onChange={e => setReviewReason(e.target.value)}
        />
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              const idInput = (document.getElementById('cr-id') as HTMLInputElement)?.value
              const crId = Number(idInput)
              if (!crId) return
              review.mutate({ id: crId, payload: { status: 'APPROVED' } })
            }}
          >
            Approve
          </Button>
          <Button
            size='sm'
            variant='destructive'
            onClick={() => {
              const idInput = (document.getElementById('cr-id') as HTMLInputElement)?.value
              const crId = Number(idInput)
              if (!crId) return
              review.mutate({ id: crId, payload: { status: 'REJECTED', reasonRejected: reviewReason } })
            }}
          >
            Reject
          </Button>
          <Button
            size='sm'
            onClick={() => {
              const idInput = (document.getElementById('cr-id') as HTMLInputElement)?.value
              const crId = Number(idInput)
              if (!crId) return
              cancel.mutate(crId)
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
