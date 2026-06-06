import SignupForm from '@/features/auth/components/SignupForm'
import React from 'react'

const SignupPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <SignupForm />
      </div>
    </div>
  )
}

export default SignupPage
