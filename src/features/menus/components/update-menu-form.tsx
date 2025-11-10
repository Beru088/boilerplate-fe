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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateMenu } from '@/features/menus/api/menus-mutations'
import { useMenus } from '@/features/menus/api/menus'
import { IMenu, IMenuUpdate } from '@/types/menus'

const updateMenuSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().min(1, 'Code is required'),
  embedUrl: z.string().optional(),
  provider: z.string().optional(),
  icon: z.string().optional(),
  parentId: z.number().optional(),
  order: z.number().min(0, 'Order must be 0 or greater'),
  isActive: z.boolean()
})

type UpdateMenuFormData = z.infer<typeof updateMenuSchema>

interface UpdateMenuFormProps {
  menu: IMenu
  onSuccess: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateMenuForm({ menu, onSuccess, open, onOpenChange }: UpdateMenuFormProps) {
  const updateMenu = useUpdateMenu()
  const { menus } = useMenus()

  const form = useForm<UpdateMenuFormData>({
    resolver: zodResolver(updateMenuSchema),
    defaultValues: {
      name: '',
      code: '',
      embedUrl: '',
      provider: '',
      icon: '',
      parentId: undefined,
      order: 0,
      isActive: true
    }
  })

  useEffect(() => {
    if (menu && open) {
      form.reset({
        name: menu.name,
        code: menu.code,
        embedUrl: menu.embedUrl || '',
        provider: menu.provider || '',
        icon: menu.icon || '',
        parentId: menu.parentId,
        order: menu.order,
        isActive: menu.isActive
      })
    }
  }, [menu, open, form])

  const handleSubmit = async (data: UpdateMenuFormData) => {
    try {
      await updateMenu.mutateAsync({ id: menu.id, ...data })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const renderParentMenuOptions = (menus: any[], level = 0) => {
    return menus.map(menuItem => (
      <SelectItem key={menuItem.id} value={menuItem.id.toString()}>
        {level > 0 ? '  '.repeat(level) + '└ ' : ''}
        {menuItem.name}
      </SelectItem>
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Update Menu</DialogTitle>
          <DialogDescription>Update menu information and settings.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Menu Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter menu name' {...field} />
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
                    <FormLabel>Menu Code</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter menu code' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='icon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter icon name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='order'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='Enter order'
                        {...field}
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Menu</FormLabel>
                  <Select
                    value={field.value ? field.value.toString() : 'none'}
                    onValueChange={value => field.onChange(value === 'none' ? undefined : parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select parent menu (optional)' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='none'>No Parent</SelectItem>
                      {renderParentMenuOptions(menus)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='embedUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Embed URL</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter embed URL' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='provider'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter provider (e.g., youtube)' {...field} />
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
            <DialogFooter>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateMenu.isPending}>
                {updateMenu.isPending ? 'Updating...' : 'Update Menu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
