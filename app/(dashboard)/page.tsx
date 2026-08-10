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
import type { Metadata } from 'next'
import { Package, Layers, MapPin, type LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false },
}

function StatBadge({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number
}) {
  return (
    <div className="glass-subtle flex flex-col justify-between rounded-2xl px-3.5 py-3.5 shadow-glass sm:px-5 sm:py-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <Icon className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <span className="mt-1.5 text-2xl font-semibold tracking-tight text-text-primary tabular-nums sm:text-3xl">
        {value}
      </span>
    </div>
  )
}

async function DashboardStatsSection() {
  const supabase = await createClient()
  const stats = await getDashboardStats(supabase)

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <StatBadge icon={Package} label="Boxes" value={stats.box_count} />
      <StatBadge icon={Layers} label="Items" value={stats.item_count} />
      <StatBadge icon={MapPin} label="Locations" value={stats.location_count} />
    </div>
  )
}

async function RecentBoxesSection() {
  const supabase = await createClient()
  const { boxes } = await getBoxes({ limit: 6, sort: 'newest' }, supabase)

  if (boxes.length === 0) {
    return (
      <div className="glass rounded-2xl py-10 shadow-glass">
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
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          Recently added
        </h2>
        <Link
          href="/boxes"
          className="rounded text-xs font-semibold text-primary underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      <BoxGrid boxes={boxes} />
    </section>
  )
}

export default async function DashboardPage() {
  return (
    <PageContainer>
      <div className="space-y-8 md:space-y-10">
        {/*
          The search panel is the page's dominant surface — the primary
          "Add Box" action lives in the sidebar (md+) / bottom-nav FAB
          (below md) and is deliberately not repeated here.
        */}
        <section className="glass rounded-3xl p-6 shadow-glass-lg sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Know what&apos;s where.
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Search every item across every box you&apos;ve catalogued.
          </p>

          <div className="mt-6">
            <SearchInput placeholder="What are you looking for?" />
          </div>
        </section>

        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStatsSection />
        </Suspense>

        <Suspense fallback={<BoxGridSkeleton count={6} />}>
          <RecentBoxesSection />
        </Suspense>
      </div>
    </PageContainer>
  )
}
