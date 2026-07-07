'use client'

import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useRoomMembers } from '@/features/rooms/hooks/useRoomMembers'
import { useRoom } from '@/features/rooms/hooks/useRoom'
import { MembersTable } from './MembersTable'

export function MembersTab({ roomId }: { roomId: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [page, setPage] = useState(1)

  const limit = 10

  const { data: roomData } = useRoom(roomId)
  const isOwner = roomData?.currentUserRole === 'OWNER'

  const { data, isLoading } = useRoomMembers({
    roomId,
    search: debouncedSearch,
    page,
    limit,
  })

  const members = data?.members || []
  const pagination = data?.pagination

  return (
    <div className='space-y-6'>
      <div className='relative max-w-sm'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
        <Input
          placeholder='Search members...'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(1)
          }}
          className='pl-9 h-10'
        />
      </div>

      <MembersTable
        roomId={roomId}
        members={members}
        isLoading={isLoading}
        isOwner={!!isOwner}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className='flex items-center justify-end space-x-2'>
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
