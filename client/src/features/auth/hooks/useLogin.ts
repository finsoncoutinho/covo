import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { LoginInput } from '../schemas/loginSchema'

export const useLogin = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('/auth/login', data)

      return response.data
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['currentUser'],
      })
    },
  })

  const errorMessage = mutation.error
    ? isAxiosError(mutation.error) && mutation.error.response?.data?.message
      ? mutation.error.response.data.message
      : mutation.error instanceof Error
        ? mutation.error.message
        : 'Failed to login. Please try again.'
    : null

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: errorMessage,
  }
}
