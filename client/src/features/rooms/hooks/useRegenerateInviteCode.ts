import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

export const useRegenerateInviteCode = () => {
  const queryClient = useQueryClient()

  return useMutation<{ inviteCode: string }, AxiosError<{ message: string }>, string>({
    mutationFn: async (roomId: string) => {
      const response = await api.patch(`/rooms/${roomId}/invite-code`)
      return response.data.data as { inviteCode: string }
    },
    onSuccess: (_, roomId) => {
      // Invalidate the room query to fetch the new invite code
      queryClient.invalidateQueries({ queryKey: ['room', roomId] })
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
    },
  })
}
