import { nanoid } from 'nanoid'
import prisma from '../lib/prisma.js'
import type { CreateRoomInput } from '../validators/room.validator.js'
import { ApiError } from '../utils/ApiError.js'
import { Prisma } from '../generated/prisma/client.js'

// ==========================
// Membership Helpers
// ==========================

const createRoomMembership = async (roomId: string, userId: string) => {
  return prisma.roomMember.create({
    data: {
      roomId,
      userId,
      role: 'MEMBER',
    },
    select: {
      roomId: true,
      role: true,
    },
  })
}

const removeRoomMembership = async (roomId: string, userId: string) => {
  try {
    await prisma.roomMember.delete({
      where: { roomId_userId: { roomId, userId } },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new ApiError(404, 'Room membership not found')
    }
    throw error
  }
}

const getRoomMembership = async (roomId: string, userId: string) => {
  return prisma.roomMember.findUnique({
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
}

// ==========================
// Room Services
// ==========================

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

  const currentUserMembership = await getRoomMembership(roomId, userId)

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
  search?: string | undefined
  page?: number | undefined
  limit?: number | undefined
}) => {
  const skip = (page - 1) * limit

  const where: Prisma.RoomWhereInput = {
    visibility: 'PUBLIC',

    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
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

export const joinPublicRoomService = async ({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) => {
  const [room, existingMembership] = await Promise.all([
    prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        id: true,
        visibility: true,
      },
    }),

    getRoomMembership(roomId, userId),
  ])

  if (!room) {
    throw new ApiError(404, 'Room not found')
  }

  if (room.visibility === 'PRIVATE') {
    throw new ApiError(403, 'This is a private room.')
  }

  if (existingMembership) {
    throw new ApiError(400, 'User is already a member of the room')
  }

  try {
    const roomMember = await createRoomMembership(roomId, userId)

    return roomMember
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(400, 'User is already a member of the room')
      }
    }
    throw error
  }
}

export const joinPrivateRoomService = async ({
  userId,
  inviteCode,
}: {
  userId: string
  inviteCode: string
}) => {
  const room = await prisma.room.findUnique({
    where: {
      inviteCode,
    },
    select: {
      id: true,
      visibility: true,
    },
  })

  if (!room) {
    throw new ApiError(404, 'Room not found')
  }

  const existingMembership = await getRoomMembership(room.id, userId)

  if (existingMembership) {
    throw new ApiError(400, 'User is already a member of the room')
  }

  try {
    const roomMember = await createRoomMembership(room.id, userId)

    return roomMember
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ApiError(400, 'User is already a member of the room')
      }
    }
    throw error
  }
}

export const leaveRoomService = async ({
  roomId,
  userId,
}: {
  roomId: string
  userId: string
}) => {
  const membership = await getRoomMembership(roomId, userId)

  if (!membership) {
    throw new ApiError(404, 'Room membership not found')
  }

  if (membership.role === 'OWNER') {
    throw new ApiError(
      400,
      'Transfer ownership or delete the room before leaving.',
    )
  }

  await removeRoomMembership(roomId, userId)

  return {
    roomId,
  }
}
