import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getBoxes } from '@/lib/services/boxes'
import PageContainer from '@/components/layout/page-container'
import { BoxGrid } from '@/components/boxes/box-grid'
import { EmptyState } from '@/components/shared/empty-state'
import { BoxGridSkeleton } from '@/components/shared/loading-skeletons'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Boxes',
  robots: { index: false, follow: false },
}

interface BoxesPageProps {
  searchParams: Promise<{
    sort?: 'newest' | 'oldest' | 'name' | 'updated'
  }>
}

async function BoxesListSection({ sort = 'newest' }: { sort?: 'newest' | 'oldest' | 'name' | 'updated' }) {
  const supabase = await createClient()
  const { boxes, total } = await getBoxes({ sort, limit: 100 }, supabase)

  if (total === 0) {
    return (
      <div className="py-12 bg-surface rounded-xl border border-border">
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
      <div className="flex items-center justify-between text-xs text-text-muted font-medium px-1">
        <span>Showing {boxes.length} of {total} boxes</span>
      </div>
      <BoxGrid boxes={boxes} />
    </div>
  )
}

export default async function BoxesPage({ searchParams }: BoxesPageProps) {
  const params = await searchParams
  const sort = params.sort || 'newest'

  return (
    <PageContainer>
      <div className="space-y-6 pb-8">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              All Boxes
            </h1>
            <p className="text-sm text-text-secondary">View and manage your physical boxes</p>
          </div>

          <Link href="/boxes/new">
            <Button className="gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              Add Box
            </Button>
          </Link>
        </div>

        {/* Sorting Dropdown / Filter Bar */}
        <div className="flex items-center justify-between bg-surface p-3 rounded-xl border border-border">
          <span className="text-xs font-semibold text-text-secondary">Sort Boxes:</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Newest', value: 'newest' },
              { label: 'Oldest', value: 'oldest' },
              { label: 'Name', value: 'name' },
              { label: 'Updated', value: 'updated' },
            ].map((opt) => (
              <Link
                key={opt.value}
                href={`/boxes?sort=${opt.value}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  sort === opt.value
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                {opt.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Box Grid List */}
        <Suspense fallback={<BoxGridSkeleton count={6} />}>
          <BoxesListSection sort={sort} />
        </Suspense>
      </div>
    </PageContainer>
  )
}