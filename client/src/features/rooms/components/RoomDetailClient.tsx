'use client'

import { useRoom } from '../hooks/useRoom'
import { BackButton } from '@/components/BackButton'
import Image from 'next/image'
import {
  Globe,
  Lock,
  Users,
  Crown,
  Copy,
  Edit,
  LogOut,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useLeaveRoom } from '../hooks/useLeaveRoom'
import { useDeleteRoom } from '../hooks/useDeleteRoom'
import { useJoinPublicRoom } from '../hooks/useJoinPublicRoom'
import { useRouter } from 'next/navigation'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { RoomModal } from './RoomModal'
import { ChatTab } from './ChatTab'
import { MembersTab } from './MembersTab'
import { AnalyticsTab } from './AnalyticsTab'
import { InviteMembersModal } from './InviteMembersModal'

import { RoomDetailSkeleton } from './skeletons/RoomDetailSkeleton'

export function RoomDetailClient({ roomId }: { roomId: string }) {
  const { data: room, isLoading, error } = useRoom(roomId)
  const router = useRouter()
  const { mutate: leaveRoom, isPending: isLeaving } = useLeaveRoom()
  const { mutate: deleteRoom, isPending: isDeleting } = useDeleteRoom()
  const { mutate: joinPublicRoom, isPending: isJoining } = useJoinPublicRoom()

  if (isLoading) {
    return <RoomDetailSkeleton />
  }

  if (error || !room) {
    return (
      <div className='flex flex-col h-full items-center justify-center'>
        <p className='text-destructive'>Failed to load room details.</p>
        <Button variant='link' onClick={() => router.push('/rooms')}>
          Return to Rooms
        </Button>
      </div>
    )
  }

  const isOwner = room.currentUserRole === 'OWNER'
  const isMember = room.currentUserRole === 'MEMBER'
  const isPrivate = room.visibility === 'PRIVATE'

  const handleLeave = (closeModal: () => void) => {
    leaveRoom(room.id, {
      onSuccess: () => {
        toast.success(`Left ${room.name}`)
        closeModal()
        router.push('/rooms')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to leave room')
      },
    })
  }

  const handleDelete = (closeModal: () => void) => {
    deleteRoom(room.id, {
      onSuccess: () => {
        toast.success(`Deleted ${room.name}`)
        closeModal()
        router.push('/rooms')
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to delete room')
      },
    })
  }

  const handleJoin = () => {
    joinPublicRoom(room.id, {
      onSuccess: () => {
        toast.success(`Joined ${room.name}`)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to join room')
      },
    })
  }

  return (
    <div className='flex flex-col min-h-full max-w-5xl mx-auto w-full gap-6 pb-6'>
      <div>
        <BackButton />
      </div>

      {/* Cover Image */}
      <div className='relative w-full h-48 sm:h-64 shrink-0 rounded-xl overflow-hidden bg-muted/30 border border-border-default'>
        {room.imageUrl ? (
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className='object-cover'
          />
        ) : (
          <Image
            src='/dummy-room-cover.jpg'
            alt='Dummy cover image'
            fill
            className='object-cover opacity-50'
          />
        )}
      </div>

      {/* Header section */}
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
        <div className='space-y-3'>
          <h1 className='text-3xl font-bold text-foreground'>{room.name}</h1>
          {room.description && (
            <p className='text-muted-foreground max-w-2xl'>
              {room.description}
            </p>
          )}

          <div className='flex items-center gap-4 pt-2 text-sm text-muted-foreground font-medium'>
            <div className='flex items-center gap-1.5'>
              {isPrivate ? (
                <Lock className='h-4 w-4' />
              ) : (
                <Globe className='h-4 w-4' />
              )}
              <span className='capitalize'>
                {room.visibility.toLowerCase()}
              </span>
            </div>
            <div className='flex items-center gap-1.5'>
              <Users className='h-4 w-4' />
              <span>{room.memberCount} Members</span>
            </div>
            {isOwner && (
              <div className='flex items-center gap-1.5 text-primary'>
                <Crown className='h-4 w-4' />
                <span>Owner</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-wrap items-center gap-2'>
          {isPrivate && (isOwner || isMember) && (
            <InviteMembersModal
              inviteCode={room.inviteCode ?? null}
              roomId={room.id}
              isOwner={isOwner}
            >
              <Button variant='outline'>
                <Copy className='mr-2 h-4 w-4' />
                Invite
              </Button>
            </InviteMembersModal>
          )}

          {isOwner && (
            <>
              <RoomModal roomToEdit={room}>
                <Button variant='outline'>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit
                </Button>
              </RoomModal>

              <ConfirmationModal
                title='Delete Room'
                message={`Are you sure you want to delete ${room.name}? This action cannot be undone.`}
                confirmText='Delete'
                confirmVariant='destructive'
                isPending={isDeleting}
                onConfirm={handleDelete}
              >
                <Button variant='destructive'>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </ConfirmationModal>
            </>
          )}

          {isMember && !isOwner && (
            <ConfirmationModal
              title='Leave Room'
              message={`Are you sure you want to leave ${room.name}?`}
              confirmText='Leave'
              confirmVariant='destructive'
              isPending={isLeaving}
              onConfirm={handleLeave}
            >
              <Button variant='destructive'>
                <LogOut className='mr-2 h-4 w-4' />
                Leave
              </Button>
            </ConfirmationModal>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue='chat' className='w-full mt-4 flex-1 flex flex-col'>
        <TabsList className='w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6'>
          <TabsTrigger
            value='chat'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none'
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value='members'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none'
          >
            Members
          </TabsTrigger>
          <TabsTrigger
            value='analytics'
            className='rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3 data-[state=active]:shadow-none'
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <div className='relative flex-1 flex flex-col min-h-[400px] mt-6'>
          {!isMember && !isOwner && (
            <div className='absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm rounded-xl'>
              <div className='flex flex-col items-center p-6 text-center max-w-sm'>
                <div className='h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4'>
                  <Lock className='h-8 w-8 text-muted-foreground' />
                </div>
                <h3 className='text-xl font-semibold text-foreground mb-2'>
                  Private Content
                </h3>
                <p className='text-sm text-muted-foreground mb-6'>
                  You need to be a member of this room to view its content and
                  participate in discussions.
                </p>
                {!isPrivate && (
                  <Button
                    onClick={handleJoin}
                    disabled={isJoining}
                    className='w-full'
                  >
                    {isJoining ? 'Joining...' : 'Join Room'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {(isMember || isOwner) && (
            <>
              <TabsContent value='chat' className='flex-1 mt-0'>
                <ChatTab roomId={room.id} />
              </TabsContent>
              <TabsContent value='members' className='flex-1 mt-0'>
                <MembersTab roomId={room.id} />
              </TabsContent>
              <TabsContent value='analytics' className='flex-1 mt-0'>
                <AnalyticsTab roomId={room.id} />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  )
}
