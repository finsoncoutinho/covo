import { Skeleton } from '@/components/ui/skeleton'

export function RoomCardSkeleton({ showJoinButton = false }: { showJoinButton?: boolean }) {
  return (
    <Skeleton className={`w-full max-w-sm rounded-xl ${showJoinButton ? 'h-[340px]' : 'h-[280px]'}`} />
  )
}
