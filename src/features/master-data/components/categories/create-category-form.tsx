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
import { Plus, Loader2 } from 'lucide-react'
import { useCreateCategory } from '@/features/master-data/api/categories'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  files: z.custom<File>(v => v instanceof File, 'Image is required')
})

type FormData = z.infer<typeof schema>

export default function CreateCategoryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const mutation = useCreateCategory()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', files: undefined as unknown as File }
  })

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      const file = (data as any).files as File
      formData.append('files', file)
      await mutation.mutateAsync(formData)
      toast.success('Category created')
      form.reset()
      setOpen(false)
      onSuccess?.()
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>Add a new category to the system.</DialogDescription>
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
                    <Input placeholder='Category name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
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
