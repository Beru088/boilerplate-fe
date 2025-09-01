'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useActivityLog } from '@/features/logs/api/activity'

const ActivityLogDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const activityLogId = Number(params.id)

  // Get the activity log to determine its type
  const { activityLog } = useActivityLog(activityLogId)
  const isVisitActivity = activityLog?.action === 'VISIT'

  // Redirect to the appropriate new page based on activity type
  React.useEffect(() => {
    if (activityLog) {
      if (isVisitActivity) {
        router.replace(`/logs/users-activity/${activityLogId}`)
      } else {
        router.replace(`/logs/archive-data/${activityLogId}`)
      }
    }
  }, [activityLog, isVisitActivity, activityLogId, router])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Activity Log Details</h1>
        <p className='text-muted-foreground'>
          Redirecting to {isVisitActivity ? 'user activity' : 'archive data'} details...
        </p>
      </div>
    </div>
  )
}

export default ActivityLogDetailPage
