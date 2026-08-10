'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BoxWithDetails } from '@/types'
import { getBox, updateBox } from '@/lib/services/boxes'
import PageContainer from '@/components/layout/page-container'
import { BoxForm, BoxFormProps } from '@/components/boxes/box-form'
import { Button } from '@/components/ui/button'
import { Package, ArrowLeft } from 'lucide-react'

interface EditBoxPageProps {
  params: Promise<{ boxId: string }>
}

export default function EditBoxPage({ params }: EditBoxPageProps) {
  const { boxId } = use(params)
  const router = useRouter()

  const [box, setBox] = useState<BoxWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBox() {
      try {
        setLoading(true)
        const data = await getBox(boxId)
        setBox(data)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Box not found.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    fetchBox()
  }, [boxId])

  const handleSubmit: BoxFormProps['onSubmit'] = async (data) => {
    await updateBox({
      boxId,
      name: data.name,
      photo: data.photoFile,
      room: data.room,
      area: data.area,
      position: data.position,
      notes: data.notes,
    })

    toast.success('Box updated successfully!')
    router.push(`/boxes/${boxId}`)
    router.refresh()
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="glass mx-auto max-w-[640px] space-y-3 rounded-2xl py-16 text-center shadow-glass">
          <Package className="mx-auto h-8 w-8 animate-bounce text-primary" />
          <p className="text-sm text-text-muted">Loading box for editing...</p>
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

  return (
    <PageContainer>
      <div className="mx-auto max-w-[640px] space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/boxes/${boxId}`}
            className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel and Return
          </Link>

          <span className="glass-subtle rounded-full px-2.5 py-1 text-xs font-semibold text-text-secondary">
            {box.box_code}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Edit {box.box_code}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Update box name, location, photo, or notes
          </p>
        </div>

        <BoxForm
          isEditing
          initialValues={{
            id: box.id,
            name: box.name,
            photo_path: box.photo_path,
            room: box.location?.room || '',
            area: box.location?.area || '',
            position: box.location?.position || '',
            notes: box.notes || '',
            items: box.items.map((i) => ({
              id: i.id,
              name: i.name,
              quantity: i.quantity,
              category: i.category || '',
              notes: i.notes || '',
            })),
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </PageContainer>
  )
}