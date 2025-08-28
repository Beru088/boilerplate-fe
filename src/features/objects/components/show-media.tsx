'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Video, FileText, Star } from 'lucide-react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { getMediaUrl } from '@/utils/helper'
import { FileDropzone } from '@/components/shared/file-dropzone'

export type MediaItem = {
  id?: number
  file?: File
  url?: string
  mime?: string
  position?: number
  isCover?: boolean
  isNew?: boolean
}

export type ShowMediaProps = {
  files: File[]
  existingMedia?: Array<{
    id: number
    url: string
    mime?: string
    position: number
    isCover: boolean
  }>
  onChange: (files: File[]) => void
  onPositionChange?: (positionArray: Array<{ id: number | null; position: number; isCover: boolean }>) => void
  onDeleteMedia?: (mediaIds: number[]) => void
  multiple?: boolean
  maxFiles?: number
  accept?: any
  className?: string
  disabled?: boolean
  mode?: 'create' | 'edit'
}

export const ShowMedia = ({
  files,
  existingMedia = [],
  onChange,
  onPositionChange,
  onDeleteMedia,
  multiple = true,
  maxFiles,
  accept,
  className,
  disabled = false,
  mode = 'edit'
}: ShowMediaProps) => {
  const [draggedItem, setDraggedItem] = useState<MediaItem | null>(null)
  const [dragOverItem, setDragOverItem] = useState<MediaItem | null>(null)
  const [positionArray, setPositionArray] = useState<Array<{ id: number | null; position: number; isCover: boolean }>>(
    []
  )

  useEffect(() => {
    if (mode === 'edit' && existingMedia.length > 0) {
      const newPositionArray = existingMedia.map(m => ({
        id: m.id,
        position: m.position,
        isCover: m.isCover
      }))
      setPositionArray(newPositionArray)
    } else if (mode === 'create') {
      const newFilePositions = files.map((_, index) => ({
        id: null,
        position: index,
        isCover: false
      }))
      setPositionArray(newFilePositions)
    }
  }, [existingMedia, files, mode])

  const mediaItems = useMemo(() => {
    if (mode === 'create') {
      return files.map((file, index) => {
        const mime = file.type || ''
        const isImage = mime.startsWith('image/')
        const url = isImage ? URL.createObjectURL(file) : ''
        const positionData = positionArray.find(pos => pos.position === index) || { position: index, isCover: false }

        return {
          file,
          url,
          mime,
          position: positionData.position,
          isCover: positionData.isCover,
          isNew: true
        }
      })
    }

    const newItems: MediaItem[] = files.map((file, index) => {
      const mime = file.type || ''
      const isImage = mime.startsWith('image/')
      const url = isImage ? URL.createObjectURL(file) : ''

      const globalIndex = existingMedia.length + index
      const positionData = positionArray.find(pos => pos.position === globalIndex) || {
        position: globalIndex,
        isCover: false
      }

      return {
        file,
        url,
        mime,
        position: positionData.position,
        isCover: positionData.isCover,
        isNew: true
      }
    })

    const existingItems: MediaItem[] = existingMedia.map(m => {
      const positionData = positionArray.find(p => p.id === m.id) || { position: m.position, isCover: m.isCover }
      return {
        id: m.id,
        url: m.url,
        mime: m.mime,
        position: positionData.position,
        isCover: positionData.isCover,
        isNew: false
      }
    })

    const combinedItems = [...existingItems, ...newItems]
    return combinedItems.sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  }, [files, existingMedia, positionArray, mode])

  useEffect(() => {
    return () => {
      mediaItems.forEach(item => {
        if (item.url && item.isNew) URL.revokeObjectURL(item.url)
      })
    }
  }, [mediaItems])

  const makeKey = (item: MediaItem, idx: number) =>
    item.id != null
      ? `id-${item.id}`
      : `file-${item.file?.name}-${(item.file as any)?.lastModified}-${item.file?.size}-${idx}`
  const handleDragStart = (e: React.DragEvent, item: MediaItem) => {
    e.stopPropagation()
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(item.id ?? item.file?.name ?? ''))
  }

  const handleDragOver = (e: React.DragEvent, item?: MediaItem) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    if (item) setDragOverItem(item)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const commitOrderAndNotify = (newItems: MediaItem[]) => {
    newItems.forEach((item, index) => (item.position = index))

    if (mode === 'create') {
      const newPositionArray: Array<{ id: number | null; position: number; isCover: boolean }> = []

      newItems.forEach((item, index) => {
        if (item.file) {
          newPositionArray.push({
            id: null,
            position: index,
            isCover: item.isCover || false
          })
        }
      })

      setPositionArray(newPositionArray)
    } else {
      const existingMediaPositions = newItems
        .filter(item => !item.isNew && item.id != null)
        .map(item => ({
          id: item.id!,
          position: item.position!,
          isCover: item.isCover || false
        }))

      const newFilePositions = newItems
        .filter(item => item.isNew)
        .map(item => ({
          id: null,
          position: item.position!,
          isCover: item.isCover || false
        }))

      const newPositionArray = [...existingMediaPositions, ...newFilePositions]
      setPositionArray(newPositionArray)

      if (onPositionChange) {
        onPositionChange(newPositionArray)
      }
    }
  }

  const handleDrop = (e: React.DragEvent, targetItem: MediaItem) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedItem || draggedItem === targetItem) return

    const from = mediaItems.findIndex(x => x === draggedItem)
    const to = mediaItems.findIndex(x => x === targetItem)
    if (from === -1 || to === -1) return

    const next = [...mediaItems]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed)
    commitOrderAndNotify(next)
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleCoverToggle = (item: MediaItem) => {
    const next = mediaItems.map(m => ({ ...m, isCover: m === item ? !m.isCover : false }))

    if (mode === 'create') {
      const newPositionArray: Array<{ id: number | null; position: number; isCover: boolean }> = []

      next.forEach((currentItem, index) => {
        if (currentItem.file) {
          newPositionArray.push({
            id: null,
            position: index,
            isCover: currentItem.isCover || false
          })
        }
      })

      setPositionArray(newPositionArray)

      if (onPositionChange) {
        onPositionChange(newPositionArray)
      }
    } else {
      commitOrderAndNotify(next)
    }
  }

  const handleDeleteItem = (item: MediaItem) => {
    if (disabled) return
    if (item.isNew && item.file) {
      const newFiles = files.filter(f => f !== item.file)
      onChange(newFiles)
      if (mode === 'create') {
        const newFilePositions = newFiles.map((_, index) => ({
          id: null,
          position: index,
          isCover: positionArray.find(p => p.position === item.position)?.isCover && index === 0 ? true : false
        }))
        setPositionArray(newFilePositions)
      }
    } else if (item.id && onDeleteMedia) {
      onDeleteMedia([item.id])
    }
  }

  const isImageLike = (mime?: string, url?: string) =>
    (mime ?? '').startsWith('image/') || /(png|jpe?g|gif|webp|avif|svg)$/i.test(url ?? '')

  const isVideoLike = (mime?: string, url?: string) =>
    (mime ?? '').startsWith('video/') || /(mp4|webm|mov|mkv)$/i.test(url ?? '')

  const isPortraitImage = (item: MediaItem) => {
    if (!isImageLike(item.mime, item.url)) return false
    const filename = item.file?.name || item.url || ''
    return /portrait|vertical|tall/i.test(filename)
  }

  const MediaTile = (item: MediaItem, idx: number) => {
    const filename = item.file?.name || (item.url ?? '').split('/').pop() || ''
    const isImage = isImageLike(item.mime, item.url)
    const isVideo = isVideoLike(item.mime, item.url)
    const isPortrait = isPortraitImage(item)

    return (
      <div key={makeKey(item, idx)} className='hover:bg-muted/20 transition-colors'>
        <div
          draggable={!disabled && mode === 'edit'}
          onDragStart={mode === 'edit' ? e => handleDragStart(e, item) : undefined}
          onDragOver={mode === 'edit' ? e => handleDragOver(e, item) : undefined}
          onDragEnd={mode === 'edit' ? handleDragEnd : undefined}
          onDrop={mode === 'edit' ? e => handleDrop(e, item) : undefined}
          tabIndex={0}
          onKeyDown={e => {
            if (disabled) return
            const k = e.key?.toLowerCase()
            if (k === 'delete') handleDeleteItem(item)
            if (k === 'c') handleCoverToggle(item)
          }}
          aria-label={filename || 'media item'}
          className={cn(
            'group bg-background relative overflow-hidden rounded-lg border select-none',
            'ring-border focus-visible:ring-ring ring-1 transition-all focus-visible:ring-2 focus-visible:outline-none',
            'shrink-0',
            mode === 'edit' ? 'cursor-grab' : 'cursor-default',
            isPortrait ? 'aspect-[3/4] w-48' : 'aspect-[16/9] w-48',
            draggedItem === item && 'opacity-50',
            dragOverItem === item && 'ring-primary ring-2',
            disabled && 'pointer-events-none opacity-60'
          )}
          style={{ touchAction: mode === 'edit' ? 'none' : 'auto' }}
        >
          {isImage ? (
            <img
              src={item.isNew ? item.url : getMediaUrl(item.url || '')}
              alt={filename}
              className={cn('h-full w-full object-cover transition-transform', draggedItem === item && 'scale-105')}
              draggable={false}
            />
          ) : isVideo ? (
            <div className={cn('flex h-full w-full items-center justify-center', draggedItem === item && 'scale-105')}>
              <Video className='h-8 w-8 opacity-70' />
            </div>
          ) : (
            <div className={cn('flex h-full w-full items-center justify-center', draggedItem === item && 'scale-105')}>
              <FileText className='h-8 w-8 opacity-70' />
            </div>
          )}

          <div className='absolute top-1 left-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white'>
            {(item.position ?? idx) + 1}
          </div>

          <div className='absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-black/0 px-2 pt-6 pb-1 text-[10px] text-white'>
            {filename}
          </div>
          <div className='pointer-events-none absolute inset-x-0 top-0 flex justify-between p-1'>
            <div className='pointer-events-auto'>
              <button
                type='button'
                onClick={e => {
                  e.stopPropagation()
                  handleCoverToggle(item)
                }}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] whitespace-nowrap',
                  'text-foreground shadow-sm backdrop-blur transition-colors',
                  item.isCover ? 'bg-yellow-500 text-white' : 'bg-gray-600 hover:bg-gray-500'
                )}
                title={item.isCover ? 'Remove cover' : 'Make cover'}
                aria-pressed={item.isCover}
              >
                <Star className='h-3.5 w-3.5' fill={item.isCover ? 'currentColor' : 'none'} />
                {item.isCover ? 'Cover' : 'Set cover'}
              </button>
            </div>

            <div className='pointer-events-auto flex items-center gap-1'>
              <button
                type='button'
                className='text-muted-foreground hover:text-foreground rounded bg-black/60 p-1 shadow-sm backdrop-blur transition-colors hover:bg-black/80'
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteItem(item)
                }}
                aria-label='Delete media'
                title='Delete'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full min-w-0', className)}>
      {mediaItems.length === 0 ? (
        <FileDropzone
          files={files}
          onChange={onChange}
          multiple={multiple}
          maxFiles={maxFiles}
          accept={accept}
          disabled={disabled}
        />
      ) : (
        <div className='w-full min-w-0'>
          <ScrollArea>
            <div className='flex items-start gap-3 pb-3' style={{ width: 'max-content', minWidth: '100%' }}>
              {mediaItems.map(MediaTile)}
              <div className='flex aspect-[16/9] w-48 shrink-0 items-center justify-center'>
                <FileDropzone
                  files={[]}
                  onChange={newFiles => {
                    const currentFiles = files
                    const updatedFiles = multiple ? [...currentFiles, ...newFiles] : newFiles
                    onChange(updatedFiles)
                  }}
                  multiple={multiple}
                  maxFiles={maxFiles}
                  accept={accept}
                  disabled={disabled}
                  className='h-full w-full'
                  showText={false}
                />
              </div>
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
