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
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { useUpdateCategory } from '@/features/master-data/api/categories'
import type { ICategory } from '@/types/categories'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  files: z.custom<File>(v => !v || v instanceof File, 'Invalid file').optional()
})

type FormData = z.infer<typeof schema>

export default function UpdateCategoryForm({
  category,
  open,
  onOpenChange
}: {
  category: ICategory
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess?: () => void
}) {
  const mutation = useUpdateCategory()
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', nameEn: '', description: '', descriptionEn: '', files: undefined }
  })

  useEffect(() => {
    if (category)
      form.reset({
        name: category.name,
        nameEn: category.nameEn || '',
        description: category.description || '',
        descriptionEn: category.descriptionEn || ''
      })
  }, [category])

  const onSubmit = async (data: FormData) => {
    try {
      const file = (data as any).files as File | undefined
      await mutation.mutateAsync({
        id: category.id,
        payload: {
          name: data.name,
          nameEn: data.nameEn,
          description: data.description,
          descriptionEn: data.descriptionEn,
          files: file
        }
      })
      toast.success('Category updated')
      onOpenChange(false)
    } catch {
      toast.error('Failed to update category')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Category</DialogTitle>
          <DialogDescription>Modify category details.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
            <div className='flex gap-6'>
              <FormField
                name='name'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Name - Indonesia</FormLabel>
                    <FormControl>
                      <Input placeholder='Category name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='nameEn'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Name - English</FormLabel>
                    <FormControl>
                      <Input placeholder='Category name in English' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              name='description'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Description - Indonesia</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Category description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='descriptionEn'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Description - English</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Category description in English' {...field} />
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
