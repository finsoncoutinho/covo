import type { Server } from 'socket.io'
import { socketAuth } from './middleware/auth.middleware.js'
import { handleConnection } from './handlers/connection.handler.js'

export const registerSocketHandlers = (io: Server) => {
  io.use(socketAuth)
  io.on('connection', handleConnection)
}
