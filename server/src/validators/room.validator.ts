import { z } from 'zod'
import { RoomVisibility } from '../generated/prisma/enums.js'

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

  visibility: z.nativeEnum(RoomVisibility, {
    message: 'Visibility must be PUBLIC or PRIVATE',
  }),
})

export type CreateRoomInput = z.infer<typeof createRoomSchema>

export const updateRoomSchema = z
  .object({
    name: z
      .string({ message: 'Room name must be a string' })
      .trim()
      .min(3, 'Room name must be at least 3 characters')
      .max(50, 'Room name cannot exceed 50 characters')
      .optional(),

    description: z
      .string({ message: 'Description must be a string' })
      .trim()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),

    visibility: z
      .nativeEnum(RoomVisibility, {
        message: 'Visibility must be PUBLIC or PRIVATE',
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.name === undefined &&
      data.description === undefined &&
      data.visibility === undefined
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one field must be provided.',
      })
    }
  })

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>
