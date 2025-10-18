'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Edit, Loader2 } from 'lucide-react'
import { useUpdateUser } from '@/features/users/api/user-mutation'
import { IUser } from '@/types/users'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

const updateUserSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  isAdmin: z.boolean()
})

type UpdateUserFormData = z.infer<typeof updateUserSchema>

interface UpdateUserFormProps {
  user: IUser
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const UpdateUserForm = ({ user, onSuccess, open, onOpenChange }: UpdateUserFormProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const updateUserMutation = useUpdateUser()
  const { user: currentUser } = useAuth()

  const currentUserIsAdmin = currentUser?.isAdmin || false

  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      isAdmin: user.isAdmin
    }
  })

  useEffect(() => {
    form.reset({
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      isAdmin: user.isAdmin
    })
  }, [user, form])

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        userData: {
          fullname: data.fullname,
          username: data.username,
          email: data.email,
          phone: data.phone,
          isAdmin: data.isAdmin
        }
      })
      toast.success('User updated successfully')
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to update user:' + (error as Error).message)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset({
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        isAdmin: user.isAdmin
      })
    }
    setIsOpen(newOpen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <Edit className='mr-2 h-4 w-4' />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Update user information. Make changes to the fields below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter full name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter email address' type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter phone number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {currentUserIsAdmin && (
              <FormField
                control={form.control}
                name='isAdmin'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Admin Access</FormLabel>
                      <div className='text-muted-foreground text-sm'>Grant administrative privileges to this user</div>
                    </div>
                    <FormControl>
                      <input type='checkbox' checked={field.value} onChange={field.onChange} className='h-4 w-4' />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsOpen(false)}
                disabled={updateUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={updateUserMutation.isPending}>
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  'Update User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateUserForm
