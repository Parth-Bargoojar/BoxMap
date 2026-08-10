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
  icon = <Package className="h-8 w-8 text-text-muted stroke-[1.5]" />,
  title = 'Your storage is empty',
  description = 'Add your first box to start building your storage map.',
  actionLabel = 'Add Box',
  actionHref = '/boxes/new',
  onAction,
}: EmptyStateProps) {
  return (
    <div className="mx-auto flex max-w-[380px] flex-col items-center justify-center space-y-5 p-8 text-center">
      <div className="glass-subtle flex h-16 w-16 items-center justify-center rounded-2xl shadow-glass">
        {icon}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-text-primary">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>

      {actionLabel &&
        (actionHref ? (
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
        ))}
    </div>
  )
}
