'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import PageContainer from '@/components/layout/page-container'
import { BoxForm, BoxFormProps } from '@/components/boxes/box-form'
import { createBox } from '@/lib/services/boxes'

export default function AddBoxPage() {
  const router = useRouter()

  const handleSubmit: BoxFormProps['onSubmit'] = async (data) => {
    const newBox = await createBox({
      name: data.name,
      photo: data.photoFile,
      room: data.room,
      area: data.area,
      position: data.position,
      notes: data.notes,
      items: data.items,
    })

    toast.success(`Box ${newBox.box_code} created successfully!`)
    router.push(`/boxes/${newBox.id}`)
    router.refresh()
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Add New Box
          </h1>
          <p className="text-sm text-text-secondary">
            Create a physical box record and log its contents
          </p>
        </div>

        <BoxForm onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  )
}