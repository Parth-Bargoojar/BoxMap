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
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          Contents{' '}
          <span className="font-normal text-text-muted tabular-nums">({items.length})</span>
        </h2>
        {!isAddingInline && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingInline(true)}
            aria-label="Add item to box"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        )}
      </div>

      {/* Inline add form */}
      {isAddingInline && (
        <form
          onSubmit={handleCreateInline}
          className="glass space-y-3 rounded-2xl p-4 ring-1 ring-primary/25 shadow-glass"
        >
          <div className="flex items-center gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item name (e.g. Winter Gloves)"
              aria-label="New item name"
              autoFocus
              disabled={isSubmittingNew}
              className="flex-1 text-sm"
            />
            <Input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              aria-label="New item quantity"
              disabled={isSubmittingNew}
              className="w-[72px] text-center text-sm"
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

      {items.length === 0 && !isAddingInline ? (
        <div className="glass-subtle space-y-2 rounded-2xl px-6 py-10 text-center text-text-muted">
          <Package className="mx-auto h-8 w-8 stroke-[1.5]" />
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