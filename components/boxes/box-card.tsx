import Link from 'next/link'
import Image from 'next/image'
import { BoxWithDetails } from '@/types'
import { LocationBadge } from '@/components/shared/location-badge'
import { Card } from '@/components/ui/card'
import { Package } from 'lucide-react'

interface BoxCardProps {
  box: BoxWithDetails
}

export function BoxCard({ box }: BoxCardProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const photoUrl = box.photo_path
    ? `${supabaseUrl}/storage/v1/object/public/box-photos/${box.photo_path}`
    : null

  const itemCount = box.items?.length || 0

  return (
    <Link
      href={`/boxes/${box.id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {/* gap-0 py-0 removes the card's default vertical padding so the photo sits flush. */}
      <Card className="gap-0 py-0 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-glass-lg">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-surface-secondary">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={box.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-text-muted">
              <Package className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">No photo</span>
            </div>
          )}

          <span className="glass-strong absolute top-3 left-3 rounded-full px-2.5 py-1 text-xs font-semibold text-text-primary shadow-glass">
            {box.box_code}
          </span>
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-1 font-semibold tracking-tight text-text-primary transition-colors group-hover:text-primary">
            {box.name}
          </h3>

          <div className="flex items-center justify-between gap-2">
            <LocationBadge location={box.location} />
            <span className="shrink-0 text-xs font-medium text-text-muted tabular-nums">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
