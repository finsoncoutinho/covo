import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import type { ResetPasswordInput } from '../schemas/resetPasswordSchema'

export const useResetPassword = () => {
  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await api.post('/auth/reset-password', data)

      return response.data
    },
  })

  return {
    resetPassword: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
