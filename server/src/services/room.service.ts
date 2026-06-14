import { nanoid } from 'nanoid'
import prisma from '../lib/prisma.js'
import type { CreateRoomInput } from '../validators/room.validator.js'

export const createRoomService = async (
  userId: string,
  data: CreateRoomInput,
) => {
  const inviteCode = data.visibility === 'PRIVATE' ? nanoid(10) : null

  const room = await prisma.room.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      visibility: data.visibility,
      inviteCode,

      memberships: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
    include: {
      memberships: true,
    },
  })

  return room
}
