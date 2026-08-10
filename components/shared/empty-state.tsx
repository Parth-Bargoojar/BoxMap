import React from 'react'
import Link from 'next/link'
import { Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon = <Package className="h-10 w-10 text-text-muted" />,
  title = 'Your storage is empty',
  description = 'Add your first box to start building your storage map.',
  actionLabel = 'Add Box',
  actionHref = '/boxes/new',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 max-w-[360px] mx-auto space-y-4">
      <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mb-1">
        {icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      {actionLabel && (
        actionHref ? (
          <Link href={actionHref}>
            <Button className="gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} className="gap-2 font-semibold">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )
      )}
    </div>
  )
}