'use client'

import React, { ReactNode, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ConfirmationModalProps {
  children?: ReactNode
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmVariant?: ButtonProps['variant']
  onConfirm: (closeModal: () => void) => void | Promise<void>
  isPending?: boolean
}

export function ConfirmationModal({
  children,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'default',
  onConfirm,
  isPending = false,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async () => {
    try {
      let isAsyncOrControlled = false
      const closeModal = () => setOpen(false)
      
      const result = onConfirm(closeModal)
      
      if (result instanceof Promise) {
        isAsyncOrControlled = true
        await result
        closeModal()
      } else if (onConfirm.length > 0) {
        // Parent function expects the closeModal argument, so it will control closing
        isAsyncOrControlled = true
      }
      
      if (!isAsyncOrControlled) {
        closeModal()
      }
    } catch (error) {
      // Don't close if there's an error (parent will likely show toast)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className='mt-2'>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='mt-4 sm:justify-between'>
          <Button
            variant='outline'
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {cancelText}
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isPending} 
            variant={confirmVariant}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
