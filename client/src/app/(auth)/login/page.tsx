import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ reset?: string }> }) => {
  const { reset } = await searchParams
  const resetSuccess = reset === 'success'

  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm resetSuccess={resetSuccess} />
      </div>
    </div>
  )
}

export default LoginPage
