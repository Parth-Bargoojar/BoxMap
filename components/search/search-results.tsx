import Link from 'next/link'
import { SearchResultItem } from '@/lib/services/search'
import { Card } from '@/components/ui/card'
import { ArrowRight, Layers, MapPin } from 'lucide-react'

interface SearchResultsProps {
  results: SearchResultItem[]
}

interface GroupedItem {
  itemName: string
  items: SearchResultItem[]
}

export function SearchResults({ results }: SearchResultsProps) {
  // Group results by item name (case-insensitive)
  const groupedMap = new Map<string, SearchResultItem[]>()

  results.forEach((res) => {
    const key = res.item.name.trim().toLowerCase()
    const existing = groupedMap.get(key) || []
    groupedMap.set(key, [...existing, res])
  })

  const groups: GroupedItem[] = Array.from(groupedMap.entries()).map(([, items]) => ({
    itemName: items[0].item.name,
    items,
  }))

  return (
    <div className="space-y-4">
      {groups.map((group, groupIdx) => {
        const isMultiple = group.items.length > 1

        return (
          <Card key={groupIdx} className="gap-0 py-0 shadow-glass">
            {isMultiple && (
              <div className="flex items-center justify-between gap-3 border-b border-glass-hairline bg-primary-soft/40 px-4 py-3">
                <div className="flex min-w-0 items-center gap-2">
                  <Layers className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate text-sm font-semibold text-text-primary">
                    {group.itemName}
                  </span>
                </div>
                <span className="glass-strong shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {group.items.length} locations
                </span>
              </div>
            )}

            <div className="divide-y divide-glass-hairline">
              {group.items.map((res) => {
                const locationParts = res.location
                  ? [res.location.room, res.location.area, res.location.position].filter(Boolean)
                  : []
                const locationText =
                  locationParts.length > 0 ? locationParts.join(' → ') : null

                return (
                  <Link
                    key={res.item.id}
                    href={`/boxes/${res.box.id}`}
                    className="group block px-4 py-4 transition-colors hover:bg-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-semibold tracking-tight text-text-primary transition-colors group-hover:text-primary">
                            {res.item.name}
                          </span>
                          <span className="glass-subtle shrink-0 rounded-md px-1.5 py-0.5 text-xs font-semibold text-text-secondary tabular-nums">
                            {res.item.quantity}&times;
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                          <span className="rounded-md bg-primary-soft px-1.5 py-0.5 font-semibold text-primary-hover">
                            {res.box.box_code}
                          </span>
                          <span className="truncate">{res.box.name}</span>
                        </div>

                        {locationText && (
                          <div className="flex items-center gap-1.5 truncate text-xs text-text-muted">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate font-medium">{locationText}</span>
                          </div>
                        )}
                      </div>

                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </div>
                  </Link>
                )
              })}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
