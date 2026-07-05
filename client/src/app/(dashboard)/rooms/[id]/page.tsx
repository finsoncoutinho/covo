interface PageProps {
  params: {
    id: string
  }
}

export default function RoomPage({ params }: PageProps) {
  return (
    <div className='flex items-center justify-center h-full p-8'>
      <p className='text-lg text-muted-foreground'>Room ID: {params.id}</p>
    </div>
  )
}
