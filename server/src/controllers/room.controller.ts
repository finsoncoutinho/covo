import type { RequestHandler } from 'express'

import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validateRequest } from '../utils/validation.js'

import { createRoomSchema, updateRoomSchema } from '../validators/room.validator.js'
import { roomIdParamSchema } from '../validators/common.validator.js'
import {
  createRoomService,
  getMyRoomsService,
  getPublicRoomsService,
  getRoomByIdService,
  joinPrivateRoomService,
  joinPublicRoomService,
  leaveRoomService,
  updateRoomDetails,
} from '../services/room.service.js'

export const createRoom: RequestHandler = asyncHandler(async (req, res) => {
  const body = validateRequest(createRoomSchema, req.body)

  const room = await createRoomService(req.user!.userId, body)

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
  const { roomId } = validateRequest(roomIdParamSchema, req.params, 'Invalid room ID')

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
  const { roomId } = validateRequest(roomIdParamSchema, req.params, 'Invalid room ID')
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

export const leaveRoom: RequestHandler<{
  roomId: string
}> = asyncHandler(async (req, res) => {
  const { roomId } = validateRequest(roomIdParamSchema, req.params, 'Invalid room ID')
  const { userId } = req.user!

  await leaveRoomService({ roomId, userId })

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Room left successfully'))
})

export const updateRoom: RequestHandler<{
  roomId: string
}> = asyncHandler(async (req, res) => {
  const { roomId } = validateRequest(roomIdParamSchema, req.params, 'Invalid room ID')
  const { userId } = req.user!

  const body = validateRequest(updateRoomSchema, req.body)

  const room = await updateRoomDetails({
    roomId,
    userId,
    ...body,
  })

  return res
    .status(200)
    .json(new ApiResponse(200, room, 'Room updated successfully'))
})
