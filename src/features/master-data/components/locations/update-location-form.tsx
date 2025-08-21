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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useUpdateLocation } from '@/features/master-data/api/location-mutation'
import { useCountries, useProvinces, useCities } from '@/features/master-data/api/location'
import { toast } from 'sonner'
import type { ILocation } from '@/types/location'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  countryId: z.number().min(1, 'Select country'),
  provinceId: z.number().min(1, 'Select province'),
  cityId: z.number().min(1, 'Select city')
})

type FormData = z.infer<typeof schema>

interface UpdateLocationFormProps {
  location: ILocation
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function UpdateLocationForm({ location, open, onOpenChange, onSuccess }: UpdateLocationFormProps) {
  const mutation = useUpdateLocation()
  const { countries, countriesLoading } = useCountries()
  const { provinces, provincesLoading } = useProvinces()
  const { cities, citiesLoading } = useCities()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', countryId: 0, provinceId: 0, cityId: 0 }
  })

  useEffect(() => {
    if (location) {
      form.reset({
        name: location.name,
        description: location.description || '',
        countryId: location.countryId,
        provinceId: location.provinceId,
        cityId: location.cityId
      })
    }
  }, [location, form])

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        id: location.id,
        payload: {
          name: data.name,
          description: data.description,
          countryId: data.countryId,
          provinceId: data.provinceId,
          cityId: data.cityId
        }
      })
      toast.success('Location updated')
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error('Failed to update location')
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Location</DialogTitle>
          <DialogDescription>Update location information.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Location name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-6'>
              <FormField
                control={form.control}
                name='countryId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Country</FormLabel>
                    <Select
                      onValueChange={v => field.onChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder={countriesLoading ? 'Loading...' : 'Select country'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country.id} value={String(country.id)}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='provinceId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Province</FormLabel>
                    <Select
                      onValueChange={v => field.onChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder={provincesLoading ? 'Loading...' : 'Select province'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {provinces.map(province => (
                          <SelectItem key={province.id} value={String(province.id)}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='cityId'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={v => field.onChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue placeholder={citiesLoading ? 'Loading...' : 'Select city'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map(city => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
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
                    <Input placeholder='Location description' {...field} />
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
