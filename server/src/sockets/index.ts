import type { Server } from 'socket.io'
import { handleConnection } from './handlers/connection.handler.js'

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', handleConnection)
}
