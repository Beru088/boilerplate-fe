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
import { useUpdateMaterial } from '@/features/master-data/api/materials'
import type { IMaterial } from '@/types/materials'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  nameEn: z.string().optional()
})
type FormData = z.infer<typeof schema>

export default function UpdateMaterialForm({
  material,
  open,
  onOpenChange
}: {
  material: IMaterial
  open: boolean
  onOpenChange: (o: boolean) => void
  onSuccess?: () => void
}) {
  const mutation = useUpdateMaterial()
  const form = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { name: '', nameEn: '' } })

  useEffect(() => {
    if (material) form.reset({ name: material.name, nameEn: material.nameEn || '' })
  }, [material])

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({ id: material.id, payload: data })
      toast.success('Material updated')
      onOpenChange(false)
    } catch {
      toast.error('Failed to update material')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Material</DialogTitle>
          <DialogDescription>Modify material name.</DialogDescription>
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
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
