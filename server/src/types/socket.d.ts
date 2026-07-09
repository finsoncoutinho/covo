import type { Socket as _Socket } from 'socket.io'

import type { AccessTokenPayload } from './auth.types.js'

export interface SocketData {
  user: AccessTokenPayload
}

export type Socket = _Socket<
  Record<string, never>,
  Record<string, never>,
  Record<string, never>,
  SocketData
>
