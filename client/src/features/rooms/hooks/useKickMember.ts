import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface KickMemberVariables {
  roomId: string
  memberId: string
}

export const useKickMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ roomId, memberId }: KickMemberVariables) => {
      const response = await api.delete(`/rooms/${roomId}/members/${memberId}`)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['room-members', variables.roomId] })
      queryClient.invalidateQueries({ queryKey: ['room', variables.roomId] })
      toast.success('Member kicked successfully')
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error?.response?.data?.message || 'Failed to kick member')
    },
  })
}
