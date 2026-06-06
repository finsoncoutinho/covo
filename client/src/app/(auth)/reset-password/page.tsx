import { ErrorCard } from '@/components/ErrorCard'
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return (
      <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-md'>
          <ErrorCard
            title='Invalid Token'
            message='Your password reset token is invalid or has expired.'
            backUrl='/login'
            backLabel='Back to login'
          />
        </div>
      </div>
    )
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/auth/validate-reset-token?token=${token}`,
      {
        cache: 'no-store',
      },
    )

    if (!response.ok) {
      throw new Error()
    }
  } catch {
    return (
      <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-md'>
          <ErrorCard
            title='Invalid Token'
            message='Your password reset token is invalid or has expired.'
            backUrl='/forgot-password'
            backLabel='Request a new link'
          />
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-md'>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
