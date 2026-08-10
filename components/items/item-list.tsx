'use client'

import { useState } from 'react'
import { Item, Box } from '@/types'
import { ItemRow } from './item-row'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Loader2, Package } from 'lucide-react'

interface ItemListProps {
  items: Item[]
  boxId: string
  allBoxes?: Box[]
  onAddItem: (itemData: { boxId: string; name: string; quantity: number }) => Promise<void>
  onUpdateItem: (itemId: string, updates: { name: string; quantity: number }) => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
  onMoveItem?: (itemId: string, destinationBoxId: string) => Promise<void>
}

export function ItemList({
  items,
  boxId,
  allBoxes = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onMoveItem,
}: ItemListProps) {
  const [isAddingInline, setIsAddingInline] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQuantity, setNewQuantity] = useState(1)
  const [isSubmittingNew, setIsSubmittingNew] = useState(false)

  const handleCreateInline = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setIsSubmittingNew(true)
    try {
      await onAddItem({
        boxId,
        name: newName.trim(),
        quantity: Number(newQuantity) || 1,
      })
      setNewName('')
      setNewQuantity(1)
      setIsAddingInline(false)
    } finally {
      setIsSubmittingNew(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-text-primary">
          Box Contents ({items.length})
        </h3>
        {!isAddingInline && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingInline(true)}
            aria-label="Add item to box"
            className="gap-1.5 min-h-[36px]"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Inline Lightweight Add Item Form (PRD Flow 4) */}
      {isAddingInline && (
        <form onSubmit={handleCreateInline} className="p-3 bg-surface-secondary rounded-xl border border-primary/30 space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item name (e.g. Winter Gloves)"
              aria-label="New item name"
              autoFocus
              disabled={isSubmittingNew}
              className="h-10 flex-1 text-sm bg-surface"
            />
            <Input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="New item quantity"
              disabled={isSubmittingNew}
              className="h-10 w-20 text-sm text-center bg-surface"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddingInline(false)}
              disabled={isSubmittingNew}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!newName.trim() || isSubmittingNew}>
              {isSubmittingNew && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save Item
            </Button>
          </div>
        </form>
      )}

      {/* Items List */}
      {items.length === 0 && !isAddingInline ? (
        <div className="p-6 text-center rounded-xl border border-dashed border-border bg-surface text-text-muted space-y-2">
          <Package className="h-8 w-8 mx-auto stroke-[1.5]" />
          <p className="text-sm">No items logged in this box yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              allBoxes={allBoxes}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
              onMove={onMoveItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}