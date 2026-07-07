'use client'

import React from 'react'
import { useMyRooms } from '@/features/rooms/hooks/useMyRooms'
import type { Room } from '@/types'
import { RoomCard } from '@/features/rooms/components/RoomCard'
import { CardSkeleton } from '@/components/skeletons/CardSkeleton'

export function MyRoomsTab() {
  const { myRooms, isLoading } = useMyRooms()

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!myRooms || myRooms.length === 0) {
    return <p className='text-muted-foreground'>No rooms found.</p>
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {myRooms.map((room: Room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}
