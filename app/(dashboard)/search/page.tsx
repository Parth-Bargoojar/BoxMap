'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchItems, SearchResultItem } from '@/lib/services/search'
import PageContainer from '@/components/layout/page-container'
import { SearchInput } from '@/components/search/search-input'
import { SearchResults } from '@/components/search/search-results'
import { Card } from '@/components/ui/card'
import { Search, Loader2, PackageSearch, AlertCircle } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!queryParam.trim()) {
      return
    }

    let isMounted = true
    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await searchItems(queryParam)
        if (isMounted) {
          setResults(data)
          setLoading(false)
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Couldn\'t complete the search. Please try again.'
        if (isMounted) {
          setError(msg)
          setLoading(false)
        }
      }
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [queryParam])

  const effectiveResults = queryParam.trim() ? results : []

  return (
    <div className="space-y-6">
      {/* Matches the dashboard's search panel */}
      <div className="glass rounded-3xl p-5 shadow-glass-lg sm:p-6">
        <SearchInput
          defaultValue={queryParam}
          placeholder="Search items, boxes, or locations..."
          autoFocus
        />
      </div>

      {loading && (
        <div className="glass space-y-3 rounded-2xl py-14 text-center shadow-glass">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-text-secondary">Searching inventory...</p>
        </div>
      )}

      {!loading && error && (
        <Card className="border-error/20 space-y-2 py-8 text-center shadow-glass">
          <AlertCircle className="mx-auto h-8 w-8 text-error" />
          <h3 className="font-semibold text-error">Search error</h3>
          <p className="text-sm text-text-secondary">{error}</p>
        </Card>
      )}

      {!loading && !error && !queryParam.trim() && (
        <div className="glass mx-auto max-w-[480px] space-y-3 rounded-2xl px-6 py-16 text-center shadow-glass">
          <div className="glass-subtle mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-primary shadow-glass">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold tracking-tight text-text-primary">
              Search your inventory
            </h3>
            <p className="mt-1 text-xs text-text-secondary">
              Type an item name to instantly see which physical box and room it is stored in.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && queryParam.trim() !== '' && effectiveResults.length === 0 && (
        <div className="glass mx-auto max-w-[480px] space-y-3 rounded-2xl px-6 py-14 text-center shadow-glass">
          <PackageSearch className="mx-auto h-10 w-10 stroke-[1.5] text-text-muted" />
          <div>
            <h3 className="font-semibold tracking-tight text-text-primary">No items found</h3>
            <p className="mt-1 text-xs text-text-secondary">
              No items match &quot;{queryParam}&quot;. Try a different search term.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && effectiveResults.length > 0 && (
        <div className="space-y-3">
          <p className="px-1 text-xs font-medium text-text-muted">
            Found {effectiveResults.length}{' '}
            {effectiveResults.length === 1 ? 'result' : 'results'} for &quot;{queryParam}&quot;
          </p>
          <SearchResults results={effectiveResults} />
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <PageContainer>
      <div className="mx-auto max-w-[760px] space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Inventory Search
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Instantly locate items across all physical boxes
          </p>
        </div>

        <Suspense fallback={
          <div className="py-12 text-center">
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
          </div>
        }>
          <SearchContent />
        </Suspense>
      </div>
    </PageContainer>
  )
}