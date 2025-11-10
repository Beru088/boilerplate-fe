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
import { useDeleteGroup } from '@/features/groups/api/groups-mutations'
import { IGroup } from '@/types/groups'

interface DeleteGroupProps {
  group: IGroup
  onSuccess: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteGroup({ group, onSuccess, open, onOpenChange }: DeleteGroupProps) {
  const deleteGroup = useDeleteGroup()

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(group.id)
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the group "{group.name}"? This action cannot be undone.
            {group.users.length > 0 && (
              <span className='mt-2 block text-red-600'>
                Warning: This group has {group.users.length} user(s) assigned. You may need to reassign them first.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={deleteGroup.isPending}>
            {deleteGroup.isPending ? 'Deleting...' : 'Delete Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
