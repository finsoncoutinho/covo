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
import { loginSchema, type LoginInput } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'
import { getErrorMessage } from '@/lib/getErrorMessage'

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter()
  const { login, isPending, error: loginError } = useLogin()
  const errorMessage = getErrorMessage(loginError)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data)
      router.push('/dashboard')
    } catch (err) {
      // Error is handled by the hook/mutation
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className='border border-border shadow-sm'>
        <CardHeader>
          <CardTitle>Welcome back to Covo</CardTitle>
          <CardDescription>
            Sign in to continue your deep work session.
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
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                />
                {errors.password && (
                  <FieldError>{errors.password.message}</FieldError>
                )}
              </Field>
              <Field>
                <Button type='submit' disabled={isPending} className='w-full'>
                  {isPending ? 'Signing in...' : 'Sign In'}
                </Button>
                <FieldDescription className='text-center'>
                  Don&apos;t have an account?{' '}
                  <Link href='/signup'>Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
