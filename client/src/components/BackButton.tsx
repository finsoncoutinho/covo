'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => router.back()}
      className='hover:bg-transparent text-muted-foreground hover:text-foreground'
    >
      <ArrowLeft className='w-4 h-4 mr-1' /> Back
    </Button>
  )
}
