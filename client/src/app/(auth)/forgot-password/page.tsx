import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm'

const ForgotPasswordPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPasswordPage
