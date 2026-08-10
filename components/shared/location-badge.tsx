import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Location } from '@/types'

interface LocationBadgeProps {
  location?: Location | null
  className?: string
}

export function LocationBadge({ location, className = '' }: LocationBadgeProps) {
  if (!location) return null

  const parts = [location.room, location.area, location.position].filter(Boolean)
  if (parts.length === 0) return null

  const label = parts.join(' · ')

  return (
    <div
      className={cn(
        'inline-flex h-7 max-w-full items-center gap-1.5 truncate rounded-full border border-primary/15 bg-primary-soft/70 px-2.5 text-xs font-medium text-primary-hover backdrop-blur-sm',
        className
      )}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  )
}
