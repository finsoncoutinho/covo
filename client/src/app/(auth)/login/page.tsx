import LoginForm from '@/features/auth/components/LoginForm'

const LoginPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
