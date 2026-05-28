import prisma from '../lib/prisma.js'
import { ApiError } from '../utils/ApiError.js'
import { comparePassword } from '../utils/comparePassword.js'
import { generateAccessToken } from '../utils/generateAccessToken.js'
import { generateRefreshToken } from '../utils/generateRefreshToken.js'
import { hashPassword } from '../utils/hashPassword.js'
import type { LoginInput, SignupInput } from '../validators/auth.validator.js'
import { hashToken } from '../utils/hashToken.js'
import jwt from 'jsonwebtoken'

export const signupService = async (data: SignupInput) => {
  const { username, email, password } = data

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    throw new ApiError(400, 'User already exists')
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  })

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  const hashedRefreshToken = hashToken(refreshToken)
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  })
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, email: user.email },
  }
}

export const loginService = async (data: LoginInput) => {
  const { email, password } = data

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials')
  }

  const accessToken = generateAccessToken(user.id)
  const refreshToken = generateRefreshToken(user.id)

  const hashedRefreshToken = hashToken(refreshToken)
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: hashedRefreshToken,
    },
  })

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, email: user.email },
  }
}

export const logoutService = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      refreshToken: null,
    },
  })
}

export const getMeService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  return user
}

export const refreshAccessTokenService = async (refreshToken: string) => {
  let decoded: { userId: string }

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      userId: string
    }
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    select: {
      id: true,
      refreshToken: true,
    },
  })

  if (!user || !user.refreshToken) {
    throw new ApiError(401, 'Invalid refresh token')
  }

  const hashedRefreshToken = hashToken(refreshToken)

  if (user.refreshToken !== hashedRefreshToken) {
    throw new ApiError(401, 'Invalid refresh token')
  }

  const accessToken = generateAccessToken(user.id)

  return { accessToken }
}
