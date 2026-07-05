import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export interface Room {
  id: string
  name: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  currentUserRole: 'OWNER' | 'MEMBER' | null
  memberCount: number
  imageUrl?: string
}

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
