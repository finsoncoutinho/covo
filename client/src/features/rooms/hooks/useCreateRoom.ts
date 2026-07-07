import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export interface CreateRoomDto {
  name: string
  description?: string
  visibility: 'PUBLIC' | 'PRIVATE'
}

export const useCreateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateRoomDto) => {
      const response = await api.post('/rooms', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
    },
  })
}
