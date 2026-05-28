export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000,
}

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}
