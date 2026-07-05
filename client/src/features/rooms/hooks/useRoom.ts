import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Room } from './useMyRooms'

export const useRoom = (roomId: string) => {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: async () => {
      const response = await api.get(`/rooms/${roomId}`)
      return response.data.data as Room
    },
    enabled: !!roomId,
    retry: false,
  })
}
