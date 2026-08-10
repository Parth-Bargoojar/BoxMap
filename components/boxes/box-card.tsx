import Link from 'next/link'
import Image from 'next/image'
import { BoxWithDetails } from '@/types'
import { LocationBadge } from '@/components/shared/location-badge'
import { Card, CardContent } from '@/components/ui/card'
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
    <Link href={`/boxes/${box.id}`} className="block group">
      <Card className="overflow-hidden border-border transition-all duration-200 group-hover:border-border-strong group-hover:shadow-md">
        <div className="relative aspect-[4/3] w-full bg-surface-secondary flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={box.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted gap-2">
              <Package className="h-10 w-10 stroke-[1.5]" />
              <span className="text-xs font-medium">No photo</span>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border text-xs font-semibold text-text-primary shadow-xs">
            {box.box_code}
          </div>
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
            {box.name}
          </h3>

          <div className="flex items-center justify-between gap-2 pt-1">
            <LocationBadge location={box.location} />
            <span className="text-xs font-medium text-text-muted shrink-0">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}