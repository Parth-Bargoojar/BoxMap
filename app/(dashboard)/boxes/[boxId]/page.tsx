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
        <div className="glass mx-auto max-w-[720px] space-y-3 rounded-2xl py-16 text-center shadow-glass">
          <Package className="mx-auto h-8 w-8 animate-bounce text-primary" />
          <p className="text-sm text-text-muted">Loading box details...</p>
        </div>
      </PageContainer>
    )
  }

  if (error || !box) {
    return (
      <PageContainer>
        <div className="glass mx-auto max-w-[480px] space-y-4 rounded-2xl px-6 py-14 text-center shadow-glass">
          <h2 className="text-xl font-semibold tracking-tight text-text-primary">
            Box not found
          </h2>
          <p className="text-sm text-text-secondary">{error}</p>
          <Link href="/boxes" className="inline-block">
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
      <div className="mx-auto max-w-[720px] space-y-6">
        {/* Back link + box-level actions */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/boxes"
            className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Boxes
          </Link>

          <div className="flex items-center gap-2">
            <Link href={`/boxes/${box.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-1.5 font-semibold">
                <Edit2 className="h-3.5 w-3.5" />
                Edit Box
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="More box actions"
                className="glass-field inline-flex h-9 w-9 items-center justify-center rounded-lg border border-glass-hairline text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <MoreVertical className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowDeleteBoxModal(true)}
                  className="cursor-pointer gap-2 text-error focus:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Box
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Photo — floats above the page with its own elevation */}
        <div className="glass relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl shadow-glass-lg">
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
            <div className="flex flex-col items-center justify-center gap-2 text-text-muted">
              <Package className="h-12 w-12 stroke-[1.5]" />
              <span className="text-sm font-medium">No photo uploaded</span>
            </div>
          )}

          <span className="glass-strong absolute top-4 left-4 rounded-full px-3 py-1.5 text-sm font-semibold text-text-primary shadow-glass">
            {box.box_code}
          </span>
        </div>

        {/* Box meta */}
        <div className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
              {box.name}
            </h1>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created {formattedDate}</span>
            </div>
          </div>

          {box.location && (
            <div className="pt-0.5">
              <LocationBadge location={box.location} />
            </div>
          )}

          {box.notes && (
            <Card className="shadow-glass">
              <CardContent className="text-sm text-text-secondary">
                <span className="mb-1 block text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Notes
                </span>
                {box.notes}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contents — inline add/edit/move/delete */}
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