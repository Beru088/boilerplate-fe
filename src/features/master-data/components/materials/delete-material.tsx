'use client'

import { useState } from 'react'
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
import { Trash2, Loader2 } from 'lucide-react'
import { useDeleteMaterial } from '@/features/master-data/api/materials'
import type { MaterialRow } from '@/types/object'

export default function DeleteMaterial({
  material,
  onSuccess,
  open,
  onOpenChange
}: {
  material: MaterialRow
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (o: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const mutation = useDeleteMaterial()

  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  const handleDelete = async () => {
    await mutation.mutateAsync(material.id)
    setIsOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700'>
          <Trash2 className='mr-2 h-4 w-4' /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete Material</DialogTitle>
          <DialogDescription>Are you sure to delete {material.name}? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type='button' variant='outline' onClick={() => setIsOpen(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
