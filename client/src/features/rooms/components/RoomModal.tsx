'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form, FormInput, FormRadioGroup } from '@/components/forms'
import {
  createRoomSchema,
  type CreateRoomFormInput,
} from '../schemas/createRoomSchema'
import { useCreateRoom } from '../hooks/useCreateRoom'
import { useUpdateRoom } from '../hooks/useUpdateRoom'
import { type Room } from '@/types'
import { toast } from 'sonner'

interface RoomModalProps {
  children?: ReactNode
  roomToEdit?: Room
  onSuccess?: () => void
}

export function RoomModal({ children, roomToEdit, onSuccess: onSuccessCallback }: RoomModalProps) {
  const [open, setOpen] = useState(false)
  const isEdit = !!roomToEdit

  const form = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: roomToEdit?.name || '',
      description: roomToEdit?.description || '',
      visibility: roomToEdit?.visibility || 'PUBLIC',
    },
  })

  useEffect(() => {
    if (open) {
      if (roomToEdit) {
        form.reset({
          name: roomToEdit.name,
          description: roomToEdit.description || '',
          visibility: roomToEdit.visibility,
        })
      } else {
        form.reset({
          name: '',
          description: '',
          visibility: 'PUBLIC',
        })
      }
    }
  }, [open, roomToEdit, form])

  const { mutate: createRoom, isPending: isCreating } = useCreateRoom()
  const { mutate: updateRoom, isPending: isUpdating } = useUpdateRoom()
  
  const isPending = isCreating || isUpdating

  const onSubmit = (data: CreateRoomFormInput) => {
    if (isEdit && roomToEdit) {
      updateRoom(
        { roomId: roomToEdit.id, data },
        {
          onSuccess: () => {
            toast.success('Room updated successfully')
            setOpen(false)
            onSuccessCallback?.()
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to update room')
          },
        }
      )
    } else {
      createRoom(
        {
          name: data.name,
          description: data.description,
          visibility: data.visibility,
        },
        {
          onSuccess: () => {
            toast.success('Room created successfully')
            setOpen(false)
            onSuccessCallback?.()
          },
          onError: (error) => {
            toast.error(error.message || 'Failed to create room')
          },
        },
      )
    }
  }

  // Handle dialog open state change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className='w-4 h-4' />
            Create Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-surface'>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Room' : 'Create Room'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-6 py-4'
          >
            <FormInput
              name='name'
              label='Name'
              placeholder='e.g. Deep Work Session'
              required
            />

            <FormInput
              name='description'
              label='Description'
              placeholder='What will you focus on?'
            />

            <FormRadioGroup
              name='visibility'
              label='Visibility'
              className='flex flex-row space-x-6 space-y-0'
              options={[
                { label: 'Public', value: 'PUBLIC' },
                { label: 'Private', value: 'PRIVATE' },
              ]}
            />

            <div className='flex justify-end gap-3 mt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Room')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
