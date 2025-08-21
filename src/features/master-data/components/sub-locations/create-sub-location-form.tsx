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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Loader2 } from 'lucide-react'
import { useCreateSubLocation } from '@/features/master-data/api/location-mutation'
import { useLocations } from '@/features/master-data/api/location'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  locationId: z.number().min(1, 'Select location')
})

type FormData = z.infer<typeof schema>

export default function CreateSubLocationForm() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateSubLocation()
  const { locations, locationsLoading } = useLocations()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', locationId: 0 }
  })

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        description: data.description,
        locationId: data.locationId
      })
      toast.success('Sub-location created')
      form.reset()
      setOpen(false)
    } catch {
      toast.error('Failed to create sub-location')
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
          <Plus className='mr-2 h-4 w-4' /> New Sub Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Sub Location</DialogTitle>
          <DialogDescription>Add a new sub-location to the system.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
            <div className='flex gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Sub-location name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='locationId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Parent Location</FormLabel>
                    <Select
                      onValueChange={v => field.onChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder={locationsLoading ? 'Loading...' : 'Select location'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location.id} value={String(location.id)}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Input placeholder='Sub-location description' {...field} />
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
