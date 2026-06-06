import { Router } from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getMe,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js'
import {
  forgotPasswordRateLimiter,
  loginRateLimiter,
  signupRateLimiter,
} from '../middlewares/rateLimit.js'

const router: Router = Router()

router.post('/signup', signupRateLimiter, signup)

router.post('/login', loginRateLimiter, login)

router.post('/logout', logout)

router.post('/refresh', refreshAccessToken)

router.post('/forgot-password', forgotPasswordRateLimiter, forgotPassword)

router.post('/reset-password', resetPassword)

router.get('/me', protect, getMe)

export default router
