import { Skeleton } from '@/components/ui/skeleton'
import { BackButton } from '@/components/BackButton'

export function RoomDetailSkeleton() {
  return (
    <div className='flex flex-col min-h-full max-w-5xl mx-auto w-full gap-6 pb-6'>
      <div>
        <BackButton />
      </div>
      
      <Skeleton className='w-full h-48 sm:h-64 rounded-xl' />
      
      <div className='flex flex-col md:flex-row md:items-start justify-between gap-6'>
        <div className='flex-1 space-y-4'>
          <Skeleton className='h-8 w-1/3' />
          <Skeleton className='h-4 w-2/3' />
          <Skeleton className='h-4 w-1/2' />
          <div className='flex items-center gap-4 pt-2'>
            <Skeleton className='h-6 w-20 rounded-full' />
            <Skeleton className='h-6 w-24 rounded-full' />
          </div>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <Skeleton className='h-10 w-24 rounded-md' />
          <Skeleton className='h-10 w-24 rounded-md' />
        </div>
      </div>
      
      <div className='w-full mt-4 flex-1 flex flex-col'>
        <div className='w-full flex gap-6 border-b pb-3'>
          <Skeleton className='h-6 w-16' />
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-6 w-24' />
        </div>
        <div className='mt-6 flex-1'>
          <Skeleton className='w-full h-[400px] rounded-lg' />
        </div>
      </div>
    </div>
  )
}
