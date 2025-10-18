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
import { useDeleteUser } from '@/features/users/api/user-mutation'
import { IUser } from '@/types/users'

interface DeleteUserProps {
  user: IUser
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DeleteUser = ({ user, onSuccess, open, onOpenChange }: DeleteUserProps) => {
  const [internalOpen, setInternalOpen] = useState(false)
  const deleteUserMutation = useDeleteUser()

  // Use external control if provided, otherwise use internal state
  const isControlled = open !== undefined && onOpenChange !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  const handleDelete = async () => {
    try {
      await deleteUserMutation.mutateAsync(user.id)
      setIsOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='text-red-600 hover:text-red-700'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{user.fullname}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => setIsOpen(false)}
            disabled={deleteUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button type='button' variant='destructive' onClick={handleDelete} disabled={deleteUserMutation.isPending}>
            {deleteUserMutation.isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteUser
