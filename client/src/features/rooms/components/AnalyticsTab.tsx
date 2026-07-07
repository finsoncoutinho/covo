export function AnalyticsTab({ roomId }: { roomId: string }) {
  return (
    <div className='flex items-center justify-center h-full min-h-[400px] border rounded-lg bg-muted/10 border-dashed'>
      <p className='text-muted-foreground'>Analytics Component for Room {roomId}</p>
    </div>
  )
}
