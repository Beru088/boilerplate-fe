'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, Video, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type FileDropzoneProps = {
  files: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  accept?: any
  className?: string
}

export const FileDropzone = ({ files, onChange, multiple = true, maxFiles, accept, className }: FileDropzoneProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const next = multiple ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1)
      const seen = new Set<string>()
      const unique = next.filter(f => {
        const key = `${f.name}-${f.size}-${(f as any).lastModified}`
        if (seen.has(key)) return false
        seen.add(key)

        return true
      })
      onChange(unique)
    },
    [files, onChange, multiple]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept,
    noClick: files.length > 0,
    noKeyboard: true
  })

  const previews = useMemo(() => {
    return files.map(f => {
      const mime = f.type || ''
      const isImage = mime.startsWith('image/')
      const isVideo = mime.startsWith('video/')
      const isDocument = !isImage && !isVideo

      return {
        key: `${f.name}-${f.size}-${(f as any).lastModified}`,
        file: f,
        isImage,
        isVideo,
        isDocument,
        url: isImage ? URL.createObjectURL(f) : ''
      }
    })
  }, [files])

  useEffect(() => {
    return () => {
      previews.forEach(p => {
        if (p.url) URL.revokeObjectURL(p.url)
      })
    }
  }, [previews])

  return (
    <div
      {...getRootProps()}
      className={`w-full min-w-0 cursor-pointer rounded-lg p-2 text-sm transition-colors ${isDragActive ? 'bg-muted' : 'bg-muted/30'} ${className || ''}`}
    >
      <input {...getInputProps()} />
      {files.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-3 py-4 text-center'>
          <UploadCloud className='h-8 w-8' />
          <div className='text-base font-medium'>Choose a file or drag & drop it here</div>
          <div className='text-muted-foreground text-xs'>Onlt accept photos, videos and documents</div>
          <Button
            type='button'
            variant='secondary'
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              open()
            }}
          >
            Browse Files
          </Button>
        </div>
      ) : (
        <div className='w-full min-w-0 overflow-x-auto overflow-y-hidden'>
          <div className='flex w-max gap-3 pr-2 pb-1'>
            {previews.map((p, idx) => (
              <div key={p.key} className='relative h-28 w-44 shrink-0 rounded-lg border'>
                {p.isImage ? (
                  <img src={p.url} alt={p.file.name} className='h-full w-full object-cover' />
                ) : p.isVideo ? (
                  <div className='bg-muted flex h-full w-full items-center justify-center'>
                    <Video className='h-8 w-8' />
                  </div>
                ) : (
                  <div className='bg-muted flex h-full w-full items-center justify-center'>
                    <FileText className='h-8 w-8' />
                  </div>
                )}
                <div className='absolute right-0 bottom-0 left-0 truncate bg-black/50 px-2 py-1 text-[10px] text-white'>
                  {p.file.name}
                </div>
                <button
                  type='button'
                  className='text-muted-foreground hover:text-foreground absolute top-1 right-1 rounded bg-white/80 p-1 hover:bg-white'
                  onClick={e => {
                    e.stopPropagation()
                    onChange(files.filter((_, i) => i !== idx))
                  }}
                  aria-label='Remove file'
                >
                  <X className='h-4 w-4' />
                </button>
              </div>
            ))}
            <button
              type='button'
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                open()
              }}
              className='text-muted-foreground hover:bg-muted flex h-28 w-44 shrink-0 items-center justify-center rounded-lg border-2 border-dashed'
              aria-label='Add more files'
            >
              <Plus className='h-6 w-6' />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
