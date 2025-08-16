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
import { useDeleteCategory } from '@/features/master-data/api/categories'
import type { CategoryRow } from '@/types/object'

export default function DeleteCategory({
  category,
  onSuccess,
  open,
  onOpenChange
}: {
  category: CategoryRow
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (o: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const mutation = useDeleteCategory()

  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange! : setInternalOpen

  const handleDelete = async () => {
    await mutation.mutateAsync(category.id)
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
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>Are you sure to delete {category.name}? This action cannot be undone.</DialogDescription>
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
