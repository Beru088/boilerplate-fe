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
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useUpdateGroup } from '@/features/groups/api/groups-mutations'
import { useMenuPermissions } from '@/features/groups/api/groups'
import { IGroup, IGroupUpdate } from '@/types/groups'

const updateGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().optional(),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
  isActive: z.boolean()
})

type UpdateGroupFormData = z.infer<typeof updateGroupSchema>

interface UpdateGroupFormProps {
  group: IGroup
  onSuccess: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateGroupForm({ group, onSuccess, open, onOpenChange }: UpdateGroupFormProps) {
  const updateGroup = useUpdateGroup()
  const { menuPermissions, menuPermissionsLoading } = useMenuPermissions()

  const form = useForm<UpdateGroupFormData>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      permissions: [],
      isActive: true
    }
  })

  useEffect(() => {
    if (group && open) {
      form.reset({
        name: group.name,
        code: group.code,
        description: group.description || '',
        permissions: group.permissions,
        isActive: group.isActive
      })
    }
  }, [group, open, form])

  const handleSubmit = async (data: UpdateGroupFormData) => {
    try {
      await updateGroup.mutateAsync({ id: group.id, ...data })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      // Error is handled by the mutation
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Update Group</DialogTitle>
          <DialogDescription>Update group information and permissions.</DialogDescription>
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
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateGroup.isPending}>
                {updateGroup.isPending ? 'Updating...' : 'Update Group'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
