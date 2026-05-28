import type { NextFunction, Request, Response, RequestHandler } from 'express'

import jwt from 'jsonwebtoken'

import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'

export const protect: RequestHandler = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken

    if (!accessToken) {
      throw new ApiError(401, 'Unauthorized access')
    }

    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as {
        userId: string
      }

      req.user = {
        userId: decoded.userId,
      }

      next()
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired access token')
    }
  },
)
