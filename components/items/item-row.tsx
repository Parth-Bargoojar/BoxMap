'use client'

import { useState } from 'react'
import { Item, Box } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { Edit2, Trash2, ArrowRightLeft, Check, X, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ItemRowProps {
  item: Item
  allBoxes?: Box[]
  onUpdate: (itemId: string, updates: { name: string; quantity: number }) => Promise<void>
  onDelete: (itemId: string) => Promise<void>
  onMove?: (itemId: string, destinationBoxId: string) => Promise<void>
}

export function ItemRow({ item, allBoxes = [], onUpdate, onDelete, onMove }: ItemRowProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(item.name)
  const [quantity, setQuantity] = useState(item.quantity)
  const [isSaving, setIsSaving] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [showMoveModal, setShowMoveModal] = useState(false)
  const [selectedBoxId, setSelectedBoxId] = useState('')
  const [isMoving, setIsMoving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) return
    setIsSaving(true)
    try {
      await onUpdate(item.id, { name: name.trim(), quantity: Number(quantity) || 1 })
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setName(item.name)
    setQuantity(item.quantity)
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete(item.id)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleMoveConfirm = async () => {
    if (!selectedBoxId || !onMove) return
    setIsMoving(true)
    try {
      await onMove(item.id, selectedBoxId)
      setShowMoveModal(false)
    } finally {
      setIsMoving(false)
    }
  }

  const otherBoxes = allBoxes.filter((b) => b.id !== item.box_id)

  if (isEditing) {
    return (
      <div className="glass flex items-center gap-2 rounded-xl p-2 shadow-glass ring-1 ring-primary/25">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          aria-label="Item name"
          disabled={isSaving}
          className="flex-1 text-sm"
        />
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          aria-label="Item quantity"
          disabled={isSaving}
          className="w-[64px] text-center text-sm"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save item changes"
          className="shrink-0 text-success hover:bg-success-soft hover:text-success"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          aria-label="Cancel editing item"
          className="shrink-0 text-text-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="glass group flex items-center justify-between rounded-xl px-3 py-2.5 shadow-glass transition-all duration-200 hover:shadow-glass-lg">
        <div className="flex min-w-0 flex-1 items-center gap-3 pr-2">
          <span className="glass-subtle inline-flex h-6 min-w-[26px] shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-text-secondary tabular-nums">
            {item.quantity}&times;
          </span>
          <span className="truncate text-sm font-medium text-text-primary">{item.name}</span>
          {item.category && (
            <span className="glass-subtle hidden shrink-0 rounded-md px-2 py-0.5 text-xs text-text-muted sm:inline">
              {item.category}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${item.name}`}
            className="text-text-muted hover:text-text-primary"
            title="Edit item"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {onMove && otherBoxes.length > 0 && (
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setSelectedBoxId(otherBoxes[0]?.id || '')
                setShowMoveModal(true)
              }}
              aria-label={`Move ${item.name} to another box`}
              className="text-text-muted hover:text-primary"
              title="Move item to another box"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete ${item.name}`}
            className="text-text-muted hover:bg-error-soft hover:text-error"
            title="Delete item"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Delete Item Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Item"
        description={`Are you sure you want to delete "${item.name}" from this box?`}
        confirmLabel="Delete Item"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />

      {/* Move Item Dialog (PRD Section 11 & Flow 5) */}
      <Dialog open={showMoveModal} onOpenChange={setShowMoveModal}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader className="space-y-2">
            <DialogTitle>Move &quot;{item.name}&quot;</DialogTitle>
            <DialogDescription>
              Select the destination box to move this item into:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="dest-box-select" className="text-xs font-semibold text-text-secondary">
              Destination Box
            </label>
            <select
              id="dest-box-select"
              value={selectedBoxId}
              onChange={(e) => setSelectedBoxId(e.target.value)}
              disabled={isMoving}
              className="glass-field h-11 w-full rounded-lg border border-glass-hairline px-3 text-sm text-text-primary focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
            >
              {otherBoxes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.box_code} — {b.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveModal(false)} disabled={isMoving}>
              Cancel
            </Button>
            <Button onClick={handleMoveConfirm} disabled={!selectedBoxId || isMoving}>
              {isMoving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Move Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}