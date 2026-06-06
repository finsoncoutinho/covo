import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type CheckEmailPageProps = {
  searchParams: Promise<{
    email?: string
    type?: string
  }>
}

export default async function CheckEmailPage({
  searchParams,
}: CheckEmailPageProps) {
  const { email, type } = await searchParams

  const config = {
    'reset-password': {
      title: 'Check your email',
      description:
        'We have sent you a password reset link. Please check your inbox and follow the instructions to reset your password.',
    },

    'verify-email': {
      title: 'Verify your email',
      description:
        'We have sent you a verification link. Please check your inbox and verify your email address.',
    },
  }

  const content =
    config[type as keyof typeof config] ?? config['reset-password']

  return (
    <div className='flex min-h-screen items-center justify-center p-6'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          {email && (
            <p className='text-sm text-muted-foreground'>
              Email sent to{' '}
              <span className='font-medium text-foreground'>{email}</span>
            </p>
          )}

          <p className='text-sm text-muted-foreground'>
            If you don&apos;t see the email, check your spam folder.
          </p>

          <Button asChild className='w-full'>
            <Link href='/login'>Back to login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
