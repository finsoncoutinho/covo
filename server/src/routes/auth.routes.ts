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

const router: Router = Router()

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.post('/refresh', refreshAccessToken)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password', resetPassword)

router.get('/me', protect, getMe)

export default router
