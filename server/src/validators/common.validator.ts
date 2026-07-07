import { z } from 'zod'

export const roomIdParamSchema = z.object({
  roomId: z.string({ message: 'Room ID is required' }).cuid({ message: 'Invalid room ID format' }),
})

export const userIdParamSchema = z.object({
  userId: z.string({ message: 'User ID is required' }).cuid({ message: 'Invalid user ID format' }),
})
