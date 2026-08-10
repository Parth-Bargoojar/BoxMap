'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BoxWithDetails, Box } from '@/types'
import { getBox, getBoxes, deleteBox } from '@/lib/services/boxes'
import { createItem, updateItem, deleteItem, moveItem } from '@/lib/services/items'
import PageContainer from '@/components/layout/page-container'
import { LocationBadge } from '@/components/shared/location-badge'
import { ItemList } from '@/components/items/item-list'
import { ConfirmationDialog } from '@/components/shared/confirmation-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit2, MoreVertical, Trash2, ArrowLeft, Package, Calendar } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BoxDetailsPageProps {
  params: Promise<{ boxId: string }>
}

export default function BoxDetailsPage({ params }: BoxDetailsPageProps) {
  const { boxId } = use(params)
  const router = useRouter()

  const [box, setBox] = useState<BoxWithDetails | null>(null)
  const [allUserBoxes, setAllUserBoxes] = useState<Box[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showDeleteBoxModal, setShowDeleteBoxModal] = useState(false)
  const [isDeletingBox, setIsDeletingBox] = useState(false)

  const refreshData = async () => {
    try {
      const data = await getBox(boxId)
      setBox(data)

      const { boxes } = await getBoxes({ limit: 100 })
      setAllUserBoxes(boxes)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Box not found.'
      setError(msg)
    }
  }

  useEffect(() => {
    let isMounted = true
    async function loadInitialData() {
      try {
        const data = await getBox(boxId)
        if (isMounted) setBox(data)

        const { boxes } = await getBoxes({ limit: 100 })
        if (isMounted) setAllUserBoxes(boxes)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Box not found.'
        if (isMounted) setError(msg)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadInitialData()
    return () => {
      isMounted = false
    }
  }, [boxId])

  const handleAddItem = async (itemData: { boxId: string; name: string; quantity: number }) => {
    await createItem(itemData)
    toast.success('Item added')
    await refreshData()
  }

  const handleUpdateItem = async (itemId: string, updates: { name: string; quantity: number }) => {
    await updateItem({ itemId, ...updates })
    toast.success('Item updated')
    await refreshData()
  }

  const handleDeleteItem = async (itemId: string) => {
    await deleteItem(itemId)
    toast.success('Item deleted')
    await refreshData()
  }

  const handleMoveItem = async (itemId: string, destinationBoxId: string) => {
    await moveItem(itemId, destinationBoxId)
    toast.success('Item moved successfully!')
    await refreshData()
  }

  const handleDeleteBoxConfirm = async () => {
    if (!box) return
    setIsDeletingBox(true)
    try {
      await deleteBox(box.id)
      toast.success(`Delete ${box.box_code} completed`)
      router.push('/boxes')
      router.refresh()
    } catch {
      toast.error('Could not delete box')
    } finally {
      setIsDeletingBox(false)
      setShowDeleteBoxModal(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="py-12 text-center space-y-3">
          <Package className="h-8 w-8 animate-bounce mx-auto text-primary" />
          <p className="text-sm text-text-muted">Loading box details...</p>
        </div>
      </PageContainer>
    )
  }

  if (error || !box) {
    return (
      <PageContainer>
        <div className="py-12 text-center space-y-4">
          <h2 className="text-xl font-bold text-text-primary">Box Not Found</h2>
          <p className="text-sm text-text-secondary">{error}</p>
          <Link href="/boxes">
            <Button variant="outline">Back to Boxes</Button>
          </Link>
        </div>
      </PageContainer>
    )
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const photoUrl = box.photo_path
    ? `${supabaseUrl}/storage/v1/object/public/box-photos/${box.photo_path}`
    : null

  const formattedDate = new Date(box.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <PageContainer>
      <div className="space-y-6 max-w-[720px] mx-auto pb-12">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/boxes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Boxes
          </Link>

          {/* Action Row per Design.md 10.5 */}
          <div className="flex items-center gap-2">
            <Link href={`/boxes/${box.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-1.5 font-semibold">
                <Edit2 className="h-3.5 w-3.5" />
                Edit Box
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none">
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteBoxModal(true)}
                  className="text-error focus:text-error cursor-pointer gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Box
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 4:3 Photo */}
        <div className="relative aspect-[4/3] w-full rounded-2xl bg-surface-secondary border border-border overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={box.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-text-muted gap-2">
              <Package className="h-12 w-12 stroke-[1.5]" />
              <span className="text-sm font-medium">No photo uploaded</span>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border text-sm font-bold text-text-primary shadow-xs">
            {box.box_code}
          </div>
        </div>

        {/* Box Meta Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {box.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Created {formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Location Badge (Visually Prominent) */}
          {box.location && (
            <div className="pt-1">
              <LocationBadge location={box.location} />
            </div>
          )}

          {/* Notes Section */}
          {box.notes && (
            <Card className="bg-surface-secondary/50 border-border">
              <CardContent className="p-4 text-sm text-text-secondary">
                <span className="font-semibold text-text-primary block mb-1">Notes</span>
                {box.notes}
              </CardContent>
            </Card>
          )}
        </div>

        <hr className="border-border" />

        {/* Item List with inline Add/Edit/Move/Delete (PRD Flow 4 & 5) */}
        <ItemList
          items={box.items}
          boxId={box.id}
          allBoxes={allUserBoxes}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
          onMoveItem={handleMoveItem}
        />
      </div>

      {/* Delete Box Confirmation Dialog (PRD Flow 6 & Design.md 9.8) */}
      <ConfirmationDialog
        open={showDeleteBoxModal}
        onOpenChange={setShowDeleteBoxModal}
        title={`Delete ${box.box_code}?`}
        description="This will permanently remove the box and its inventory."
        confirmLabel="Delete Box"
        onConfirm={handleDeleteBoxConfirm}
        isLoading={isDeletingBox}
      />
    </PageContainer>
  )
}