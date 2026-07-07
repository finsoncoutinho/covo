import React from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface MembersTableSkeletonProps {
  rows?: number
}

export function MembersTableSkeleton({ rows = 3 }: MembersTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <Skeleton className='h-4 w-[150px]' />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className='h-5 w-16 rounded-full' />
          </TableCell>
          <TableCell className='text-right'>
            <Skeleton className='h-8 w-8 rounded-md ml-auto' />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}
