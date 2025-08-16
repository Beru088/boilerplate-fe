'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Video, FileText, X } from 'lucide-react'
import { useObject } from '@/features/objects/api/object'
import { useUpdateObject } from '@/features/objects/api/object-mutation'
import { useCategories } from '@/features/master-data/api/categories'
import { useMaterials } from '@/features/master-data/api/materials'
import type { IObjectUpdate } from '@/types/object'
import { FileDropzone } from '@/components/shared/file-dropzone'
import { getMediaUrl } from '@/utils/helper'

const schemaUpdate = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  categoryId: z.number().min(1, 'Select category'),
  materialId: z.number().min(1, 'Select material'),
  coverIndex: z.number().int().min(0).optional()
})

type UpdateData = z.infer<typeof schemaUpdate>

export const UpdateObjectForm = ({ id, onSuccess }: { id: number; onSuccess?: () => void }) => {
  const { object } = useObject(id)
  const updateMutation = useUpdateObject()
  const { categories, categoriesLoading } = useCategories()
  const { materials, materialsLoading } = useMaterials()

  const [files, setFiles] = useState<File[]>([])
  const [coverIndexNew, setCoverIndexNew] = useState<number | undefined>(undefined)
  const [deleteMediaIds, setDeleteMediaIds] = useState<number[]>([])
  const [positionsById, setPositionsById] = useState<Record<number, number>>({})
  const [coverExistingId, setCoverExistingId] = useState<number | undefined>(undefined)
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const normalized = (name: string) => `#${name.trim().toUpperCase()}`

  const addOne = (raw: string) => {
    const tag = normalized(raw.replace(/^#/, ''))
    if (tag === '#' || !tag.replace('#', '')) return
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
    defaultValues: { title: '', description: '', categoryId: 0, materialId: 0, coverIndex: undefined }
  })

  useEffect(() => {
    if (object) {
      form.reset({
        title: object.title,
        description: object.description ?? '',
        categoryId: object.category?.id,
        materialId: object.material?.id
      } as any)

      const nextPositions: Record<number, number> = {}
      object.media?.forEach(m => {
        nextPositions[m.id] = m.position
      })
      setPositionsById(nextPositions)
      setCoverExistingId(object.media?.find(m => m.isCover)?.id)
      setDeleteMediaIds([])

      const existingTags = object.objectTags?.map(ot => normalized(ot.tag.name)) || []
      setSelectedTags(existingTags)
      setInputText('')
    }
  }, [object])

  const onSubmit = async (values: UpdateData) => {
    const mediaUpdates = (object?.media || [])
      .filter(m => !deleteMediaIds.includes(m.id))
      .map(m => {
        const nextPos = positionsById[m.id]
        const changedPos = typeof nextPos === 'number' && nextPos !== m.position
        const willBeCover = coverExistingId === m.id
        const update: any = { id: m.id }
        if (changedPos) update.position = nextPos
        if (willBeCover) update.isCover = true
        return update
      })
      .filter(u => 'position' in u || 'isCover' in u)

    await updateMutation.mutateAsync({
      id,
      payload: {
        ...(values as IObjectUpdate),
        deleteMediaIds,
        mediaUpdates,
        coverIndexNew,
        files,
        tags: selectedTags
      } as any
    })
    setFiles([])
    setCoverIndexNew(undefined)
    setDeleteMediaIds([])
    setSelectedTags([])
    setInputText('')
    onSuccess?.()
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
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Object title' {...field} />
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
                  defaultValue={field.value ? String(field.value) : undefined}
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
        </div>
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Object description' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex gap-6'>
          <FormField
            control={form.control}
            name='materialId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Material</FormLabel>
                <Select
                  onValueChange={v => field.onChange(parseInt(v))}
                  defaultValue={field.value ? String(field.value) : undefined}
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
            name='coverIndex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover Index</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    placeholder='0'
                    value={(field.value as any) ?? ''}
                    onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Existing media</div>
          <div className='w-full min-w-0 overflow-x-auto overflow-y-hidden'>
            <div className='flex w-max gap-3 pr-2 pb-1'>
              {(object?.media || []).map(m => {
                const isImage = (m.mime || '').startsWith('image/') || /(png|jpg|jpeg|gif|webp)$/i.test(m.url || '')
                const isVideo = (m.mime || '').startsWith('video/') || /(mp4|webm|mov|mkv)$/i.test(m.url || '')
                const filename = (m.url || '').split('/').pop() || ''
                const markedDeleted = deleteMediaIds.includes(m.id)
                return (
                  <div
                    key={`ex-${m.id}`}
                    className={`relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border ${markedDeleted ? 'opacity-60' : ''}`}
                  >
                    {isImage ? (
                      <img src={getMediaUrl(m.url)} alt={filename} className='h-full w-full object-cover' />
                    ) : isVideo ? (
                      <div className='bg-muted flex h-full w-full items-center justify-center'>
                        <Video className='h-8 w-8' />
                      </div>
                    ) : (
                      <div className='bg-muted flex h-full w-full items-center justify-center'>
                        <FileText className='h-8 w-8' />
                      </div>
                    )}
                    <div className='absolute right-0 bottom-0 left-0 truncate bg-black/50 px-2 py-1 text-[10px] text-white'>
                      {filename}
                    </div>
                    <div className='absolute top-1 left-1 flex items-center gap-2'>
                      <input
                        type='radio'
                        name='existing-cover'
                        checked={coverExistingId === m.id}
                        onChange={() => setCoverExistingId(m.id)}
                        title='Make cover'
                      />
                    </div>
                    <div className='absolute bottom-1 left-1 flex items-center gap-1 rounded bg-black/40 p-1 text-[10px] text-white'>
                      <span>Pos</span>
                      <input
                        className='h-5 w-10 rounded bg-white/80 px-1 text-[10px] text-black outline-none'
                        type='number'
                        value={typeof positionsById[m.id] === 'number' ? positionsById[m.id] : m.position}
                        onChange={e => setPositionsById(prev => ({ ...prev, [m.id]: parseInt(e.target.value || '0') }))}
                      />
                    </div>
                    <button
                      type='button'
                      className='text-muted-foreground hover:text-foreground absolute top-1 right-1 rounded bg-white/80 p-1 hover:bg-white'
                      onClick={() =>
                        setDeleteMediaIds(prev =>
                          prev.includes(m.id) ? prev.filter(id => id !== m.id) : [...prev, m.id]
                        )
                      }
                      aria-label='Delete media'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <div className='text-sm font-medium'>Add new media files</div>
          <FileDropzone files={files} onChange={setFiles} multiple />
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
                {tag.replace(/^#/, '')}
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
