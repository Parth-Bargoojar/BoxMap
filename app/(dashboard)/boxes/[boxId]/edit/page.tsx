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
        <div className="py-12 text-center space-y-3">
          <Package className="h-8 w-8 animate-bounce mx-auto text-primary" />
          <p className="text-sm text-text-muted">Loading box for editing...</p>
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

  return (
    <PageContainer>
      <div className="space-y-6 max-w-[640px] mx-auto pb-12">
        <div className="flex items-center justify-between">
          <Link
            href={`/boxes/${boxId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel and Return
          </Link>

          <span className="text-xs font-bold text-text-muted">{box.box_code}</span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Edit {box.box_code}
          </h1>
          <p className="text-sm text-text-secondary">Update box name, location, photo, or notes</p>
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