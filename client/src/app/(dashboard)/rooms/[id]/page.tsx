import { RoomDetailClient } from '@/features/rooms/components/RoomDetailClient'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function RoomPage({ params }: PageProps) {
  const { id } = await params

  return <RoomDetailClient roomId={id} />
}
