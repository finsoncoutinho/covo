'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
  type ResetPasswordInput,
} from '../schemas/resetPasswordSchema'
import { useResetPassword } from '../hooks/useResetPassword'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

export default function ResetPasswordForm({
  className,
  token,
  ...props
}: React.ComponentProps<'div'> & { token: string }) {
  const router = useRouter()
  const {
    resetPassword,
    isPending,
    error: resetPasswordError,
  } = useResetPassword()
  const errorMessage = getErrorMessage(resetPasswordError)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password') || ''

  const onSubmit = async (data: ResetPasswordFormInput) => {
    try {
      const payload: ResetPasswordInput = {
        password: data.password,
        token: token,
      }
      await resetPassword(payload)
      router.push('/login?reset=success')
    } catch (err) {
      // Error is handled by the hook/mutation
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border border-border shadow-sm'>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {errorMessage && (
                <div className='text-sm font-medium text-destructive text-center'>
                  {errorMessage}
                </div>
              )}

              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                </div>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                />
                <PasswordStrengthIndicator password={password} />
              </Field>
              <Field>
                <div className='flex items-center'>
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                </div>
                <Input
                  id='confirmPassword'
                  type='password'
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <FieldError>{errors.confirmPassword.message}</FieldError>
                )}
              </Field>
              <Field>
                <Button type='submit' disabled={isPending} className='w-full'>
                  {isPending ? 'Resetting password...' : 'Reset Password'}
                </Button>
                <FieldDescription className='text-center'>
                  <Link href='/login'>Back to Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
