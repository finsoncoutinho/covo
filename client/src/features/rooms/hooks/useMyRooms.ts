import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { Room } from '@/types'

export const useMyRooms = () => {
  const query = useQuery({
    queryKey: ['my-rooms'],

    queryFn: async () => {
      const response = await api.get('/rooms/me')

      return response.data.data
    },

    retry: false,
  })

  return {
    myRooms: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
