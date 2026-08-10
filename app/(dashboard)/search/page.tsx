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
      {/* Search Input Bar */}
      <SearchInput defaultValue={queryParam} placeholder="Search items, boxes, or locations..." autoFocus />

      {/* Search Content States per Design.md 10.7 */}
      {loading && (
        <div className="py-12 text-center space-y-3 bg-surface rounded-xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm font-medium text-text-secondary">Searching inventory...</p>
        </div>
      )}

      {!loading && error && (
        <Card className="p-6 bg-error-soft border-error/20 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-error mx-auto" />
          <h3 className="font-bold text-error">Search Error</h3>
          <p className="text-sm text-text-secondary">{error}</p>
        </Card>
      )}

      {!loading && !error && !queryParam.trim() && (
        <div className="py-16 text-center space-y-3 bg-surface rounded-xl border border-border max-w-[480px] mx-auto">
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Search your inventory</h3>
            <p className="text-xs text-text-secondary mt-1">
              Type an item name to instantly see which physical box and room it is stored in.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && queryParam.trim() !== '' && effectiveResults.length === 0 && (
        <div className="py-12 text-center space-y-3 bg-surface rounded-xl border border-border max-w-[480px] mx-auto">
          <PackageSearch className="h-10 w-10 text-text-muted mx-auto stroke-[1.5]" />
          <div>
            <h3 className="font-bold text-base text-text-primary">No items found</h3>
            <p className="text-xs text-text-secondary mt-1">
              No items match &quot;{queryParam}&quot;. Try a different search term.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && effectiveResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-text-muted font-medium px-1">
            <span>Found {effectiveResults.length} {effectiveResults.length === 1 ? 'result' : 'results'} for &quot;{queryParam}&quot;</span>
          </div>
          <SearchResults results={effectiveResults} />
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <PageContainer>
      <div className="space-y-6 max-w-[720px] mx-auto pb-12">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Inventory Search
          </h1>
          <p className="text-sm text-text-secondary">Instantly locate items across all physical boxes</p>
        </div>

        <Suspense fallback={
          <div className="py-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
          </div>
        }>
          <SearchContent />
        </Suspense>
      </div>
    </PageContainer>
  )
}