import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await api.delete(`/rooms/${roomId}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['public-rooms'] })
    },
  })
}
