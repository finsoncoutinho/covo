'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useMyRooms } from '@/features/rooms/hooks/useMyRooms'
import { NoUserRoomState } from '../components/NoUserRoomState'

export default function DashboardPage() {
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { myRooms, isLoading: isRoomsLoading } = useMyRooms()

  if (isUserLoading || isRoomsLoading) {
    return (
      <div className='h-full flex flex-col'>
        <main className='flex flex-1 items-center justify-center px-6'>
          <div className='w-full max-w-md space-y-4'>
            <Skeleton className='h-10 w-64 mx-auto' />
            <Skeleton className='h-5 w-80 mx-auto' />
            <Skeleton className='h-10 w-40 mx-auto' />
          </div>
        </main>
      </div>
    )
  }

  const hasNoRooms = !myRooms || myRooms.length <= 0

  return (
    <div className='h-full flex flex-col'>
      {hasNoRooms ? (
        <NoUserRoomState user={user ?? null} />
      ) : (
        <main className='flex flex-1 items-center justify-center px-6'>
          <div className='text-center'>
            <h2 className='section-heading text-2xl font-semibold'>Your Rooms</h2>
            {/* List of rooms will go here */}
          </div>
        </main>
      )}
    </div>
  )
}
