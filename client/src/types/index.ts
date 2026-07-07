export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface BaseRoom {
  id: string
  name: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE'
  memberCount: number
  imageUrl?: string
}

export interface Room extends BaseRoom {
  currentUserRole: 'OWNER' | 'MEMBER' | null
  inviteCode?: string
}

export type PublicRoom = BaseRoom

