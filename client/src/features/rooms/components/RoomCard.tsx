'use client'

import { useState } from 'react'


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Globe,
  Users,
  MoreVertical,
  Image as ImageIcon,
  Lock,
  Edit,
  LogOut,
  Loader2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Room } from '../hooks/useMyRooms'
import { RoomModal } from './RoomModal'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useJoinPublicRoom } from '../hooks/useJoinPublicRoom'
import { useLeaveRoom } from '../hooks/useLeaveRoom'

interface RoomCardProps {
  room: Room
  showJoinButton?: boolean
  isMember?: boolean
}

export function RoomCard({ room, showJoinButton = false, isMember = false }: RoomCardProps) {
  const router = useRouter()
  const { mutate: joinRoom, isPending } = useJoinPublicRoom()
  const { mutate: leaveRoom, isPending: isLeaving } = useLeaveRoom()
  const [menuOpen, setMenuOpen] = useState(false)

  const isOwner = room?.currentUserRole === 'OWNER'
  const isUserMember = isMember || !!room?.currentUserRole

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation()
    joinRoom(room.id, {
      onSuccess: () => {
        toast.success(`Joined ${room.name || 'room'} successfully`)
        router.push(`/rooms/${room.id}`)
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to join room')
      },
    })
  }

  return (
    <Card
      className='w-full max-w-sm cursor-pointer hover:border-primary/50 transition-colors'
      onClick={() => router.push(`/rooms/${room.id}`)}
    >
      <div className='relative w-full h-32 bg-muted/30 flex items-center justify-center border-b border-border-default'>
        {room?.imageUrl ? (
          <Image
            src={room.imageUrl}
            alt={room.name || 'Room image'}
            fill
            className='object-cover'
          />
        ) : (
          <ImageIcon className='h-10 w-10 text-muted-foreground/30' />
        )}
        {isUserMember && (
          <div className='absolute top-2 right-2' onClick={(e) => e.stopPropagation()}>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon-sm'
                  className='rounded-full bg-background/50 hover:bg-background/80 backdrop-blur-sm text-foreground'
                >
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {isOwner ? (
                  <RoomModal roomToEdit={room} onSuccess={() => setMenuOpen(false)}>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                      }}
                    >
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                  </RoomModal>
                ) : (
                  <ConfirmationModal
                    title='Leave Room'
                    message={`Are you sure you want to leave ${room.name || 'this room'}?`}
                    confirmText='Leave'
                    confirmVariant='destructive'
                    isPending={isLeaving}
                    onConfirm={() => {
                      return new Promise<void>((resolve, reject) => {
                        leaveRoom(room.id, {
                          onSuccess: () => {
                            toast.success(`Left ${room.name || 'room'}`)
                            setMenuOpen(false)
                            resolve()
                          },
                          onError: (error) => {
                            toast.error(error.message || 'Failed to leave room')
                            reject(error)
                          },
                        })
                      })
                    }}
                  >
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault()
                      }}
                      disabled={isLeaving}
                      className='text-destructive focus:text-destructive'
                    >
                      {isLeaving ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <LogOut className='mr-2 h-4 w-4' />
                      )}
                      {isLeaving ? 'Leaving...' : 'Leave'}
                    </DropdownMenuItem>
                  </ConfirmationModal>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <CardHeader>
        <CardTitle>{room?.name || 'Deep Work Society'}</CardTitle>
        <CardDescription className='line-clamp-2'>
          {room?.description ||
            'Small group focused on building and deep work sessions without distractions.'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='flex items-center gap-4 text-sm text-muted-foreground font-medium'>
          <div className='flex items-center gap-1.5'>
            {room?.visibility === 'PRIVATE' ? (
              <Lock className='h-4 w-4' />
            ) : (
              <Globe className='h-4 w-4' />
            )}
            <span className='capitalize'>
              {room?.visibility?.toLowerCase() || 'Public'}
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <Users className='h-4 w-4' />
            <span>{room?.memberCount || 0} Members</span>
          </div>
        </div>
      </CardContent>

      {showJoinButton && (
        <CardFooter>
          {isMember ? (
            <Button
              className='w-full'
              variant='secondary'
              onClick={(e) => {
                e.stopPropagation()
                router.push(`/rooms/${room.id}`)
              }}
            >
              View Room
            </Button>
          ) : (
            <Button 
              className='w-full' 
              onClick={handleJoin}
              disabled={isPending}
            >
              {isPending ? 'Joining...' : 'Join'}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
