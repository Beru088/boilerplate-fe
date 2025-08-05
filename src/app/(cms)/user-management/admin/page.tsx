'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserLock, Plus, Search, Filter } from 'lucide-react'

export default function AdminUsersPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Admin Users</h1>
          <p className='text-muted-foreground'>Manage administrator accounts and permissions.</p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add Admin User
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
              <UserLock className='h-5 w-5' />
              Administrator List
            </CardTitle>
            <CardDescription>Users with administrative privileges and system access.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                    <UserLock className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <p className='font-medium'>Super Admin</p>
                    <p className='text-muted-foreground text-sm'>admin@historia.com</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge>Active</Badge>
                  <Badge variant='secondary'>Super Admin</Badge>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                    <UserLock className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <p className='font-medium'>Admin User</p>
                    <p className='text-muted-foreground text-sm'>admin2@historia.com</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge>Active</Badge>
                  <Badge variant='secondary'>Admin</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
