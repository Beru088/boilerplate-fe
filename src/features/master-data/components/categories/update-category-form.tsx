'use client'

import { useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import { useUpdateCategory } from '@/features/master-data/api/categories'
import type { ICategory } from '@/types/categories'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  description: z.string().optional(),
  files: z.custom<File>(v => !v || v instanceof File, 'Invalid file').optional()
})

type FormData = z.infer<typeof schema>

export default function UpdateCategoryForm({
  category,
  open,
  onOpenChange,
  onSuccess
}: {
  category: ICategory
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess?: () => void
}) {
  const mutation = useUpdateCategory()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', files: undefined }
  })

  useEffect(() => {
    if (category) form.reset({ name: category.name, description: category.description || '' })
  }, [category])

  const onSubmit = async (data: FormData) => {
    try {
      const file = (data as any).files as File | undefined
      if (file) {
        const formData = new FormData()
        if (data.name) formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        formData.append('files', file)
        await mutation.mutateAsync({ id: category.id, payload: formData })
      } else {
        await mutation.mutateAsync({ id: category.id, payload: { name: data.name, description: data.description } })
      }
      toast.success('Category updated')
      onSuccess?.()
      onOpenChange(false)
    } catch {
      toast.error('Failed to update category')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>Modify category details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='Optional' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='files'
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      name='files'
                      type='file'
                      accept='image/*'
                      onChange={e => field.onChange(e.target.files && e.target.files[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
