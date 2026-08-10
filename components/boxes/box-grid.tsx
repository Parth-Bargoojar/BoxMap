import { BoxWithDetails } from '@/types'
import { BoxCard } from './box-card'

interface BoxGridProps {
  boxes: BoxWithDetails[]
}

export function BoxGrid({ boxes }: BoxGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {boxes.map((box) => (
        <BoxCard key={box.id} box={box} />
      ))}
    </div>
  )
}