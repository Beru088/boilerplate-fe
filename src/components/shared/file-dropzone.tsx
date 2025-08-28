'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useDropzone, type Accept } from 'react-dropzone'
import { UploadCloud, X, Video, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type FileDropzoneProps = {
  files: File[]
  onChange: (files: File[]) => void
  multiple?: boolean
  maxFiles?: number
  accept?: Accept
  className?: string
  disabled?: boolean
  showText?: boolean
}

export const FileDropzone = ({
  files,
  onChange,
  multiple = true,
  maxFiles,
  accept,
  className,
  disabled = false,
  showText = true
}: FileDropzoneProps) => {
  const uniqueBySig = (list: File[]) => {
    const seen = new Set<string>()

    return list.filter(f => {
      const sig = `${f.name}-${f.size}-${(f as any).lastModified}`
      if (seen.has(sig)) return false
      seen.add(sig)

      return true
    })
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) return
      const next = multiple ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1)
      const unique = uniqueBySig(next)
      onChange(unique.slice(0, maxFiles ?? unique.length))
    },
    [files, onChange, multiple, maxFiles, disabled]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple,
    maxFiles,
    accept,
    noClick: false,
    noKeyboard: false,
    disabled
  })

  const previews = useMemo(() => {
    return files.map(f => {
      const mime = f.type || ''
      const isImage = mime.startsWith('image/')
      const isVideo = mime.startsWith('video/')
      const isDocument = !isImage && !isVideo
      const isPortrait = isImage && /portrait|vertical|tall/i.test(f.name)

      return {
        key: `${f.name}-${f.size}-${(f as any).lastModified}`,
        file: f,
        isImage,
        isVideo,
        isDocument,
        isPortrait,
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

  const handleDeleteFile = (fileToDelete: File) => {
    onChange(files.filter(f => f !== fileToDelete))
  }

  return (
    <div className={cn('w-full', className)}>
      {files.length === 0 ? (
        showText ? (
          <div
            {...getRootProps()}
            className={cn(
              'relative w-full rounded-xl border border-dashed',
              'bg-muted/30 p-4 text-sm transition-colors',
              isDragActive ? 'bg-muted' : '',
              disabled && 'opacity-60'
            )}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center gap-3 py-6 text-center'>
              <UploadCloud className='h-8 w-8 opacity-80' />
              <div className='text-base font-medium'>Drop files here or browse</div>
              <div className='text-muted-foreground text-xs'>
                Images, videos, or documents. {maxFiles ? `Up to ${maxFiles} files.` : null}
              </div>
              <Button
                type='button'
                variant='secondary'
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  open()
                }}
                disabled={disabled}
              >
                Browse Files
              </Button>
            </div>
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={cn(
              'flex aspect-[16/9] w-full items-center justify-center rounded-lg border border-dashed',
              'text-muted-foreground hover:bg-muted/40 transition-colors',
              isDragActive ? 'bg-muted' : '',
              disabled && 'cursor-not-allowed opacity-60'
            )}
          >
            <input {...getInputProps()} />
            <Plus className='h-6 w-6' />
          </div>
        )
      ) : (
        <div className='w-full min-w-0 overflow-x-auto overflow-y-hidden'>
          <div className='flex w-max gap-3 pr-2 pb-1'>
            {previews.map(p => (
              <div
                key={p.key}
                className={cn('relative shrink-0 rounded-lg border', p.isPortrait ? 'h-36 w-28' : 'h-28 w-44')}
              >
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
                    handleDeleteFile(p.file)
                  }}
                  aria-label='Remove file'
                  disabled={disabled}
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
                if (!disabled) open()
              }}
              disabled={disabled}
              className={cn(
                'text-muted-foreground hover:bg-muted flex h-28 w-44 shrink-0 items-center justify-center rounded-lg border-2 border-dashed',
                disabled && 'cursor-not-allowed opacity-60'
              )}
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
