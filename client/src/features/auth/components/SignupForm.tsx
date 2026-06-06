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
import { signupSchema, type SignupInput } from '../schemas/signupSchema'
import { useSignup } from '../hooks/useSignup'
import { getErrorMessage } from '@/lib/getErrorMessage'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { signup, isPending, error: signupError } = useSignup()
  const errorMessage = getErrorMessage(signupError)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password') || ''

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data)
      router.push('/dashboard')
    } catch (err) {
      // Error is handled by the hook/mutation
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border border-border shadow-sm'>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Sign up to continue your deep work session.
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
                <FieldLabel htmlFor='password'>Password</FieldLabel>

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
                  {isPending ? 'Signing up...' : 'Sign Up'}
                </Button>
                <FieldDescription className='text-center'>
                  Already have an account? <Link href='/login'>Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
