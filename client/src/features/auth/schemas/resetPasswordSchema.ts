// resetPasswordSchema.ts

import { z } from 'zod'
import { passwordSchema } from './passwordSchema'

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
})

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormSchema>

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
