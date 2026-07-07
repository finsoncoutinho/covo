import { generateRoomInviteCode } from '../utils/generateRoomInviteCode.js'
import prisma from '../lib/prisma.js'
import type { CreateRoomInput } from '../validators/room.validator.js'
import { ApiError } from '../utils/ApiError.js'
import { Prisma, RoomRole, RoomVisibility } from '../generated/prisma/client.js'

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

const getRoomMembership = async (roomId: string, userId?: string) => {
  if (!userId) return null

  return prisma.roomMember.findUnique({
    where: {
      roomId_userId: {
        roomId,
        userId,
      },
    },

    select: {
      role: true,
      room: {
        select: {
          inviteCode: true,
          visibility: true,
        },
      },
    },
  })
}

const assertRoomPermission = async (
  roomId: string,
  userId: string,
  allowedRoles: RoomRole[],
) => {
  const membership = await getRoomMembership(roomId, userId)

  if (!membership || !allowedRoles.includes(membership.role)) {
    throw new ApiError(
      403,
      'You do not have permission to perform this action.',
    )
  }

  return membership
}

// ==========================
// Room Services
// ==========================

export const createRoomService = async (
  userId: string,
  data: CreateRoomInput,
) => {
  const inviteCode =
    data.visibility === 'PRIVATE' ? generateRoomInviteCode() : null

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

export const getRoomByIdService = async (roomId: string, userId?: string) => {
  const [room, currentUserMembership] = await Promise.all([
    prisma.room.findUnique({
      where: {
        id: roomId,
      },

      include: {
        _count: {
          select: {
            memberships: true,
          },
        },
      },
    }),

    getRoomMembership(roomId, userId),
  ])

  if (!room) {
    throw new ApiError(404, 'Room not found')
  }

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
    ...(room.visibility === 'PRIVATE' && { inviteCode: room.inviteCode }),
  }
}

export const getRoomMembersService = async ({
  roomId,
  userId,
  search,
  page = 1,
  limit = 20,
}: {
  roomId: string
  userId: string
  search?: string | undefined
  page?: number | undefined
  limit?: number | undefined
}) => {
  const skip = (page - 1) * limit

  const where: Prisma.RoomMemberWhereInput = {
    roomId,
    ...(search && {
      user: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
    }),
  }

  const [room, currentUserMembership] = await Promise.all([
    prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        visibility: true,
      },
    }),

    getRoomMembership(roomId, userId),
  ])

  if (!room) {
    throw new ApiError(404, 'Room not found')
  }

  if (!currentUserMembership) {
    throw new ApiError(403, 'Access denied')
  }

  const [memberships, total] = await Promise.all([
    prisma.roomMember.findMany({
      where,
      select: {
        role: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
      skip,
      take: limit,
    }),
    prisma.roomMember.count({
      where,
    }),
  ])

  return {
    members: memberships.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      role: member.role,
      isCurrentUser: member.user.id === userId,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
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

export const updateRoomDetails = async ({
  roomId,
  userId,
  name,
  description,
  visibility,
}: {
  roomId: string
  userId: string
  name?: string | undefined
  description?: string | undefined
  visibility?: RoomVisibility | undefined
}) => {
  const membership = await assertRoomPermission(roomId, userId, ['OWNER'])

  const data: Prisma.RoomUpdateInput = {}

  if (name !== undefined) {
    data.name = name
  }

  if (description !== undefined) {
    data.description = description
  }

  if (visibility !== undefined) {
    data.visibility = visibility

    if (visibility === 'PRIVATE' && !membership.room.inviteCode) {
      data.inviteCode = generateRoomInviteCode()
    }
    if (visibility === 'PUBLIC' && membership.room.inviteCode) {
      data.inviteCode = null
    }
  }

  const updatedRoom = await prisma.room.update({
    where: {
      id: roomId,
    },
    data,
  })

  return {
    id: updatedRoom.id,
    name: updatedRoom.name,
    description: updatedRoom.description,
    visibility: updatedRoom.visibility,
  }
}

export const deleteRoomService = async (roomId: string, userId: string) => {
  await assertRoomPermission(roomId, userId, ['OWNER'])

  await prisma.room.delete({
    where: {
      id: roomId,
    },
  })

  return {
    roomId,
  }
}

export const kickMemberService = async (
  roomId: string,
  userId: string,
  memberToKick: string,
) => {
  await assertRoomPermission(roomId, userId, ['OWNER'])

  if (userId === memberToKick) {
    throw new ApiError(400, 'You cannot kick yourself')
  }

  const targetMembership = await getRoomMembership(roomId, memberToKick)

  if (!targetMembership) {
    throw new ApiError(404, 'Member not found')
  }

  if (targetMembership.role === 'OWNER') {
    throw new ApiError(400, 'Cannot kick the owner')
  }

  await removeRoomMembership(roomId, memberToKick)

  return {
    roomId,
    userId: memberToKick,
  }
}

export const regenerateInviteCodeService = async (
  roomId: string,
  userId: string,
) => {
  const membership = await assertRoomPermission(roomId, userId, ['OWNER'])

  if (membership.room.visibility === 'PUBLIC') {
    throw new ApiError(400, 'Cannot generate invite code for public room')
  }

  try {
    const inviteCode = generateRoomInviteCode()

    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        inviteCode,
      },
    })

    return {
      inviteCode,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ApiError(
        500,
        'Failed to generate a unique invite code. Please try again.',
      )
    }

    throw error
  }
}

export const getRoomByInviteCodeService = async (
  inviteCode: string,
  userId?: string,
) => {
  const room = await prisma.room.findUnique({
    where: { inviteCode },
    include: {
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

  let isMember = false
  if (userId) {
    const membership = await getRoomMembership(room.id, userId)
    isMember = !!membership
  }

  return {
    id: room.id,
    name: room.name,
    description: room.description,
    memberCount: room._count.memberships,
    image: null,
    isMember,
  }
}
