'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Tag, MapPin, Image } from 'lucide-react'
import type { IObjectChangeRequest, IStructuredSnapshot, RequestStatus } from '@/types/change-requests'
import { useReviewChangeRequest } from '@/features/change-request/api/change-request'

interface ChangeRequestViewerProps {
  changeRequest: IObjectChangeRequest
  currentUserId?: number
}

const getStatusIcon = (status: RequestStatus) => {
  switch (status) {
    case 'PENDING':
      return <Clock className='h-4 w-4' />
    case 'APPROVED':
      return <CheckCircle className='h-4 w-4' />
    case 'REJECTED':
      return <XCircle className='h-4 w-4' />
    case 'CANCELED':
      return <AlertCircle className='h-4 w-4' />
  }
}

const getStatusColor = (status: RequestStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'REVIEWED':
      return 'bg-blue-100 text-blue-800'
    case 'APPROVED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'CANCELED':
      return 'bg-gray-100 text-gray-800'
  }
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i]
}

const BasicDataSection: React.FC<{ basic: any }> = ({ basic }) => (
  <div className='space-y-3'>
    <h4 className='flex items-center gap-2 font-medium'>
      <FileText className='h-4 w-4' />
      Basic Information
    </h4>
    <div className='grid grid-cols-1 gap-3 text-sm md:grid-cols-2'>
      {basic.code && (
        <div>
          <span className='text-muted-foreground'>Code:</span>
          <span className='ml-2 font-mono'>{basic.code}</span>
        </div>
      )}
      {basic.title && (
        <div>
          <span className='text-muted-foreground'>Title:</span>
          <span className='ml-2'>{basic.title}</span>
        </div>
      )}
      {basic.titleEn && (
        <div>
          <span className='text-muted-foreground'>Title (EN):</span>
          <span className='ml-2'>{basic.titleEn}</span>
        </div>
      )}
      {basic.description && (
        <div className='md:col-span-2'>
          <span className='text-muted-foreground'>Description:</span>
          <p className='mt-1 ml-2'>{basic.description}</p>
        </div>
      )}
      {basic.descriptionEn && (
        <div className='md:col-span-2'>
          <span className='text-muted-foreground'>Description (EN):</span>
          <p className='mt-1 ml-2'>{basic.descriptionEn}</p>
        </div>
      )}
      {basic.dateTaken && (
        <div>
          <span className='text-muted-foreground'>Date Taken:</span>
          <span className='ml-2'>{new Date(basic.dateTaken).toLocaleDateString()}</span>
        </div>
      )}
      {basic.category && (
        <div>
          <span className='text-muted-foreground'>Category:</span>
          <span className='ml-2'>{basic.category.name}</span>
        </div>
      )}
      {basic.material && (
        <div>
          <span className='text-muted-foreground'>Material:</span>
          <span className='ml-2'>{basic.material.name}</span>
        </div>
      )}
    </div>
  </div>
)

const MediaSection: React.FC<{ media: any }> = ({ media }) => (
  <div className='space-y-3'>
    <h4 className='flex items-center gap-2 font-medium'>
      <Image className='h-4 w-4' />
      Media Changes
    </h4>

    {media.toAdd && media.toAdd.length > 0 && (
      <div>
        <h5 className='mb-2 text-sm font-medium text-green-700'>Adding {media.toAdd.length} file(s):</h5>
        <div className='space-y-2'>
          {media.toAdd.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-3 rounded-lg bg-green-50 p-2'>
              <Badge variant='outline' className='bg-green-100 text-xs'>
                {item.isCover ? 'Cover' : `Pos ${item.position}`}
              </Badge>
              <span className='text-sm'>{item.url.split('/').pop()}</span>
              <span className='text-muted-foreground text-xs'>{item.mime}</span>
              <span className='text-muted-foreground text-xs'>{formatFileSize(item.sizeBytes)}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {media.toUpdate && media.toUpdate.length > 0 && (
      <div>
        <h5 className='mb-2 text-sm font-medium text-blue-700'>Updating {media.toUpdate.length} file(s):</h5>
        <div className='space-y-2'>
          {media.toUpdate.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-3 rounded-lg bg-blue-50 p-2'>
              <Badge variant='outline' className='bg-blue-100 text-xs'>
                ID {item.id}
              </Badge>
              {item.position !== undefined && <span className='text-xs'>Position: {item.position}</span>}
              {item.isCover !== undefined && (
                <span className='text-xs'>{item.isCover ? 'Set as cover' : 'Remove cover'}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    )}

    {media.toDelete && media.toDelete.length > 0 && (
      <div>
        <h5 className='mb-2 text-sm font-medium text-red-700'>Removing {media.toDelete.length} file(s):</h5>
        <div className='space-y-2'>
          {media.toDelete.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-3 rounded-lg bg-red-50 p-2'>
              <Badge variant='outline' className='bg-red-100 text-xs'>
                ID {item.id}
              </Badge>
              <span className='text-sm'>{item.url.split('/').pop()}</span>
              <span className='text-muted-foreground text-xs'>{item.mime}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)

const TagsSection: React.FC<{ tags: any }> = ({ tags }) => (
  <div className='space-y-3'>
    <h4 className='flex items-center gap-2 font-medium'>
      <Tag className='h-4 w-4' />
      Tags
    </h4>

    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <div>
        <h5 className='text-muted-foreground mb-2 text-sm font-medium'>Current:</h5>
        <div className='flex flex-wrap gap-1'>
          {tags.current && tags.current.length > 0 ? (
            tags.current.map((tag: any) => (
              <Badge key={tag.id} variant='secondary' className='text-xs'>
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground text-xs'>No tags</span>
          )}
        </div>
      </div>

      <div>
        <h5 className='mb-2 text-sm font-medium text-green-700'>Proposed:</h5>
        <div className='flex flex-wrap gap-1'>
          {tags.proposed && tags.proposed.length > 0 ? (
            tags.proposed.map((tag: any, index: number) => (
              <Badge key={tag.id || index} variant='outline' className='bg-green-50 text-xs'>
                {tag.name}
              </Badge>
            ))
          ) : (
            <span className='text-muted-foreground text-xs'>No tags</span>
          )}
        </div>
      </div>
    </div>
  </div>
)

const LocationSection: React.FC<{ location: any }> = ({ location }) => (
  <div className='space-y-3'>
    <h4 className='flex items-center gap-2 font-medium'>
      <MapPin className='h-4 w-4' />
      Location
    </h4>

    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      {location.current && (
        <div>
          <h5 className='text-muted-foreground mb-2 text-sm font-medium'>Current:</h5>
          <div className='space-y-1 text-sm'>
            {location.current.location && <div>Location: {location.current.location.name}</div>}
            {location.current.subLocation && <div>Sub-location: {location.current.subLocation.name}</div>}
            {location.current.details && <div>Details: {location.current.details}</div>}
            {!location.current.location && !location.current.subLocation && !location.current.details && (
              <span className='text-muted-foreground'>No location set</span>
            )}
          </div>
        </div>
      )}

      <div>
        <h5 className='mb-2 text-sm font-medium text-green-700'>Proposed:</h5>
        <div className='space-y-1 text-sm'>
          {location.proposed.location && <div>Location: {location.proposed.location.name}</div>}
          {location.proposed.subLocation && <div>Sub-location: {location.proposed.subLocation.name}</div>}
          {location.proposed.details && <div>Details: {location.proposed.details}</div>}
          {!location.proposed.location && !location.proposed.subLocation && !location.proposed.details && (
            <span className='text-muted-foreground'>No location set</span>
          )}
        </div>
      </div>
    </div>
  </div>
)

export const ChangeRequestViewer: React.FC<ChangeRequestViewerProps> = ({ changeRequest, currentUserId }) => {
  const router = useRouter()
  const snapshot = changeRequest.requestSnapshot as IStructuredSnapshot
  const [rejectReason, setRejectReason] = React.useState('')
  const [showRejectForm, setShowRejectForm] = React.useState(false)

  const reviewMutation = useReviewChangeRequest()

  const handleSubmit = () => {
    reviewMutation.mutate({ id: changeRequest.id, review: { status: 'APPROVED', submit: true } })
  }

  const handleReject = () => {
    if (rejectReason.trim()) {
      reviewMutation.mutate({
        id: changeRequest.id,
        review: {
          status: 'REJECTED',
          reasonRejected: rejectReason
        }
      })
      setShowRejectForm(false)
      setRejectReason('')
    }
  }

  const isLoading = reviewMutation.isPending

  const hasFirstReviewer = !!changeRequest.reviewedById
  const hasSecondReviewer = !!changeRequest.reviewedById2
  const hasTwoReviewers = hasFirstReviewer && hasSecondReviewer
  const isReviewedByCurrentUser =
    !!currentUserId && (changeRequest.reviewedById === currentUserId || changeRequest.reviewedById2 === currentUserId)

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div>
                <CardTitle className='text-lg'>Change Request #{changeRequest.id}</CardTitle>
                <p className='text-muted-foreground mt-1 text-sm'>{snapshot.summary}</p>
              </div>
            </div>
            <Badge className={getStatusColor(changeRequest.status)}>
              <div className='flex items-center gap-1'>
                {getStatusIcon(changeRequest.status)}
                {changeRequest.status}
              </div>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-4'>
            <div>
              <span className='text-muted-foreground'>Proposed by:</span>
              <div className='font-medium'>{changeRequest.proposedBy?.name}</div>
              <div className='text-muted-foreground text-xs'>{changeRequest.proposedBy?.email}</div>
            </div>
            <div>
              <span className='text-muted-foreground'>Reviewed by #1:</span>
              <div className='text-sm'>
                {changeRequest.reviewedBy ? (
                  <>
                    <div className='font-medium'>{changeRequest.reviewedBy.name}</div>
                    {changeRequest.reviewedAt && (
                      <div className='text-muted-foreground text-xs'>
                        {new Date(changeRequest.reviewedAt).toLocaleString()}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='font-medium'>Awaiting reviewer</div>
                )}
              </div>
            </div>
            <div>
              <span className='text-muted-foreground'>Reviewed by #2:</span>
              <div className='text-sm'>
                {changeRequest.reviewedBy2 ? (
                  <>
                    <div className='font-medium'>{changeRequest.reviewedBy2.name}</div>
                    {changeRequest.reviewedAt2 && (
                      <div className='text-muted-foreground text-xs'>
                        {new Date(changeRequest.reviewedAt2).toLocaleString()}
                      </div>
                    )}
                  </>
                ) : (
                  <div className='font-medium'>Awaiting reviewer</div>
                )}
              </div>
            </div>
            <div>
              <span className='text-muted-foreground'>Submitted:</span>
              <div>{new Date(changeRequest.submittedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Change reason */}
          {snapshot.changeReason && (
            <div>
              <span className='text-muted-foreground text-sm'>Reason:</span>
              <p className='mt-1'>{snapshot.changeReason}</p>
            </div>
          )}

          {/* Rejection reason */}
          {changeRequest.status === 'REJECTED' && changeRequest.reasonRejected && (
            <div className='rounded-lg bg-red-50 p-3'>
              <span className='text-sm font-medium text-red-700'>Rejection reason:</span>
              <p className='mt-1 text-sm'>{changeRequest.reasonRejected}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Details */}
      <Card>
        <CardHeader>
          <CardTitle>Proposed Changes</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Basic Data */}
          {snapshot.objectData.basic && (
            <>
              <BasicDataSection basic={snapshot.objectData.basic} />
              <Separator />
            </>
          )}

          {/* Media Changes */}
          {snapshot.objectData.media && (
            <>
              <MediaSection media={snapshot.objectData.media} />
              <Separator />
            </>
          )}

          {/* Tag Changes */}
          {snapshot.objectData.tags && (
            <>
              <TagsSection tags={snapshot.objectData.tags} />
              <Separator />
            </>
          )}

          {/* Location Changes */}
          {snapshot.objectData.location && (
            <>
              <LocationSection location={snapshot.objectData.location} />
            </>
          )}
        </CardContent>
      </Card>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        {/* Left side: Cancel always shown */}
        <div>
          <Button variant='outline' onClick={() => router.push('/change-request')} disabled={isLoading}>
            Cancel
          </Button>
        </div>

        {/* Right side */}
        <div className='flex items-center gap-4'>
          {/* Case 1: Status is final → single disabled button */}
          {(changeRequest.status === 'APPROVED' ||
            changeRequest.status === 'REJECTED' ||
            changeRequest.status === 'CANCELED') && (
            <Button disabled variant='outline'>
              {changeRequest.status}
            </Button>
          )}

          {/* Case 2: Still active (PENDING or REVIEWED) → review actions */}
          {(changeRequest.status === 'PENDING' || changeRequest.status === 'REVIEWED') && (
            <>
              {isReviewedByCurrentUser ? (
                <>
                  {/* Already reviewed by me → show Approved (disabled) + Submit */}
                  <Button disabled variant='secondary'>
                    Approved
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !hasTwoReviewers}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Submit
                  </Button>
                </>
              ) : (
                <>
                  {/* Approve button */}
                  <Button
                    variant='secondary'
                    onClick={() =>
                      reviewMutation.mutate({
                        id: changeRequest.id,
                        review: { status: 'APPROVED' }
                      })
                    }
                    disabled={isLoading}
                  >
                    Approve
                  </Button>

                  {/* Reject button + reason input */}
                  {!showRejectForm ? (
                    <Button variant='destructive' onClick={() => setShowRejectForm(true)} disabled={isLoading}>
                      <XCircle className='mr-2 h-4 w-4' />
                      Reject
                    </Button>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        placeholder='Rejection reason...'
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        className='rounded-md border px-3 py-2 text-sm'
                      />
                      <Button
                        variant='destructive'
                        onClick={handleReject}
                        disabled={isLoading || !rejectReason.trim()}
                        size='sm'
                      >
                        Reject
                      </Button>
                      <Button
                        variant='outline'
                        onClick={() => {
                          setShowRejectForm(false)
                          setRejectReason('')
                        }}
                        disabled={isLoading}
                        size='sm'
                      >
                        Cancel
                      </Button>
                    </div>
                  )}

                  {/* Submit button (disabled until 2 reviewers exist) */}
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !hasTwoReviewers}
                    className='bg-green-600 hover:bg-green-700'
                  >
                    <CheckCircle className='mr-2 h-4 w-4' />
                    Submit
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChangeRequestViewer
