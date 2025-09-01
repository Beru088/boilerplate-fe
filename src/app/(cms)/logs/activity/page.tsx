'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

const ActivityLogsPage = () => {
  const router = useRouter()

  // Redirect to the new separated pages
  React.useEffect(() => {
    router.replace('/logs/archive-data')
  }, [router])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Activity Logs</h1>
        <p className='text-muted-foreground'>Redirecting to archive data logs...</p>
      </div>
    </div>
  )
}

export default ActivityLogsPage
