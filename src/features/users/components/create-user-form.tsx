'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { Plus, Loader2 } from 'lucide-react'
import { useCreateUser } from '@/features/users/api/user-mutation'
import { useRoles } from '@/features/master-data/api/roles'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth'

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  roleId: z.number().min(1, 'Please select a role'),
  password: z.string().optional(),
  userAbility: z.object({ canDownload: z.boolean().optional() }).optional()
})

type CreateUserFormData = z.infer<typeof createUserSchema>

interface CreateUserFormProps {
  onSuccess?: () => void
  allowedRoleNames?: string[]
}

const CreateUserForm = ({ onSuccess, allowedRoleNames }: CreateUserFormProps) => {
  const [open, setOpen] = useState(false)
  const createUserMutation = useCreateUser()
  const { roles, rolesLoading } = useRoles()
  const { user } = useAuth()

  const currentUserRole = user?.role?.name || ''

  const filteredRoles = useMemo(() => {
    let list = roles

    if (allowedRoleNames && allowedRoleNames.length > 0) {
      list = list.filter(r => allowedRoleNames.includes(r.name))
    }

    if (currentUserRole !== 'superadmin') {
      list = list.filter(r => r.name !== 'superadmin')
    }

    return list
  }, [roles, allowedRoleNames, currentUserRole])

  const singleRoleName = filteredRoles.length === 1 ? filteredRoles[0].name : undefined
  const formattedSingleRole = useMemo(() => {
    if (!singleRoleName) return ''

    return singleRoleName.charAt(0).toUpperCase() + singleRoleName.slice(1)
  }, [singleRoleName])

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: 0,
      password: '',
      userAbility: { canDownload: false }
    }
  })

  useEffect(() => {
    if (!rolesLoading && filteredRoles.length === 1) {
      form.setValue('roleId', filteredRoles[0].id)
    }
  }, [rolesLoading, filteredRoles, form])

  const isViewerRole = useMemo(() => {
    const roleId = form.getValues('roleId')
    const role = filteredRoles.find(r => r.id === roleId)

    return (role?.name || singleRoleName) === 'viewer'
  }, [form, filteredRoles, singleRoleName])

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      await createUserMutation.mutateAsync({
        email: data.email,
        name: data.name,
        roleId: data.roleId,
        password: data.password,
        userAbility: isViewerRole ? data.userAbility : undefined
      })
      toast.success('User created successfully')
      form.reset()
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to create user:' + (error as Error).message)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle> {`Create New ${formattedSingleRole || 'User'}`} </DialogTitle>
          <DialogDescription>
            {formattedSingleRole
              ? `You are creating a ${formattedSingleRole} account. Fill in the required information below.`
              : 'Add a new user to the system. Fill in the required information below.'}
          </DialogDescription>
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
            {filteredRoles.length > 1 && (
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
                        {filteredRoles.map(role => (
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
            )}

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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter password' type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(false)}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={createUserMutation.isPending || rolesLoading || filteredRoles.length === 0}
              >
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUserForm
