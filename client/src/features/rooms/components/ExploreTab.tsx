'use client'

import React, { useState, useMemo } from 'react'
import { usePublicRooms, type PublicRoom } from '@/features/rooms/hooks/usePublicRooms'
import { RoomCard } from '@/features/rooms/components/RoomCard'
import { RoomCardSkeleton } from '@/features/rooms/components/RoomCardSkeleton'
import { useMyRooms, type Room } from '@/features/rooms/hooks/useMyRooms'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export function ExploreTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  const { data, isLoading } = usePublicRooms({ search: debouncedSearch })
  const publicRooms = data?.rooms

  const { myRooms } = useMyRooms()
  const myRoomIds = useMemo(() => new Set(myRooms?.map((r: Room) => r.id) || []), [myRooms])

  return (
    <div className='space-y-6'>
      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search rooms...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-9 h-10'
        />
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <RoomCardSkeleton key={i} showJoinButton />
          ))}
        </div>
      ) : !publicRooms || publicRooms.length === 0 ? (
        <div className='flex items-center justify-center h-40 border rounded-lg border-dashed'>
          <p className='text-muted-foreground'>No public rooms found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {publicRooms.map((room: PublicRoom) => (
            <RoomCard 
              key={room.id} 
              room={room as unknown as Room} 
              showJoinButton 
              isMember={myRoomIds.has(room.id)} 
            />
          ))}
        </div>
      )}
    </div>
  )
}
