'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { useObject } from '@/features/objects/api/object'
import { useUpdateObject } from '@/features/objects/api/object-mutation'
import { useCategories } from '@/features/master-data/api/categories'
import { useMaterials } from '@/features/master-data/api/materials'
import { useLocations, useSubLocations } from '@/features/master-data/api/location'
import type { IObjectUpdate } from '@/types/objects'
import { ShowMedia } from '@/features/objects/components/show-media'
import RichTextEditor from '@/components/shared/rich-text-editor'
import { DatePicker } from '@/components/shared/date-picker'

import { useRouter } from 'next/navigation'

const schemaUpdate = z.object({
  code: z.string().min(3, 'Code is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  dateTaken: z.date().optional(),
  categoryId: z.number().min(1, 'Select category'),
  materialId: z.number().min(1, 'Select material'),
  locationId: z.number().optional(),
  subLocationId: z.number().optional(),
  locationDetails: z.string().optional(),
  coverIndex: z.number().int().min(0).optional()
})

type UpdateData = z.infer<typeof schemaUpdate>

export const UpdateObjectForm = ({ id }: { id: number }) => {
  const router = useRouter()
  const { object } = useObject(id)
  const updateMutation = useUpdateObject()
  const { categories, categoriesLoading } = useCategories()
  const { materials, materialsLoading } = useMaterials()
  const { locations, locationsLoading } = useLocations()

  const [files, setFiles] = useState<File[]>([])
  const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([])
  const [positionArray, setPositionArray] = useState<Array<{ id: number | null; position: number; isCover: boolean }>>(
    []
  )
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const normalized = (name: string) => name.trim().toUpperCase()

  const addOne = (raw: string) => {
    const tag = normalized(raw.replace(/^#/, ''))
    if (tag === '' || !tag) return
    setSelectedTags(prev => (prev.includes(tag) ? prev : [...prev, tag]))
    setInputText('')
  }

  const onChangeTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputText(v)
    if (/\s$/.test(v) && v.trim().startsWith('#') && !v.trim().includes(' ')) {
      addOne(v.trim())
    }
  }

  const form = useForm<UpdateData>({
    resolver: zodResolver(schemaUpdate),
    defaultValues: {
      code: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      categoryId: 0,
      materialId: 0,
      locationId: 0,
      subLocationId: 0,
      locationDetails: '',
      coverIndex: 0
    }
  })

  const { subLocations: allSubLocations, subLocationsLoading } = useSubLocations()
  const { subLocations, subLocationsLoading: filteredSubLocationsLoading } = useSubLocations(form.watch('locationId'))

  const currentLocationId = form.watch('locationId')
  const displaySubLocations = currentLocationId && currentLocationId > 0 ? subLocations : allSubLocations
  const displaySubLocationsLoading =
    currentLocationId && currentLocationId > 0 ? filteredSubLocationsLoading : subLocationsLoading

  useEffect(() => {
    if (object) {
      const locationData = object.objectLocations?.[0]
      const locationId = locationData?.location?.id
      const subLocationId = locationData?.subLocation?.id
      const locationDetails = locationData?.details

      form.reset({
        code: object.code,
        title: object.title,
        titleEn: object.titleEn,
        description: object.description ?? '',
        descriptionEn: object.descriptionEn ?? '',
        dateTaken: object.dateTaken ? new Date(object.dateTaken) : undefined,
        categoryId: object.category?.id || 0,
        materialId: object.material?.id || 0,
        locationId: locationId || 0,
        subLocationId: subLocationId || 0,
        locationDetails: locationDetails || ''
      })

      // Initialize position array from existing media
      const initialPositionArray =
        object.media?.map(m => ({
          id: m.id,
          position: m.position,
          isCover: m.isCover
        })) || []
      setPositionArray(initialPositionArray)
      setDeleteMediaIds([])

      const existingTags = object.objectTags?.map(ot => ot.tag.name.toUpperCase()) || []
      setSelectedTags(existingTags)
      setInputText('')
    }
  }, [object, form])

  const onSubmit = async (values: UpdateData) => {
    console.log('Form submission started with values:', values)
    console.log('Current state:', { deleteMediaIds, files: files.length, selectedTags })
    console.log('Current positionArray:', positionArray)

    // Create media updates from position array
    const mediaUpdates = positionArray
      .filter(pos => pos.id !== null && !deleteMediaIds.includes(pos.id))
      .map(pos => {
        const originalMedia = object?.media?.find(m => m.id === pos.id)
        if (!originalMedia) return null

        const hasPositionChange = pos.position !== originalMedia.position
        const hasCoverChange = pos.isCover !== originalMedia.isCover

        if (hasPositionChange || hasCoverChange) {
          return {
            id: pos.id,
            position: pos.position,
            isCover: pos.isCover
          }
        }
        return null
      })
      .filter(Boolean)

    console.log('Media updates to send:', mediaUpdates)

    // Determine the final cover index for new files from positionArray
    let finalCoverIndex = undefined
    if (files.length > 0) {
      const existingMediaCount = (object?.media || []).filter(m => !deleteMediaIds.includes(m.id)).length

      // Find if any new file is set as cover in the positionArray
      for (let i = 0; i < files.length; i++) {
        const globalIndex = existingMediaCount + i
        const isCover = positionArray.some(pos => pos.position === globalIndex && pos.isCover)
        if (isCover) {
          finalCoverIndex = i
          console.log('Found new file as cover at index:', finalCoverIndex)
          break
        }
      }
    }

    const payload = {
      ...(values as IObjectUpdate),
      deleteMediaIds,
      mediaUpdates,
      coverIndex: finalCoverIndex,
      files,
      tags: selectedTags
    } as any

    console.log('Final payload:', payload)

    await updateMutation.mutateAsync({
      id,
      payload
    })
    setFiles([])
    setDeleteMediaIds([])
    setSelectedTags([])
    setInputText('')
    router.push('/object-archive')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='min-w-0 space-y-4'>
        <div className='flex gap-6'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Title - Indonesia</FormLabel>
                <FormControl>
                  <Input placeholder='Object title' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='titleEn'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Title - English</FormLabel>
                <FormControl>
                  <Input placeholder='Object title in English' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex gap-6'>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder='Object code' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='categoryId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={v => field.onChange(parseInt(v))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={categoriesLoading ? 'Loading...' : 'Select category'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
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
            name='materialId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <Select
                  onValueChange={v => field.onChange(parseInt(v))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={materialsLoading ? 'Loading...' : 'Select material'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {materials.map(m => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
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
            name='dateTaken'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Taken</FormLabel>
                <FormControl>
                  <DatePicker value={field.value} onChange={field.onChange} placeholder='Select date taken' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex gap-6'>
          <FormField
            control={form.control}
            name='locationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select
                  onValueChange={v => {
                    const locationId = parseInt(v)
                    field.onChange(locationId)
                    form.setValue('subLocationId', undefined)
                  }}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={locationsLoading ? 'Loading...' : 'Select location'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map(l => (
                      <SelectItem key={l.id} value={String(l.id)}>
                        {l.name}
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
            name='subLocationId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sub Location</FormLabel>
                <Select
                  onValueChange={v => {
                    const subLocationId = parseInt(v)
                    field.onChange(subLocationId)

                    if (!form.watch('locationId') || form.watch('locationId') === 0) {
                      const selectedSubLocation = allSubLocations.find(sl => sl.id === subLocationId)
                      if (selectedSubLocation?.locationId) {
                        form.setValue('locationId', selectedSubLocation.locationId)
                      }
                    }
                  }}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={displaySubLocationsLoading ? 'Loading...' : 'Select sub location'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {displaySubLocations.length > 0 ? (
                      displaySubLocations.map(sl => (
                        <SelectItem key={sl.id} value={String(sl.id)}>
                          {sl.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className='text-muted-foreground px-2 py-1.5 text-sm'>No sub-locations available</div>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='locationDetails'
            render={({ field }) => (
              <FormItem className='flex-1'>
                <FormLabel>Location Details</FormLabel>
                <FormControl>
                  <Input placeholder='Additional location details' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Tags</div>
          <div className='flex items-center gap-2'>
            <Input
              placeholder="Type # to search tags, press 'space' to add"
              value={inputText}
              onChange={onChangeTagInput}
            />
          </div>
          <div className='flex flex-wrap gap-2'>
            {selectedTags.map(tag => (
              <span key={tag} className='inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs'>
                {tag}
                <button
                  type='button'
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                  aria-label='Remove tag'
                >
                  <X className='h-3 w-3' />
                </button>
              </span>
            ))}
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Media files</div>
          <ShowMedia
            key={JSON.stringify(positionArray)} // Force re-render when position array changes
            files={files}
            existingMedia={
              object?.media
                ?.filter(m => !deleteMediaIds.includes(m.id))
                .map(m => {
                  const positionData = positionArray.find(p => p.id === m.id) || {
                    position: m.position,
                    isCover: m.isCover
                  }
                  return {
                    id: m.id,
                    url: m.url,
                    mime: m.mime,
                    position: positionData.position,
                    isCover: positionData.isCover
                  }
                }) || []
            }
            onChange={setFiles}
            onPositionChange={newPositionArray => {
              console.log('Position array updated:', newPositionArray)
              setPositionArray(newPositionArray)
            }}
            onDeleteMedia={mediaIds => {
              setDeleteMediaIds(prev => [...prev, ...mediaIds])
            }}
            multiple
            mode='edit'
          />
        </div>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='flex-1'>
              <FormLabel>Description - Indonesia</FormLabel>
              <FormControl>
                <RichTextEditor key={`description-${object?.id}`} value={field.value} onChange={field.onChange} />
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
                <RichTextEditor key={`descriptionEn-${object?.id}`} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={updateMutation.isPending || categoriesLoading || materialsLoading}>
            {updateMutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
            Update
          </Button>
        </div>
      </form>
    </Form>
  )
}
