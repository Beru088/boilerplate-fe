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
import { useCreateLocation } from '@/features/master-data/api/location-mutation'
import { useCountries, useProvinces, useCities } from '@/features/master-data/api/location'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  countryId: z.number().min(1, 'Select country'),
  provinceId: z.number().min(1, 'Select province'),
  cityId: z.number().min(1, 'Select city')
})

type FormData = z.infer<typeof schema>

export default function CreateLocationForm() {
  const [open, setOpen] = useState(false)
  const mutation = useCreateLocation()

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', countryId: 0, provinceId: 0, cityId: 0 }
  })

  const countryId = form.watch('countryId')
  const provinceId = form.watch('provinceId')

  const { countries, countriesLoading } = useCountries()
  const { provinces, provincesLoading } = useProvinces(countryId)
  const { cities, citiesLoading } = useCities(provinceId)

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        description: data.description,
        countryId: data.countryId,
        provinceId: data.provinceId,
        cityId: data.cityId
      })
      toast.success('Location created')
      form.reset()
      setOpen(false)
    } catch {
      toast.error('Failed to create location')
    }
  }

  const handleCountryChange = (countryId: number) => {
    form.setValue('countryId', countryId)
    form.setValue('provinceId', 0)
    form.setValue('cityId', 0)
  }

  const handleProvinceChange = (provinceId: number) => {
    form.setValue('provinceId', provinceId)
    form.setValue('cityId', 0)
  }

  const handleCityChange = (cityId: number) => {
    const selectedCity = cities.find(city => city.id === cityId)
    if (selectedCity) {
      const province = provinces.find(p => p.id === selectedCity.provinceId)
      if (province) {
        form.setValue('provinceId', province.id)
        const country = countries.find(c => c.id === province.countryId)
        if (country) {
          form.setValue('countryId', country.id)
        }
      }
    }
    form.setValue('cityId', cityId)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) form.reset()
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> New Location
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Location</DialogTitle>
          <DialogDescription>Add a new location to the system.</DialogDescription>
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
                      onValueChange={v => handleCountryChange(parseInt(v))}
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
                      onValueChange={v => handleProvinceChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={!countryId || countryId === 0}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !countryId || countryId === 0
                                ? 'Select country first'
                                : provincesLoading
                                  ? 'Loading...'
                                  : 'Select province'
                            }
                          />
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
                      onValueChange={v => handleCityChange(parseInt(v))}
                      value={field.value ? String(field.value) : undefined}
                      disabled={!provinceId || provinceId === 0}
                    >
                      <FormControl className='w-full'>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              !provinceId || provinceId === 0
                                ? 'Select province first'
                                : citiesLoading
                                  ? 'Loading...'
                                  : 'Select city'
                            }
                          />
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
