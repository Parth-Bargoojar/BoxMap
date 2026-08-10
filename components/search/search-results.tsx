import Link from 'next/link'
import { SearchResultItem } from '@/lib/services/search'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Layers } from 'lucide-react'

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
          <Card key={groupIdx} className="border-border overflow-hidden bg-surface">
            {isMultiple && (
              <div className="bg-primary-soft/50 px-4 py-2.5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="font-bold text-sm text-text-primary">{group.itemName}</span>
                </div>
                <span className="text-xs font-semibold text-primary bg-surface px-2 py-0.5 rounded-full border border-primary/20">
                  {group.items.length} locations found
                </span>
              </div>
            )}

            <CardContent className="p-0 divide-y divide-border">
              {group.items.map((res) => {
                const locationParts = res.location
                  ? [res.location.room, res.location.area, res.location.position].filter(Boolean)
                  : []
                const locationText = locationParts.length > 0 ? locationParts.join(' → ') : null

                return (
                  <Link
                    key={res.item.id}
                    href={`/boxes/${res.box.id}`}
                    className="block p-4 hover:bg-surface-secondary/60 transition-colors group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-1.5 min-w-0 flex-1">
                        {/* Item Name & Quantity */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-text-primary group-hover:text-primary transition-colors truncate">
                            {res.item.name}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-secondary text-text-secondary shrink-0">
                            {res.item.quantity}x
                          </span>
                        </div>

                        {/* Box Code & Box Name */}
                        <div className="flex items-center gap-2 text-xs font-medium text-text-secondary">
                          <span className="font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
                            {res.box.box_code}
                          </span>
                          <span className="truncate">{res.box.name}</span>
                        </div>

                        {/* Physical Location Hierarchy */}
                        {locationText && (
                          <div className="text-xs text-text-muted flex items-center gap-1.5 pt-0.5 truncate">
                            <span>📍</span>
                            <span className="font-medium text-text-secondary truncate">{locationText}</span>
                          </div>
                        )}
                      </div>

                      {/* View Box CTA */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0"
                      >
                        <span className="hidden sm:inline">View Box</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}