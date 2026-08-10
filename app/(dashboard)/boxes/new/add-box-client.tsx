'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { BoxForm, BoxFormProps } from '@/components/boxes/box-form'
import { createBox } from '@/lib/services/boxes'

export default function AddBoxClient() {
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

  return <BoxForm onSubmit={handleSubmit} />
}
