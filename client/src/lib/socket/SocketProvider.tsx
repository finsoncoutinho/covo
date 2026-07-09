'use client'

import { useEffect } from 'react'
import { socket } from './socket'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useDebounce } from '@/hooks/useDebounce'

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser()
  const debouncedUser = useDebounce(user, 300)

  useEffect(() => {
    if (!debouncedUser) {
      socket.disconnect()
      return
    }

    if (!socket.connected) {
      socket.connect()
    }

    socket.on('connect', () => {
      console.log('✅ Connected', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected')
    })

    socket.on('connect_error', (err) => {
      console.error('🔴 Connection error:', err.message)
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
      socket.disconnect()
    }
  }, [debouncedUser])

  return <>{children}</>
}
