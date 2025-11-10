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
import { useDeleteMenu } from '@/features/menus/api/menus-mutations'
import { IMenu } from '@/types'

interface DeleteMenuProps {
  menu: IMenu
  onSuccess: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteMenu({ menu, onSuccess, open, onOpenChange }: DeleteMenuProps) {
  const deleteMenu = useDeleteMenu()

  const handleDelete = async () => {
    try {
      await deleteMenu.mutateAsync(menu.id)
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
          <DialogTitle>Delete Menu</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the menu "{menu.name}"? This action cannot be undone.
            {menu.children && menu.children.length > 0 && (
              <span className='mt-2 block text-red-600'>
                Warning: This menu has {menu.children.length} child menu(s). Deleting it will also delete all child
                menus.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant='destructive' onClick={handleDelete} disabled={deleteMenu.isPending}>
            {deleteMenu.isPending ? 'Deleting...' : 'Delete Menu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
