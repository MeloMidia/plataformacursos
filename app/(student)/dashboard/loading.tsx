import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" style={{ background: 'var(--bg-card)' }} />
        <Skeleton className="h-5 w-48" style={{ background: 'var(--bg-card)' }} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" style={{ background: 'var(--bg-card)' }} />
        ))}
      </div>
    </div>
  )
}
