'use client'

import { useState } from 'react'
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
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateGroup } from '@/features/groups/api/groups-mutations'
import { useMenuPermissions } from '@/features/groups/api/groups'
import { IGroupCreate } from '@/types/groups'

const createGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  isActive: z.boolean()
})

type CreateGroupFormData = z.infer<typeof createGroupSchema>

interface CreateGroupFormProps {
  onSuccess: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CreateGroupForm({ onSuccess, open, onOpenChange }: CreateGroupFormProps) {
  const [isOpen, setIsOpen] = useState(open || false)
  const createGroup = useCreateGroup()
  const { menuPermissions, menuPermissionsLoading } = useMenuPermissions()

  const form = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      permissions: [],
      isActive: true
    }
  })

  const handleSubmit = async (data: CreateGroupFormData) => {
    try {
      await createGroup.mutateAsync(data)
      form.reset()
      setIsOpen(false)
      onOpenChange?.(false)
      onSuccess()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    onOpenChange?.(open)
    if (!open) {
      form.reset()
    }
  }

  const renderMenuPermissions = (menus: any[], level = 0) => {
    return menus.map(menu => (
      <div key={menu.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        <div className='flex items-center space-x-2'>
          <Checkbox
            id={`permission-${menu.code}`}
            checked={form.watch('permissions').includes(menu.code)}
            onCheckedChange={checked => {
              const currentPermissions = form.getValues('permissions')
              if (checked) {
                form.setValue('permissions', [...currentPermissions, menu.code])
              } else {
                form.setValue(
                  'permissions',
                  currentPermissions.filter(p => p !== menu.code)
                )
              }
            }}
          />
          <label
            htmlFor={`permission-${menu.code}`}
            className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            {menu.name}
          </label>
        </div>
        {menu.children && menu.children.length > 0 && (
          <div className='mt-2'>{renderMenuPermissions(menu.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Button onClick={() => setIsOpen(true)}>Create Group</Button>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Create a new user group with specific permissions.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter group name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter group code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Enter group description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-y-0 space-x-3'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Active</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Permissions</FormLabel>
              <div className='mt-2 max-h-60 overflow-y-auto rounded-md border p-4'>
                {menuPermissionsLoading ? (
                  <div className='text-muted-foreground text-sm'>Loading permissions...</div>
                ) : (
                  renderMenuPermissions(menuPermissions)
                )}
              </div>
              <FormMessage />
            </div>
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={createGroup.isPending}>
                {createGroup.isPending ? 'Creating...' : 'Create Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
