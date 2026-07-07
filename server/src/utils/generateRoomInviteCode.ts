import { nanoid } from 'nanoid'

export const generateRoomInviteCode = () => {
  return nanoid(10)
}
