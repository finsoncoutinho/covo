import type { Socket } from '../../types/socket.js'

export const handleConnection = (socket: Socket) => {
  console.log(
    `⚡ User connected: ${socket.id} (userId: ${socket.data.user.userId})`,
  )

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`)
  })
}
