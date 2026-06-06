import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

  return {
    login: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
