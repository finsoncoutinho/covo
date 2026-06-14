import { Router } from 'express'

import { createRoom } from '../controllers/room.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router: Router = Router()

router.post('/', protect, createRoom)

export default router
