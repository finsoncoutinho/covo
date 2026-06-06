import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import type { ForgotPasswordInput } from '../schemas/forgotPasswordSchema'

export const useForgotPassword = () => {
  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await api.post('/auth/forgot-password', data)
      return response.data
    },
  })

  return {
    forgotPassword: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
