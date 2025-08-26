'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useObject } from '@/features/objects/api/object'
import { Badge } from '@/components/ui/badge'
import { getMediaUrl } from '@/utils/helper'
import Image from 'next/image'

const ObjectDetailPage = () => {
  const params = useParams()
  const id = Number(params?.id)
  const { object } = useObject(id)

  if (!id) return null

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>{object?.title || 'Object'}</CardTitle>
          <CardDescription>{object?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-4 flex flex-wrap gap-2'>
            {object?.objectTags?.map(t => (
              <Badge key={t.tag.id} variant='secondary'>
                {t.tag.name}
              </Badge>
            ))}
          </div>
          <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
            {object?.media?.map(m => (
              <Image
                key={m.id}
                src={getMediaUrl(m.url)}
                alt={m.url}
                width={100}
                height={100}
                className={`aspect-square w-full rounded object-cover ${m.isCover ? 'ring-primary ring-2' : ''}`}
              />
            ))}
          </div>
          <div className='text-muted-foreground mt-4 text-sm'>
            Category: {object?.category?.name} • Material: {object?.material?.name}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ObjectDetailPage
