'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RotateCcw, AlertCircle, Loader2 } from 'lucide-react'
import { useRestoreUser } from '../api/user-mutation'
import { IUser } from '@/types/users'

interface RestoreUserProps {
  user: IUser
  onSuccess: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RestoreUser({ user, onSuccess, open, onOpenChange }: RestoreUserProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const restoreUserMutation = useRestoreUser()

  const handleRestore = async () => {
    try {
      setIsSubmitting(true)
      await restoreUserMutation.mutateAsync(user.id)
      onSuccess()
    } catch (error) {
      console.error('Restore user failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <RotateCcw className='h-5 w-5' />
            Restore User
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to restore <strong>{user.fullname}</strong>? This will make the user active again and
            they will be able to access the system.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            This action will restore the user account and make it active again. The user will regain access to the
            system.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleRestore} disabled={isSubmitting} className='bg-green-600 hover:bg-green-700'>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Restoring...
              </>
            ) : (
              <>
                <RotateCcw className='mr-2 h-4 w-4' />
                Restore User
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
