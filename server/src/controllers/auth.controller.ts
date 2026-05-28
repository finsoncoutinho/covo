import type { Request, Response, RequestHandler, CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import {
  signupService,
  loginService,
  logoutService,
  getMeService,
  refreshAccessTokenService,
} from '../services/auth.service.js'
import { signupSchema, loginSchema } from '../validators/auth.validator.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from '../constants/cookie.js'
import { generateAccessToken } from '../utils/generateAccessToken.js'

export const signup: RequestHandler = asyncHandler(async (req, res) => {
  const validatedData = signupSchema.safeParse(req.body)

  if (!validatedData.success) {
    throw new ApiError(
      400,
      'Validation failed',
      Object.values(
        validatedData.error.flatten().fieldErrors,
      ).flat() as string[],
    )
  }

  const { accessToken, refreshToken, user } = await signupService(
    validatedData.data,
  )

  res.cookie('accessToken', accessToken, accessTokenCookieOptions)
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

  return res
    .status(201)
    .json(new ApiResponse(201, user, 'User created successfully'))
})

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const validatedData = loginSchema.safeParse(req.body)

  if (!validatedData.success) {
    throw new ApiError(
      400,
      'Validation failed',
      Object.values(
        validatedData.error.flatten().fieldErrors,
      ).flat() as string[],
    )
  }

  const { accessToken, refreshToken, user } = await loginService(
    validatedData.data,
  )

  res.cookie('accessToken', accessToken, accessTokenCookieOptions)
  res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions)

  return res.status(200).json(new ApiResponse(200, user, 'Login successful'))
})

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken

  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
        { ignoreExpiration: true },
      ) as { userId: string }
      await logoutService(decoded.userId)
    } catch (error) {
      console.error('Logout token verification failed')
    }
  }

  res.clearCookie('accessToken', accessTokenCookieOptions)

  res.clearCookie('refreshToken', refreshTokenCookieOptions)

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully'))
})

export const refreshAccessToken: RequestHandler = asyncHandler(
  async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      throw new ApiError(401, 'Refresh token missing')
    }

    const { accessToken } = await refreshAccessTokenService(refreshToken)

    res.cookie('accessToken', accessToken, accessTokenCookieOptions)

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Access token refreshed'))
  },
)

export const getMe: RequestHandler = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user!.userId)

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'))
})
