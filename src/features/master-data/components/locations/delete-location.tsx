'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { useDeleteLocation } from '@/features/master-data/api/location-mutation'
import { toast } from 'sonner'
import type { ILocation } from '@/types/location'

interface DeleteLocationProps {
  location: ILocation
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function DeleteLocation({ location, open, onOpenChange, onSuccess }: DeleteLocationProps) {
  const mutation = useDeleteLocation()

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(location.id)
      toast.success('Location deleted')
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error('Failed to delete location')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Location</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{location.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
