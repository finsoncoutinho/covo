import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLeaveRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await api.delete(`/rooms/${roomId}/leave`)
      return response.data.data
    },
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['public-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
    },
  })
}
