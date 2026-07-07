'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RoomModal } from '@/features/rooms/components/RoomModal'
import { User } from '@/features/auth/types/user'
import { Plus } from 'lucide-react'

interface NoUserRoomStateProps {
  user: User | null
}

export function NoUserRoomState({ user }: NoUserRoomStateProps) {
  return (
    <main className='flex flex-1 flex-col items-center justify-center px-6'>
      <div className='max-w-lg text-center'>
        <h2 className='section-heading text-4xl font-semibold tracking-tight'>
          Welcome back{user?.name ? `, ${user.name}` : ''} 👋
        </h2>

        <p className='mt-6 text-xl font-medium'>No rooms yet.</p>

        <p className='mt-2 text-text-muted'>
          Create one or join a community and start your next focus session.
        </p>

        <div className='mt-8 flex items-center justify-center gap-4'>
          <Button asChild variant='outline' size='lg'>
            <Link href='/rooms'>Join</Link>
          </Button>
          <RoomModal>
            <Button className='gap-2'>
              <Plus className='h-4 w-4' />
              Create a Room
            </Button>
          </RoomModal>
        </div>
      </div>
    </main>
  )
}
