import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Room } from '@/types'

export const useRoomByInvite = (inviteCode: string) => {
  return useQuery({
    queryKey: ['room', 'invite', inviteCode],
    queryFn: async () => {
      const response = await api.get(`/rooms/invite/${inviteCode}`)
      return response.data.data as Room & { membershipStatus?: string }
    },
    enabled: !!inviteCode,
    retry: false,
  })
}
