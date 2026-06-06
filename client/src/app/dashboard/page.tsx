'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useLogout } from '@/features/auth/hooks/useLogout'

export default function DashboardPage() {
  const router = useRouter()

  const { logout, isPending } = useLogout()
  const { user, isLoading } = useCurrentUser()

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/login')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex flex-col'>
        <header className='flex items-center justify-between border-b px-6 py-4'>
          <Skeleton className='h-6 w-20' />
          <Skeleton className='h-9 w-24' />
        </header>

        <main className='flex flex-1 items-center justify-center px-6'>
          <div className='w-full max-w-md space-y-4'>
            <Skeleton className='h-10 w-64 mx-auto' />
            <Skeleton className='h-5 w-80 mx-auto' />
            <Skeleton className='h-10 w-40 mx-auto' />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='flex items-center justify-between border-b px-6 py-4'>
        <h1 className='text-xl font-semibold'>Covo</h1>

        <Button variant='outline' onClick={handleLogout} disabled={isPending}>
          {isPending ? 'Logging out...' : 'Logout'}
        </Button>
      </header>

      <main className='flex flex-1 items-center justify-center px-6'>
        <div className='max-w-lg text-center'>
          <h2 className='text-4xl font-semibold tracking-tight'>
            Welcome back
            {user?.name ? `, ${user.name}` : ''} 👋
          </h2>

          <p className='mt-4 text-muted-foreground'>
            Ready for a focused deep work session? Create your first room and
            start building momentum.
          </p>

          <Button
            size='lg'
            className='mt-8'
            onClick={() => {
              // TODO: Open create room modal
            }}
          >
            Create Your First Room
          </Button>
        </div>
      </main>
    </div>
  )
}
