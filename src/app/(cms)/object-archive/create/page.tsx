'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateObjectForm } from '@/features/objects/components/create-object-form'

const CreateObjectPage = () => {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Create Object</CardTitle>
          <CardDescription>Create a new archive object with media</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateObjectForm />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateObjectPage
