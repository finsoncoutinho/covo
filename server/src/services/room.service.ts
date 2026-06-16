import { nanoid } from 'nanoid'
import prisma from '../lib/prisma.js'
import type { CreateRoomInput } from '../validators/room.validator.js'
import { ApiError } from '../utils/ApiError.js'

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

export const getMyRoomsService = async (userId: string) => {
  const memberships = await prisma.roomMember.findMany({
    where: {
      userId,
    },

    select: {
      role: true,

      room: {
        select: {
          id: true,
          name: true,
          description: true,
          visibility: true,

          _count: {
            select: {
              memberships: true,
            },
          },
        },
      },
    },

    orderBy: {
      joinedAt: 'desc',
    },
  })

  return memberships.map((m) => ({
    id: m.room.id,
    name: m.room.name,
    description: m.room.description,
    visibility: m.room.visibility,
    currentUserRole: m.role,
    memberCount: m.room._count.memberships,
  }))
}

export const getRoomByIdService = async (roomId: string, userId: string) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },

    include: {
      memberships: {
        select: {
          role: true,

          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },

      _count: {
        select: {
          memberships: true,
        },
      },
    },
  })

  if (!room) {
    throw new ApiError(404, 'Room not found')
  }

  const currentUserMembership = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },

    select: {
      role: true,
    },
  })

  if (room.visibility === 'PRIVATE' && !currentUserMembership) {
    throw new ApiError(403, 'Access denied')
  }

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    visibility: room.visibility,

    currentUserRole: currentUserMembership?.role ?? null,

    memberCount: room._count.memberships,

    members: room.memberships.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      role: member.role,
    })),
  }
}

export const getPublicRoomsService = async ({
  search,
  page = 1,
  limit = 20,
}: {
  search?: string
  page?: number
  limit?: number
}) => {
  const skip = (page - 1) * limit

  const where: Prisma.RoomWhereInput = {
    visibility: 'PUBLIC',

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ],
    }),
  }

  const [rooms, total] = await Promise.all([
    prisma.room.findMany({
      where,

      select: {
        id: true,
        name: true,
        description: true,
        visibility: true,

        _count: {
          select: {
            memberships: true,
          },
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.room.count({
      where,
    }),
  ])

  return {
    rooms: rooms.map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      visibility: room.visibility,
      memberCount: room._count.memberships,
    })),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
