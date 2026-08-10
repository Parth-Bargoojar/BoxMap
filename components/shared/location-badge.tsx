import { MapPin } from 'lucide-react'
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
      className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full bg-primary-soft text-primary-hover text-xs font-medium max-w-full truncate ${className}`}
    >
      <MapPin className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  )
}