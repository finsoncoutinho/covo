import rateLimit from 'express-rate-limit'

export const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
})

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
})

export const forgotPasswordRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many password reset requests. Please try again later.',
  },
})

export const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many signup attempts. Please try again later.',
  },
})
