import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

export const useJoinPrivateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const response = await api.post(`/rooms/join/${inviteCode}`)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['room'] })
      toast.success('Joined room successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message = error?.response?.data?.message || 'Failed to join room'
      toast.error(message)
    },
  })
}
