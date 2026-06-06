import { AlertCircle } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ErrorCardProps {
  title?: string
  message?: string
  backUrl?: string
  backLabel?: string
}

export function ErrorCard({
  title = 'Something went wrong!',
  message = 'An error occurred while processing your request.',
  backUrl = '/',
  backLabel = 'Go back home',
}: ErrorCardProps) {
  return (
    <Card className='w-full border-destructive/50 shadow-sm'>
      <CardHeader className='text-center'>
        <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
          <AlertCircle className='h-6 w-6 text-destructive' />
        </div>
        <CardTitle className='text-xl text-destructive'>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant='outline' className='w-full'>
          <Link href={backUrl}>{backLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
