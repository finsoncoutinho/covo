import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { LoginInput } from '../schemas/loginSchema'

export const useSignup = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await api.post('/auth/signup', data)

      return response.data
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['currentUser'],
      })
    },
  })

  return {
    signup: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
