import { api } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateRoomDto } from './useCreateRoom'

export type UpdateRoomDto = Partial<CreateRoomDto>

export interface UpdateRoomVariables {
  roomId: string
  data: UpdateRoomDto
}

export const useUpdateRoom = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ roomId, data }: UpdateRoomVariables) => {
      const response = await api.patch(`/rooms/${roomId}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['my-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['public-rooms'] })
      queryClient.invalidateQueries({ queryKey: ['room', variables.roomId] })
    },
  })
}
