'use client'

import React from 'react'
import { useMyRooms, type Room } from '@/features/rooms/hooks/useMyRooms'

const Page = () => {
  const { myRooms, isLoading } = useMyRooms()

  if (isLoading) {
    return <div>Loading rooms...</div>
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>My Rooms</h1>
      {myRooms?.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <ul className='space-y-2'>
          {myRooms?.map((room: Room) => (
            <li key={room.id} className='p-4 rounded-lg border border-border-default'>
              {room.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Page
