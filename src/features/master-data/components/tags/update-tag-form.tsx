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
import { useUpdateTag } from '@/features/master-data/api/tags'
import type { ITag } from '@/types/tags'
import { toast } from 'sonner'

const schema = z.object({ name: z.string().min(2, 'Name must be at least 2 characters') })
type FormData = z.infer<typeof schema>

export default function UpdateTagForm({
  tag,
  open,
  onOpenChange,
  onSuccess
}: {
  tag: ITag
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess?: () => void
}) {
  const mutation = useUpdateTag()
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '' } })

  useEffect(() => {
    if (tag) form.reset({ name: tag.name })
  }, [tag])

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({ id: tag.id, payload: data })
      toast.success('Tag updated')
      onSuccess?.()
      onOpenChange(false)
    } catch {
      toast.error('Failed to update tag')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Update Tag</DialogTitle>
          <DialogDescription>Modify tag name.</DialogDescription>
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
                    <Input placeholder='Tag name' {...field} />
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
