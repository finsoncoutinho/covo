import { z } from 'zod'

export const createRoomSchema = z.object({
  name: z
    .string({ message: 'Room name is required' })
    .trim()
    .min(3, 'Room name must be at least 3 characters')
    .max(50, 'Room name cannot exceed 50 characters'),

  description: z
    .string()
    .trim()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),

  visibility: z.enum(['PUBLIC', 'PRIVATE'], {
    message: 'Visibility must be PUBLIC or PRIVATE',
  }),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>
