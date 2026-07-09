import 'dotenv/config'
import http from 'http'
import { Server } from 'socket.io'
import app from './app.js'
import { registerSocketHandlers } from './sockets/index.js'
import type { SocketData } from './types/socket.js'

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

const io = new Server<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  SocketData
>(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
})

registerSocketHandlers(io)

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
