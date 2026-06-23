import type { RequestHandler } from 'express'

import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

import { createRoomSchema } from '../validators/room.validator.js'
import {
  createRoomService,
  getMyRoomsService,
  getPublicRoomsService,
  getRoomByIdService,
  joinPrivateRoomService,
  joinPublicRoomService,
} from '../services/room.service.js'

export const createRoom: RequestHandler = asyncHandler(async (req, res) => {
  const validatedData = createRoomSchema.safeParse(req.body)

  if (!validatedData.success) {
    throw new ApiError(
      400,
      'Validation failed',
      Object.values(
        validatedData.error.flatten().fieldErrors,
      ).flat() as string[],
    )
  }

  const room = await createRoomService(req.user!.userId, validatedData.data)

  return res
    .status(201)
    .json(new ApiResponse(201, room, 'Room created successfully'))
})

export const getMyRooms: RequestHandler = asyncHandler(async (req, res) => {
  const rooms = await getMyRoomsService(req.user!.userId)

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, 'Rooms fetched successfully'))
})

export const getRoomById: RequestHandler = asyncHandler(async (req, res) => {
  const { roomId } = req.params

  if (!roomId || typeof roomId !== 'string') {
    throw new ApiError(400, 'Invalid or missing room ID')
  }

  const room = await getRoomByIdService(roomId, req.user!.userId)

  return res
    .status(200)
    .json(new ApiResponse(200, room, 'Room fetched successfully'))
})

export const getPublicRooms: RequestHandler = asyncHandler(async (req, res) => {
  const search =
    typeof req.query.search === 'string' ? req.query.search : undefined

  const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1

  const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 20

  const rooms = await getPublicRoomsService({
    search,
    page,
    limit,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, 'Rooms fetched successfully'))
})

export const joinPublicRoom: RequestHandler<{
  roomId: string
}> = asyncHandler(async (req, res) => {
  const { roomId } = req.params
  const { userId } = req.user!

  const membership = await joinPublicRoomService({ roomId, userId })

  return res
    .status(200)
    .json(new ApiResponse(200, membership, 'Room joined successfully'))
})

export const joinPrivateRoom: RequestHandler<{
  inviteCode: string
}> = asyncHandler(async (req, res) => {
  const { inviteCode } = req.params
  const { userId } = req.user!

  const membership = await joinPrivateRoomService({ inviteCode, userId })

  return res
    .status(200)
    .json(new ApiResponse(200, membership, 'Room joined successfully'))
})
