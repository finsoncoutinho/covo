import React from 'react'
import { RoomMember } from '@/features/rooms/hooks/useRoomMembers'
import { useKickMember } from '@/features/rooms/hooks/useKickMember'
import { Button } from '@/components/ui/button'
import { UserMinus, MoreVertical } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ConfirmationModal } from '@/components/ConfirmationModal'
import { MembersTableSkeleton } from '@/components/skeletons/MembersTableSkeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface MembersTableProps {
  roomId: string
  members: RoomMember[]
  isLoading: boolean
  isOwner: boolean
}

export function MembersTable({ roomId, members, isLoading, isOwner }: MembersTableProps) {
  const { mutate: kickMember, isPending: isKicking } = useKickMember()

  return (
    <div className='border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className='text-right'>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <MembersTableSkeleton rows={3} />
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className='h-24 text-center text-muted-foreground'
              >
                No members found.
              </TableCell>
            </TableRow>
          ) : (
            members.map((member: RoomMember) => (
              <TableRow key={member.id} className='hover:bg-muted/50'>
                <TableCell>
                  <div className='flex items-center space-x-4'>
                    <Avatar>
                      <AvatarFallback className='bg-primary/10 text-primary uppercase'>
                        {member.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col'>
                      <span className='font-medium flex items-center gap-2'>
                        {member.name}
                        {member.isCurrentUser && (
                          <span className='text-xs text-muted-foreground font-normal'>
                            (You)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {member.role === 'OWNER' ? (
                    <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground'>
                      Owner
                    </span>
                  ) : (
                    <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground'>
                      Member
                    </span>
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  {isOwner && member.role !== 'OWNER' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8'
                        >
                          <MoreVertical className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <ConfirmationModal
                          title='Kick Member'
                          message={`Are you sure you want to kick ${member.name} out?`}
                          confirmText='Kick'
                          confirmVariant='destructive'
                          isPending={isKicking}
                          onConfirm={(closeModal) => {
                            kickMember(
                              { roomId, memberId: member.id },
                              {
                                onSettled: () => closeModal(),
                              }
                            )
                          }}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className='text-destructive focus:text-destructive cursor-pointer'
                          >
                            <UserMinus className='mr-2 h-4 w-4' />
                            Remove
                          </DropdownMenuItem>
                        </ConfirmationModal>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
