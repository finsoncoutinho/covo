import { Router } from 'express'

import {
  createRoom,
  getMyRooms,
  getRoomById,
} from '../controllers/room.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router: Router = Router()

router.post('/', protect, createRoom)
router.get('/me', protect, getMyRooms)
router.get('/:roomId', protect, getRoomById)
export default router
