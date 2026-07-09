import type { Socket } from '../../types/socket.js'
import jwt from 'jsonwebtoken'
import { parseCookie } from 'cookie'

import type { AccessTokenPayload } from '../../types/auth.types.js'

export const socketAuth = (
  socket: Socket,
  next: (err?: Error) => void,
) => {
  const cookies = parseCookie(socket.handshake.headers.cookie || '')
  const accessToken = cookies.accessToken

  if (!accessToken) {
    return next(new Error('Authentication required'))
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as AccessTokenPayload

    socket.data.user = { userId: decoded.userId }

    next()
  } catch {
    next(new Error('Invalid or expired access token'))
  }
}
