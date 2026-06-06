import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogout = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/auth/logout')

      return response.data
    },

    onSuccess: () => {
      queryClient.clear()
    },
  })

  return {
    logout: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  }
}
