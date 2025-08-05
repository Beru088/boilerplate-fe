'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Plus, Search, Filter } from 'lucide-react'

export default function UsersPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Users</h1>
          <p className='text-muted-foreground'>Manage regular user accounts and access permissions.</p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </div>

      <div className='flex items-center gap-4'>
        <Button variant='outline'>
          <Search className='mr-2 h-4 w-4' />
          Search
        </Button>
        <Button variant='outline'>
          <Filter className='mr-2 h-4 w-4' />
          Filter
        </Button>
      </div>

      <div className='grid gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Users className='h-5 w-5' />
              User List
            </CardTitle>
            <CardDescription>Regular users with access to the Historia platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <Users className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium'>John Doe</p>
                    <p className='text-muted-foreground text-sm'>john@example.com</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>Active</Badge>
                  <Badge variant='outline'>User</Badge>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <Users className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Jane Smith</p>
                    <p className='text-muted-foreground text-sm'>jane@example.com</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>Active</Badge>
                  <Badge variant='outline'>User</Badge>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4 opacity-60'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gray-100'>
                    <Users className='h-5 w-5 text-gray-400' />
                  </div>
                  <div>
                    <p className='font-medium'>Mike Johnson</p>
                    <p className='text-muted-foreground text-sm'>mike@example.com</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='destructive'>Inactive</Badge>
                  <Badge variant='outline'>User</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
