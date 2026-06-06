import jwt from 'jsonwebtoken'

export const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: '7d',
    },
  )
}
