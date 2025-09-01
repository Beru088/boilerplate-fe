'use client'

import { useState, useEffect, useMemo } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Loader2 } from 'lucide-react'
import { useUpdateUser } from '@/features/users/api/user-mutation'
import { useRoles } from '@/features/master-data/api/roles'
import { IUser } from '@/types/users'
import { toast } from 'sonner'

const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  roleId: z.number().min(1, 'Please select a role'),
  userAbility: z.object({ canDownload: z.boolean().optional() }).optional()
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
  const { roles, rolesLoading } = useRoles()

  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      userAbility: { canDownload: user.userAbility?.canDownload || false }
    }
  })

  useEffect(() => {
    form.reset({
      name: user.name,
      email: user.email,
      roleId: user.role.id,
      userAbility: { canDownload: user.userAbility?.canDownload || false }
    })
  }, [user, form])

  const isViewerRole = useMemo(() => {
    const roleId = form.getValues('roleId')
    const role = roles.find(r => r.id === roleId)

    return role?.name === 'viewer'
  }, [form, roles])

  const onSubmit = async (data: UpdateUserFormData) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        userData: {
          name: data.name,
          email: data.email,
          roleId: data.roleId,
          userAbility: isViewerRole ? data.userAbility : undefined
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
        name: user.name,
        email: user.email,
        roleId: user.role.id,
        userAbility: { canDownload: user.userAbility?.canDownload || false }
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
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter user name' {...field} />
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
              name='roleId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={value => field.onChange(parseInt(value))}
                    defaultValue={field.value ? field.value.toString() : undefined}
                    disabled={rolesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={rolesLoading ? 'Loading roles...' : 'Select a role'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isViewerRole && (
              <FormField
                control={form.control}
                name='userAbility'
                render={() => (
                  <FormItem>
                    <FormLabel>Viewer Abilities</FormLabel>
                    <div className='flex items-center gap-2'>
                      <input
                        id='canDownload'
                        type='checkbox'
                        checked={!!form.getValues('userAbility')?.canDownload}
                        onChange={e =>
                          form.setValue('userAbility', {
                            ...(form.getValues('userAbility') || {}),
                            canDownload: e.target.checked
                          })
                        }
                      />
                      <label htmlFor='canDownload'>Can download media</label>
                    </div>
                    <FormMessage />
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
              <Button type='submit' disabled={updateUserMutation.isPending || rolesLoading}>
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
