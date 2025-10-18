'use client'

import { useAuth } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, ArrowRight, Shield, Activity, Settings, Database } from 'lucide-react'
import { useRouter } from 'next/navigation'

const AdminDashboard = () => {
  const { user } = useAuth()
  const router = useRouter()

  const isAdminUser = user?.isAdmin === true

  const quickActions: any[] = []

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage system users and roles',
      icon: Users,
      href: '/user-management/admin',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ]

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome back, {user?.fullname}!</h1>
          <p className='text-muted-foreground'>Access your tools and manage the Samudera Cockpit archive system.</p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge variant='secondary' className='text-sm'>
            <Shield className='mr-1 h-3 w-3' />
            {user?.isAdmin ? 'Admin' : 'User'}
          </Badge>
          <div className='text-muted-foreground text-sm'>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
      <div className='grid gap-8 md:grid-cols-1'>
        <Card className='transition-all duration-200 hover:shadow-lg'>
          <CardHeader className='pb-6'>
            <CardTitle className='flex items-center gap-3 text-xl'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20'>
                <Activity className='h-5 w-5 text-purple-600 dark:text-purple-400' />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className='text-base'>Common tasks you can perform right now</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {quickActions.map(action => (
              <Button
                key={action.title}
                variant='outline'
                className='group h-auto w-full justify-start p-4 transition-all duration-200 hover:shadow-md'
                onClick={() => router.push(action.href)}
              >
                <div
                  className={`mr-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color} transition-all duration-200 group-hover:scale-105`}
                >
                  <action.icon className='h-6 w-6 text-white' />
                </div>
                <div className='flex-1 text-left'>
                  <div className='text-base font-semibold'>{action.title}</div>
                  <div className='text-muted-foreground mt-1 text-sm'>{action.description}</div>
                </div>
                <ArrowRight className='text-muted-foreground ml-4 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1' />
              </Button>
            ))}
          </CardContent>
        </Card>

        {isAdminUser && (
          <Card className='transition-all duration-200 hover:shadow-lg'>
            <CardHeader className='pb-6'>
              <CardTitle className='flex items-center gap-3 text-xl'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/20'>
                  <Settings className='h-5 w-5 text-orange-600 dark:text-orange-400' />
                </div>
                Admin Actions
              </CardTitle>
              <CardDescription className='text-base'>Administrative tasks and system management</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {adminActions.map(action => (
                <Button
                  key={action.title}
                  variant='outline'
                  className='group h-auto w-full justify-start p-4 transition-all duration-200 hover:shadow-md'
                  onClick={() => router.push(action.href)}
                >
                  <div
                    className={`mr-4 flex h-12 w-12 items-center justify-center rounded-xl ${action.color} transition-all duration-200 group-hover:scale-105`}
                  >
                    <action.icon className='h-6 w-6 text-white' />
                  </div>
                  <div className='flex-1 text-left'>
                    <div className='text-base font-semibold'>{action.title}</div>
                    <div className='text-muted-foreground mt-1 text-sm'>{action.description}</div>
                  </div>
                  <ArrowRight className='text-muted-foreground ml-4 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1' />
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className='transition-all duration-200 hover:shadow-md'>
        <CardHeader className='pb-6'>
          <CardTitle className='flex items-center gap-3 text-xl'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20'>
              <Database className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            </div>
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-6 md:grid-cols-3'>
            <div className='space-y-2'>
              <div className='text-sm font-semibold'>Application</div>
              <div className='text-muted-foreground text-sm'>Samudera Cockpit</div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-semibold'>Version</div>
              <div className='text-muted-foreground text-sm'>v1.0.0</div>
            </div>
            <div className='space-y-2'>
              <div className='text-sm font-semibold'>Last Updated</div>
              <div className='text-muted-foreground text-sm'>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard
