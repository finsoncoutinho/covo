'use client'

import React from 'react'
import { useMyRooms, type Room } from '@/features/rooms/hooks/useMyRooms'
import { RoomCard } from '@/features/rooms/components/RoomCard'
import { RoomCardSkeleton } from '@/features/rooms/components/RoomCardSkeleton'

export function MyRoomsTab() {
  const { myRooms, isLoading } = useMyRooms()

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {[...Array(6)].map((_, i) => (
          <RoomCardSkeleton key={i} />
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
