'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateObjectForm } from '@/features/objects/components/update-object-form'

const EditObjectPage = () => {
  const params = useParams()
  const id = Number(params?.id)
  if (!id) return null

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Object</CardTitle>
          <CardDescription>Update object details and media</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateObjectForm id={id} />
        </CardContent>
      </Card>
    </div>
  )
}

export default EditObjectPage
