'use client'

import { ReactNode, useEffect, useState } from 'react'
import { AxiosError } from 'axios'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRegenerateInviteCode } from '../hooks/useRegenerateInviteCode'
import { ConfirmationModal } from '@/components/ConfirmationModal'

interface InviteMembersModalProps {
  children?: ReactNode
  inviteCode: string | null
  roomId: string
  isOwner: boolean
}

export function InviteMembersModal({ children, inviteCode, roomId, isOwner }: InviteMembersModalProps) {
  const [inviteUrl, setInviteUrl] = useState('')
  const [open, setOpen] = useState(false)
  const regenerateInvite = useRegenerateInviteCode()

  useEffect(() => {
    if (inviteCode && typeof window !== 'undefined') {
      setInviteUrl(`${window.location.origin}/join/${inviteCode}`)
    }
  }, [inviteCode])

  const copyInviteCode = () => {
    if (inviteUrl) {
      navigator.clipboard.writeText(inviteUrl)
      toast.success('Invite link copied to clipboard')
    } else {
      toast.error('Invite code not available')
    }
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline'>
            <Copy className='mr-2 h-4 w-4' />
            Invite Members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-md bg-surface'>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>
            Anyone with this link can join this private room.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2 pt-4 pb-2'>
          <Input 
            readOnly 
            value={inviteUrl || 'No invite code available'} 
            className='flex-1'
          />
        </div>
        <div className='flex justify-end'>
          <Button onClick={copyInviteCode}>
            <Copy className='mr-2 h-4 w-4' />
            Copy Link
          </Button>
        </div>

        {isOwner && (
          <>
            <div className='my-4 border-t border-border' />
            <div className='space-y-4'>
              <h4 className='flex items-center text-sm font-medium text-destructive'>
                <AlertTriangle className='mr-2 h-4 w-4' />
                Reset Invite Link
              </h4>
              <p className='text-sm text-muted-foreground'>
                Generate a new invite link for this room.
              </p>
              <ConfirmationModal
                title='Reset Invite Link?'
                message='The current invite link will be permanently invalidated and anyone who has it will no longer be able to join. A new link will be generated in its place.'
                confirmText='Reset Link'
                confirmVariant='destructive'
                isPending={regenerateInvite.isPending}
                onConfirm={(closeModal) => {
                  regenerateInvite.mutate(roomId, {
                    onSuccess: (data) => {
                      toast.success('Invite link reset successfully')
                      if (data?.inviteCode && typeof window !== 'undefined') {
                        setInviteUrl(`${window.location.origin}/join/${data.inviteCode}`)
                      }
                      closeModal()
                    },
                    onError: (error: AxiosError<{ message: string }>) => {
                      toast.error(error?.response?.data?.message || 'Failed to reset invite link')
                    }
                  })
                }}
              >
                <Button
                  variant='destructive'
                  className='w-full'
                >
                  <RefreshCw className='mr-2 h-4 w-4' />
                  Reset Link
                </Button>
              </ConfirmationModal>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
