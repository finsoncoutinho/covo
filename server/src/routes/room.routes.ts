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
  deleteRoom,
  kickMember,
  regenerateInviteCode,
  getRoomMembers,
  getRoomByInviteCode,
} from '../controllers/room.controller.js'
import { protect, optionalAuth } from '../middlewares/auth.middleware.js'

const router: Router = Router()

router.post('/', protect, createRoom)
router.get('/me', protect, getMyRooms)
router.get('/', getPublicRooms)
router.get('/:roomId', optionalAuth, getRoomById)
router.get('/:roomId/members', protect, getRoomMembers)
router.get('/invite/:inviteCode', optionalAuth, getRoomByInviteCode)
router.post('/join/:inviteCode', protect, joinPrivateRoom)
router.post('/:roomId/join', protect, joinPublicRoom)
router.delete('/:roomId/leave', protect, leaveRoom)
router.delete('/:roomId/members/:memberId', protect, kickMember)
router.patch('/:roomId', protect, updateRoom)
router.patch('/:roomId/invite-code', protect, regenerateInviteCode)
router.delete('/:roomId', protect, deleteRoom)

export default router
