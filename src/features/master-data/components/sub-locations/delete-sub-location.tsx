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
import { useDeleteSubLocation } from '@/features/master-data/api/location-mutation'
import { toast } from 'sonner'
import type { ISubLocation } from '@/types/location'

interface DeleteSubLocationProps {
  subLocation: ISubLocation
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function DeleteSubLocation({ subLocation, open, onOpenChange, onSuccess }: DeleteSubLocationProps) {
  const mutation = useDeleteSubLocation()

  const handleDelete = async () => {
    try {
      await mutation.mutateAsync(subLocation.id)
      toast.success('Sub-location deleted')
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error('Failed to delete sub-location')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Sub Location</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{subLocation.name}"? This action cannot be undone.
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
