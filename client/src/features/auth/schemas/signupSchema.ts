import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const signupSchema = z
  .object({
    email: z.email('Please enter a valid email').trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupInput = z.infer<typeof signupSchema>
