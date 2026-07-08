import { useEffect } from 'react'
import { socket } from './socket'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socket.connect()

    socket.on('connect', () => {
      console.log('✅ Connected', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.disconnect()
    }
  }, [])

  return <>{children}</>
}
