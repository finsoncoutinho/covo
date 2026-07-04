'use client'

import { ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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

interface CreateRoomModalProps {
  children?: ReactNode
}

export function CreateRoomModal({ children }: CreateRoomModalProps) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'PUBLIC',
    },
  })

  const { mutate: createRoom, isPending } = useCreateRoom()

  const onSubmit = (data: CreateRoomFormInput) => {
    createRoom(
      {
        name: data.name,
        description: data.description,
        visibility: data.visibility,
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      }
    )
  }

  // Handle dialog open state change
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      form.reset() // Reset form when modal closes
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button>Create Room</Button>}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] bg-surface'>
        <DialogHeader>
          <DialogTitle>Create Room</DialogTitle>
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
                {isPending ? 'Creating...' : 'Create Room'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
