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
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '../schemas/forgotPasswordSchema'
import { useForgotPassword } from '../hooks/useForgotPassword'
import { getErrorMessage } from '@/lib/getErrorMessage'

export default function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const {
    forgotPassword,
    isPending,
    error: forgotPasswordError,
  } = useForgotPassword()
  const errorMessage = getErrorMessage(forgotPasswordError)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      await forgotPassword(data)
      router.push(
        `/check-email?type=reset-password&email=${encodeURIComponent(
          data.email,
        )}`,
      )
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
            Enter your email address associated with your account, and
            we&apos;ll send you a link to reset your password.
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
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>
              <Field>
                <Button type='submit' disabled={isPending} className='w-full'>
                  {isPending ? 'Sending link...' : 'Send Reset Link'}
                </Button>
              </Field>
              <FieldDescription className='text-center'>
                Remembered your password? <Link href='/login'>Log in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
