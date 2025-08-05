'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UserCog, Plus, Search, Filter, Settings } from 'lucide-react'
import { useState } from 'react'

export default function RolesPage() {
  const [search, setSearch] = useState('')

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>Roles</h1>
        <p className='text-muted-foreground'>Manage user roles and permission levels.</p>
      </div>

      <div className='flex items-center justify-between gap-4'>
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
              <UserCog className='h-5 w-5' />
              Role Management
            </CardTitle>
            <CardDescription>Define roles and their associated permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                    <UserCog className='h-5 w-5 text-red-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Super Administrator</p>
                    <p className='text-muted-foreground text-sm'>Full system access and control</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge>System Role</Badge>
                  <Button variant='outline' size='sm'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                    <UserCog className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Administrator</p>
                    <p className='text-muted-foreground text-sm'>Administrative access with some restrictions</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>Custom Role</Badge>
                  <Button variant='outline' size='sm'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                    <UserCog className='h-5 w-5 text-green-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Contributor</p>
                    <p className='text-muted-foreground text-sm'>Can create and edit content</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary'>Custom Role</Badge>
                  <Button variant='outline' size='sm'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </div>
              </div>

              <div className='flex items-center justify-between rounded-lg border p-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                    <UserCog className='h-5 w-5 text-blue-600' />
                  </div>
                  <div>
                    <p className='font-medium'>Viewer</p>
                    <p className='text-muted-foreground text-sm'>Read-only access to content</p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline'>Read Only</Badge>
                  <Button variant='outline' size='sm'>
                    <Settings className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
