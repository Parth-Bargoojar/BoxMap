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
      <div className="flex items-center gap-2 py-2 px-3 bg-surface-secondary rounded-lg border border-border">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          aria-label="Item name"
          disabled={isSaving}
          className="h-10 flex-1 text-sm bg-surface"
        />
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          aria-label="Item quantity"
          disabled={isSaving}
          className="h-10 w-16 text-sm text-center bg-surface"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save item changes"
          className="h-10 w-10 text-success hover:bg-success-soft"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleCancel}
          disabled={isSaving}
          aria-label="Cancel editing item"
          className="h-10 w-10 text-text-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-border bg-surface hover:bg-surface-secondary/50 transition-colors">
        <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
          <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-full bg-surface-secondary border border-border text-xs font-semibold text-text-secondary shrink-0">
            {item.quantity}x
          </span>
          <span className="text-sm font-medium text-text-primary truncate">{item.name}</span>
          {item.category && (
            <span className="text-xs text-text-muted bg-surface-secondary px-2 py-0.5 rounded-md shrink-0 hidden sm:inline">
              {item.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            aria-label={`Edit ${item.name}`}
            className="h-9 w-9 text-text-muted hover:text-text-primary"
            title="Edit item"
          >
            <Edit2 className="h-4 w-4" />
          </Button>

          {onMove && otherBoxes.length > 0 && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setSelectedBoxId(otherBoxes[0]?.id || '')
                setShowMoveModal(true)
              }}
              aria-label={`Move ${item.name} to another box`}
              className="h-9 w-9 text-text-muted hover:text-primary"
              title="Move item to another box"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            aria-label={`Delete ${item.name}`}
            className="h-9 w-9 text-text-muted hover:text-error"
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
        <DialogContent className="max-w-[420px]">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-text-primary">
              Move &quot;{item.name}&quot;
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              Select the destination box to move this item into:
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 space-y-2">
            <label htmlFor="dest-box-select" className="text-xs font-semibold text-text-secondary">
              Destination Box
            </label>
            <select
              id="dest-box-select"
              value={selectedBoxId}
              onChange={(e) => setSelectedBoxId(e.target.value)}
              disabled={isMoving}
              className="w-full h-11 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {otherBoxes.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.box_code} — {b.name}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
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