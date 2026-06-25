import { Router } from 'express'

import {
  createRoom,
  getMyRooms,
  getRoomById,
  getPublicRooms,
  joinPublicRoom,
  joinPrivateRoom,
  leaveRoom,
  updateRoom,
} from '../controllers/room.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router: Router = Router()

router.post('/', protect, createRoom)
router.get('/me', protect, getMyRooms)
router.get('/', protect, getPublicRooms)
router.get('/:roomId', protect, getRoomById)
router.post('/join/:inviteCode', protect, joinPrivateRoom)
router.post('/:roomId/join', protect, joinPublicRoom)
router.delete('/:roomId/leave', protect, leaveRoom)
router.patch('/:roomId', protect, updateRoom)

export default router
