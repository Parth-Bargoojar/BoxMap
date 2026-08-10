import { Skeleton } from '@/components/ui/skeleton'

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="glass-subtle space-y-2 rounded-2xl px-3.5 py-3.5 shadow-glass sm:px-5 sm:py-4"
        >
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-9" />
        </div>
      ))}
    </div>
  )
}

export function BoxGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass overflow-hidden rounded-2xl shadow-glass">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingSkeletons() {
  return (
    <div className="space-y-8">
      <StatsSkeleton />
      <BoxGridSkeleton />
    </div>
  )
}
