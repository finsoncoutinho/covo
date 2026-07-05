import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export interface PublicRoom {
  id: string
  name: string
  description: string
  visibility: string
  memberCount: number
  imageUrl?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

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
