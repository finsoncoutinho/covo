import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { SignupInput } from '../schemas/signupSchema'

export const useSignup = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: SignupInput) => {
      const { confirmPassword, ...signupData } = data
      const response = await api.post('/auth/signup', signupData)
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
