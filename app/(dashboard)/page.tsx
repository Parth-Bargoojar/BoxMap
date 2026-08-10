import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats } from '@/lib/services/dashboard'
import { getBoxes } from '@/lib/services/boxes'
import PageContainer from '@/components/layout/page-container'
import { SearchInput } from '@/components/search/search-input'
import { BoxGrid } from '@/components/boxes/box-grid'
import { EmptyState } from '@/components/shared/empty-state'
import { StatsSkeleton, BoxGridSkeleton } from '@/components/shared/loading-skeletons'
import { Button } from '@/components/ui/button'
import { Plus, Package, Layers, MapPin } from 'lucide-react'

async function DashboardStatsSection() {
  const supabase = await createClient()
  const stats = await getDashboardStats(supabase)

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
          <Package className="h-3.5 w-3.5" />
          <span>Boxes</span>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
          {stats.box_count}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
          <Layers className="h-3.5 w-3.5" />
          <span>Items</span>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
          {stats.item_count}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 rounded-xl border border-border bg-surface flex flex-col justify-between">
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-medium">
          <MapPin className="h-3.5 w-3.5" />
          <span>Locations</span>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
          {stats.location_count}
        </span>
      </div>
    </div>
  )
}

async function RecentBoxesSection() {
  const supabase = await createClient()
  const { boxes } = await getBoxes({ limit: 6, sort: 'newest' }, supabase)

  if (boxes.length === 0) {
    return (
      <div className="py-8 bg-surface rounded-xl border border-border">
        <EmptyState
          title="Your storage is empty"
          description="Add your first box to start building your storage map."
          actionLabel="Add Box"
          actionHref="/boxes/new"
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-primary">Recently Added</h2>
        <Link
          href="/boxes"
          className="text-xs font-semibold text-primary hover:text-primary-hover underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      <BoxGrid boxes={boxes} />
    </div>
  )
}

export default async function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-6 md:space-y-8 pb-8">
        {/* Header / Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              BoxMap
            </h1>
            <p className="text-sm text-text-secondary">Know what&apos;s where.</p>
          </div>

          <Link href="/boxes/new" className="hidden sm:inline-flex">
            <Button className="gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              Add Box
            </Button>
          </Link>
        </div>

        {/* Search Bar - Visually Dominant */}
        <div className="w-full">
          <SearchInput placeholder="What are you looking for?" />
        </div>

        {/* Quick Stats */}
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsSection />
        </Suspense>

        {/* Recently Added Boxes */}
        <Suspense fallback={<BoxGridSkeleton count={6} />}>
          <RecentBoxesSection />
        </Suspense>
      </div>
    </PageContainer>
  )
}