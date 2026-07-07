import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import type { Pagination } from '@/types'

export interface RoomMember {
  id: string
  name: string
  role: 'OWNER' | 'MEMBER'
  isCurrentUser: boolean
}

export interface RoomMembersResponse {
  members: RoomMember[]
  pagination: Pagination
}

interface UseRoomMembersParams {
  roomId: string
  search?: string
  page?: number
  limit?: number
}

export const useRoomMembers = ({ roomId, search = '', page = 1, limit = 10 }: UseRoomMembersParams) => {
  const query = useQuery({
    queryKey: ['room-members', roomId, { search, page, limit }],
    queryFn: async (): Promise<RoomMembersResponse> => {
      const response = await api.get(`/rooms/${roomId}/members`, {
        params: {
          search: search || undefined,
          page,
          limit,
        },
      })
      
      return response.data.data
    },
    enabled: !!roomId,
    retry: false,
  })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
