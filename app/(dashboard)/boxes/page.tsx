import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBoxes } from '@/lib/services/boxes'
import PageContainer from '@/components/layout/page-container'
import { BoxGrid } from '@/components/boxes/box-grid'
import { EmptyState } from '@/components/shared/empty-state'
import { BoxGridSkeleton } from '@/components/shared/loading-skeletons'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boxes',
  robots: { index: false, follow: false },
}

type SortOption = 'newest' | 'oldest' | 'name' | 'updated'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Name', value: 'name' },
  { label: 'Updated', value: 'updated' },
]

interface BoxesPageProps {
  searchParams: Promise<{ sort?: SortOption }>
}

async function BoxesListSection({ sort = 'newest' }: { sort?: SortOption }) {
  const supabase = await createClient()
  const { boxes, total } = await getBoxes({ sort, limit: 100 }, supabase)

  if (total === 0) {
    return (
      <div className="glass rounded-2xl py-12 shadow-glass">
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
      <p className="px-1 text-xs font-medium text-text-muted">
        Showing {boxes.length} of {total} boxes
      </p>
      <BoxGrid boxes={boxes} />
    </div>
  )
}

export default async function BoxesPage({ searchParams }: BoxesPageProps) {
  const params = await searchParams
  const sort = params.sort || 'newest'

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* "Add Box" lives once per context: sidebar (md+) / bottom-nav FAB. */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            All Boxes
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            View and manage your physical boxes
          </p>
        </div>

        <nav
          aria-label="Sort boxes"
          className="glass-subtle flex items-center gap-1 overflow-x-auto rounded-2xl p-1.5 shadow-glass"
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = sort === opt.value
            return (
              <Link
                key={opt.value}
                href={`/boxes?sort=${opt.value}`}
                aria-current={isActive ? 'true' : undefined}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? 'glass-strong font-semibold text-primary shadow-glass'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {opt.label}
              </Link>
            )
          })}
        </nav>

        <Suspense fallback={<BoxGridSkeleton count={6} />}>
          <BoxesListSection sort={sort} />
        </Suspense>
      </div>
    </PageContainer>
  )
}
