import LoginForm from '@/features/auth/components/LoginForm'
import { Suspense } from 'react'

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ reset?: string }> }) => {
  const { reset } = await searchParams
  const resetSuccess = reset === 'success'

  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
          <LoginForm resetSuccess={resetSuccess} />
        </Suspense>
      </div>
    </div>
  )
}

export default LoginPage
