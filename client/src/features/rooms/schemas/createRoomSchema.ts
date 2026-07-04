import { z } from 'zod'

export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required').max(50, 'Room name cannot exceed 50 characters'),
  description: z.string().max(255, 'Description cannot exceed 255 characters').optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).default('PUBLIC'),
})

export type CreateRoomFormInput = z.infer<typeof createRoomSchema>
