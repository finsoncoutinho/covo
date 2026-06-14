import type { RequestHandler } from 'express'

import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'

import { createRoomSchema } from '../validators/room.validator.js'
import { createRoomService } from '../services/room.service.js'

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
