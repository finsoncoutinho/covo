import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { PublicRoom, Pagination } from '@/types'

export interface PublicRoomsResponse {
  rooms: PublicRoom[]
  pagination: Pagination
}

interface UsePublicRoomsParams {
  search?: string
  page?: number
  limit?: number
}

export const usePublicRooms = ({ search = '', page = 1, limit = 10 }: UsePublicRoomsParams = {}) => {
  const query = useQuery({
    queryKey: ['public-rooms', { search, page, limit }],
    queryFn: async (): Promise<PublicRoomsResponse> => {
      const response = await api.get('/rooms', {
        params: {
          search: search || undefined,
          page,
          limit,
        },
      })
      
      return response.data.data
    },
    retry: false,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
