'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { useCreateObject } from '@/features/objects/api/object-mutation'
import { useCategories } from '@/features/master-data/api/categories'
import { useMaterials } from '@/features/master-data/api/materials'
import type { IObjectCreate } from '@/types/object'
import { FileDropzone } from '@/components/shared/file-dropzone'

const schemaCreate = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  categoryId: z.number().min(1, 'Select category'),
  materialId: z.number().min(1, 'Select material'),
  coverIndex: z.number().int().min(0).optional()
})

type CreateData = z.infer<typeof schemaCreate>

export const CreateObjectForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const createMutation = useCreateObject()
  const { categories, categoriesLoading } = useCategories()
  const { materials, materialsLoading } = useMaterials()
  const [files, setFiles] = useState<File[]>([])
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

  const form = useForm<CreateData>({
    resolver: zodResolver(schemaCreate),
    defaultValues: { title: '', description: '', categoryId: 0, materialId: 0, coverIndex: undefined }
  })

  const onSubmit = async (values: CreateData) => {
    await createMutation.mutateAsync({
      ...(values as IObjectCreate),
      files,
      tags: selectedTags
    })
    form.reset()
    setFiles([])
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
          <div className='text-sm font-medium'>Media files</div>
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
          <Button
            type='submit'
            disabled={createMutation.isPending || categoriesLoading || materialsLoading || !files.length}
          >
            {createMutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
            Create
          </Button>
        </div>
      </form>
    </Form>
  )
}
