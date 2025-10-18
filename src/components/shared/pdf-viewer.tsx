'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Eye, EyeOff } from 'lucide-react'

interface PdfViewerProps {
  url: string
  title?: string
  className?: string
}

const PdfViewer = ({ url, title = 'PDF Document', className }: PdfViewerProps) => {
  const [isVisible, setIsVisible] = useState(false)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = url
    link.download = title
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='h-5 w-5' />
            {title}
          </CardTitle>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm' onClick={() => setIsVisible(!isVisible)}>
              {isVisible ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              {isVisible ? 'Hide' : 'Show'} PDF
            </Button>
            <Button variant='outline' size='sm' onClick={handleDownload}>
              <Download className='h-4 w-4' />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isVisible ? (
          <div className='h-96 w-full'>
            <iframe src={url} className='h-full w-full rounded border' title={title} />
          </div>
        ) : (
          <div className='bg-muted flex h-32 items-center justify-center rounded'>
            <p className='text-muted-foreground'>Click "Show PDF" to view the document</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PdfViewer
