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
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Loader2 } from 'lucide-react'
import { useCreateCategory } from '@/features/master-data/api/categories'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  files: z.custom<File>(v => v instanceof File, 'Image is required')
})

type FormData = z.infer<typeof schema>

export default function CreateCategoryForm() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateCategory()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', nameEn: '', description: '', descriptionEn: '', files: undefined as unknown as File }
  })

  const onSubmit = async (data: FormData) => {
    try {
      const file = (data as any).files as File
      await mutation.mutateAsync({
        name: data.name,
        nameEn: data.nameEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        files: file
      })
      toast.success('Category created')
      form.reset()
      setOpen(false)
    } catch {
      toast.error('Failed to create category')
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> New Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
            <div className='flex gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Name - Indonesia</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='nameEn'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Name - English</FormLabel>
                    <FormControl>
                      <Input placeholder='Name in English' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='files'
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
              control={form.control}
              name='description'
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
              control={form.control}
              name='descriptionEn'
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
