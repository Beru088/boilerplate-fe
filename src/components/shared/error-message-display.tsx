'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ErrorMessageDisplayProps {
  message: string
  maxLength?: number
  className?: string
}

export const ErrorMessageDisplay = ({ message, maxLength = 200, className = '' }: ErrorMessageDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const shouldTruncate = message.length > maxLength
  const displayMessage = isExpanded || !shouldTruncate ? message : message.substring(0, maxLength) + '...'

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='text-muted-foreground max-w-full overflow-hidden text-sm break-words whitespace-pre-wrap'>
        {displayMessage}
      </div>
      {shouldTruncate && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsExpanded(!isExpanded)}
          className='text-muted-foreground hover:text-foreground h-auto p-1 text-xs'
        >
          {isExpanded ? (
            <>
              <ChevronUp className='mr-1 h-3 w-3' />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className='mr-1 h-3 w-3' />
              Read more
            </>
          )}
        </Button>
      )}
    </div>
  )
}
