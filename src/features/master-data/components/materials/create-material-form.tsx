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
import { useCreateMaterial } from '@/features/master-data/api/materials'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameEn: z.string().optional()
})
type FormData = z.infer<typeof schema>

export default function CreateMaterialForm() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateMaterial()
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', nameEn: '' } })

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data)
      toast.success('Material created')
      form.reset()
      setOpen(false)
    } catch {
      toast.error('Failed to create material')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> New Material
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Material</DialogTitle>
          <DialogDescription>Add a new material to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
            <FormField
              name='name'
              control={form.control}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Name - Indonesia</FormLabel>
                  <FormControl>
                    <Input placeholder='Material name' {...field} />
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
                    <Input placeholder='Material name in English' {...field} />
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
