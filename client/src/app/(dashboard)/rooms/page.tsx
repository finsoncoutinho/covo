'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RoomModal } from '@/features/rooms/components/RoomModal'
import { MyRoomsTab } from '@/features/rooms/components/MyRoomsTab'
import { ExploreTab } from '@/features/rooms/components/ExploreTab'

const Page = () => {
  return (
    <div className=''>
      <Tabs defaultValue='my-rooms' className='w-full'>
        <div className='flex items-center justify-between mb-6'>
          <TabsList variant='line' className=''>
            <TabsTrigger value='my-rooms'>My Rooms</TabsTrigger>
            <TabsTrigger value='explore'>Explore</TabsTrigger>
          </TabsList>
          <div className='flex gap-2'>
            <RoomModal />
          </div>
        </div>

        <TabsContent value='my-rooms'>
          <MyRoomsTab />
        </TabsContent>

        <TabsContent value='explore'>
          <ExploreTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Page
