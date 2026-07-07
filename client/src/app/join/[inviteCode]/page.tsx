'use client'

import { useParams, useRouter } from 'next/navigation'
import { useRoomByInvite } from '@/features/rooms/hooks/useRoomByInvite'
import { useJoinPrivateRoom } from '@/features/rooms/hooks/useJoinPrivateRoom'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Users } from 'lucide-react'
import Image from 'next/image'

export default function JoinRoomPage() {
  const params = useParams()
  const router = useRouter()
  const inviteCode = params.inviteCode as string

  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { data: room, isLoading: isRoomLoading, error } = useRoomByInvite(inviteCode)
  const { mutate: joinRoom, isPending: isJoining } = useJoinPrivateRoom()

  if (isUserLoading || isRoomLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Room not found</h1>
        <p className="text-muted-foreground mb-6">The invite link may be invalid or expired.</p>
        <Button onClick={() => router.push('/')}>Go to Home</Button>
      </div>
    )
  }

  const handleJoin = () => {
    if (!user) {
      router.push(`/login?callbackUrl=/join/${inviteCode}`)
      return
    }

    joinRoom(inviteCode, {
      onSuccess: (data) => {
        router.push(`/rooms/${data.roomId || room.id}`)
      }
    })
  }

  const roomWithStatus = room as typeof room & { membershipStatus?: string }
  const isMember = room.currentUserRole === 'OWNER' || room.currentUserRole === 'MEMBER' || roomWithStatus.membershipStatus === 'MEMBER' || roomWithStatus.membershipStatus === 'OWNER'

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md overflow-hidden border-border/50 shadow-xl dark:shadow-2xl dark:shadow-black/50">
        {/* Room Cover */}
        <div className="h-48 w-full bg-muted relative">
          {room.imageUrl ? (
            <Image
              src={room.imageUrl}
              alt={room.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <span className="text-4xl font-bold text-foreground/20">
                {room.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
              <Lock className="h-3.5 w-3.5" />
              Private Room
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">{room.name}</h1>
            {room.description && (
              <p className="text-sm text-muted-foreground">{room.description}</p>
            )}
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <Users className="h-4 w-4" />
              <span>{room.memberCount} {room.memberCount === 1 ? 'Member' : 'Members'}</span>
            </div>
          </div>

          <div className="h-px w-full bg-border" />

          <div className="flex flex-col gap-4 text-center">
            {isMember ? (
              <div className="space-y-4">
                <p className="text-sm font-medium">You are already a member of this room.</p>
                <Button 
                  className="w-full h-11 text-base font-medium" 
                  onClick={() => router.push(`/rooms/${room.id}`)}
                >
                  Go to Room
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium">Join this room?</p>
                <Button 
                  className="w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0" 
                  onClick={handleJoin}
                  disabled={isJoining || isUserLoading}
                >
                  {isJoining ? 'Joining...' : 'Join Room'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
