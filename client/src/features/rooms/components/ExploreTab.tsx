'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RoomCard } from '@/features/rooms/components/RoomCard'
import { CardSkeleton } from '@/components/skeletons/CardSkeleton'
import { useMyRooms } from '@/features/rooms/hooks/useMyRooms'
import type { Room, PublicRoom } from '@/types'
import { Input } from '@/components/ui/input'
import { usePublicRooms } from '@/features/rooms/hooks/usePublicRooms'
import { useDebounce } from '@/hooks/useDebounce'

export function ExploreTab() {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [page, setPage] = useState(1)
  const limit = 12 // Good for grid of 2, 3, or 4 columns

  const { data, isLoading, error } = usePublicRooms({ 
    search: debouncedSearch, 
    page, 
    limit 
  })
  const publicRooms = data?.rooms || []
  const pagination = data?.pagination

  const { myRooms } = useMyRooms()
  const myRoomIds = useMemo(() => new Set(myRooms?.map((r: Room) => r.id) || []), [myRooms])


  if (error) {
    return (
      <div className='flex items-center justify-center p-8 text-destructive'>
        Failed to load public rooms. Please try again.
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='relative max-w-md'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search rooms...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1)
          }}
          className='pl-9 h-10'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} showJoinButton />
          ))
        ) : publicRooms.length === 0 ? (
          <div className='col-span-full flex items-center justify-center h-40 border rounded-lg border-dashed'>
            <p className='text-muted-foreground'>No public rooms found.</p>
          </div>
        ) : (
          publicRooms.map((room: PublicRoom) => (
            <RoomCard 
              key={room.id} 
              room={room} 
              showJoinButton 
              isMember={myRoomIds.has(room.id)} 
            />
          ))
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-end space-x-2 pt-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className='h-4 w-4 mr-1' />
            Previous
          </Button>
          <div className='text-sm text-muted-foreground px-2'>
            Page {page} of {pagination.totalPages}
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4 ml-1' />
          </Button>
        </div>
      )}
    </div>
  )
}
