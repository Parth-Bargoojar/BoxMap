'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { compressImage } from '@/lib/utils/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Camera, Image as ImageIcon, Trash2, Plus, Loader2, AlertCircle } from 'lucide-react'

const ItemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Item name required'),
  quantity: z.number().min(1),
  category: z.string().optional(),
  notes: z.string().optional(),
})

const BoxFormSchema = z.object({
  name: z.string().min(1, 'Box name is required'),
  room: z.string().optional(),
  area: z.string().optional(),
  position: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(ItemFormSchema),
})

export type BoxFormValues = z.infer<typeof BoxFormSchema>

export interface BoxFormProps {
  initialValues?: {
    id?: string
    name?: string
    photo_path?: string | null
    room?: string
    area?: string
    position?: string
    notes?: string
    items?: Array<{ id?: string; name: string; quantity: number; category?: string; notes?: string }>
  }
  onSubmit: (data: {
    name: string
    photoFile: File | null
    removePhoto?: boolean
    room?: string
    area?: string
    position?: string
    notes?: string
    items: Array<{ id?: string; name: string; quantity: number; category?: string; notes?: string }>
  }) => Promise<void>
  isEditing?: boolean
}

export function BoxForm({ initialValues, onSubmit, isEditing = false }: BoxFormProps) {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initialValues?.photo_path
      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/box-photos/${initialValues.photo_path}`
      : null
  )
  const [removePhoto, setRemovePhoto] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const itemInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BoxFormValues>({
    resolver: zodResolver(BoxFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialValues?.name || '',
      room: initialValues?.room || '',
      area: initialValues?.area || '',
      position: initialValues?.position || '',
      notes: initialValues?.notes || '',
      items: initialValues?.items?.length
        ? initialValues.items
        : [{ name: '', quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsCompressing(true)
    try {
      const compressed = await compressImage(file)
      setPhotoFile(compressed)
      setPhotoPreview(URL.createObjectURL(compressed))
      setRemovePhoto(false)
    } catch {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    } finally {
      setIsCompressing(false)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    setRemovePhoto(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentVal = e.currentTarget.value.trim()
      if (currentVal !== '') {
        append({ name: '', quantity: 1 })
        setTimeout(() => {
          const nextInput = itemInputRefs.current[index + 1]
          if (nextInput) nextInput.focus()
        }, 50)
      }
    }
  }

  const handleFormSubmit: SubmitHandler<BoxFormValues> = async (values) => {
    setErrorMsg(null)
    try {
      const validItems = values.items.filter((i) => i.name.trim() !== '')
      await onSubmit({
        name: values.name.trim(),
        photoFile,
        removePhoto,
        room: values.room?.trim() || undefined,
        area: values.area?.trim() || undefined,
        position: values.position?.trim() || undefined,
        notes: values.notes?.trim() || undefined,
        items: validItems,
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. We couldn\'t save your box.'
      setErrorMsg(msg)
    }
  }

  const isLoading = isSubmitting || isCompressing

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-[640px] mx-auto pb-12">
      {errorMsg && (
        <div className="p-4 text-sm text-error bg-error-soft rounded-xl border border-error/20 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0 text-error mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold">Save failed</h4>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Box Photo */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-text-primary">Box Photo</Label>
        <Card className="border-dashed border-border bg-surface overflow-hidden">
          <CardContent className="p-4 sm:p-6 text-center">
            {photoPreview ? (
              <div className="space-y-3">
                <div className="relative aspect-[4/3] w-full max-w-[320px] mx-auto rounded-lg overflow-hidden border border-border">
                  <Image src={photoPreview} alt="Box photo preview" fill className="object-cover" />
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Change Photo
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemovePhoto}
                    disabled={isLoading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                  <Camera className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">Take a photo of your box</p>
                  <p className="text-xs text-text-muted mt-0.5">Use camera or choose from gallery</p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="gap-2 font-semibold"
                >
                  <ImageIcon className="h-4 w-4" />
                  Select Image
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </CardContent>
        </Card>
      </div>

      {/* 2. Box Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-text-primary">
          Box Name <span className="text-error">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. Winter Clothes, Holiday Decorations"
          disabled={isLoading}
          {...register('name')}
          className="h-11 rounded-lg"
        />
        {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
      </div>

      {/* 3. Location */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-surface">
        <Label className="text-sm font-semibold text-text-primary">Physical Location (Optional)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="room" className="text-xs text-text-secondary">Room</Label>
            <Input id="room" placeholder="Storage Room" disabled={isLoading} {...register('room')} className="h-10 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-xs text-text-secondary">Shelf / Area</Label>
            <Input id="area" placeholder="Shelf B" disabled={isLoading} {...register('area')} className="h-10 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-xs text-text-secondary">Position</Label>
            <Input id="position" placeholder="Bottom" disabled={isLoading} {...register('position')} className="h-10 text-sm" />
          </div>
        </div>
      </div>

      {/* 4. Items (Fast Entry) */}
      <div className="space-y-3 p-4 rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-semibold text-text-primary">Box Contents / Items</Label>
            <p className="text-xs text-text-muted">Press Enter on an item name to quickly add the next item</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', quantity: 1 })}
            disabled={isLoading}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {fields.map((field, index) => {
            const { ref, ...itemRegisterProps } = register(`items.${index}.name` as const)
            return (
              <div key={field.id} className="flex items-center gap-2">
                <Input
                  {...itemRegisterProps}
                  ref={(el) => {
                    ref(el)
                    itemInputRefs.current[index] = el
                  }}
                  placeholder={`Item ${index + 1} (e.g. Black jacket)`}
                  disabled={isLoading}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  className="h-10 flex-1 text-sm"
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  disabled={isLoading}
                  {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  className="h-10 w-20 text-sm text-center"
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                    className="h-10 w-10 text-text-muted hover:text-error shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-semibold text-text-primary">Notes (Optional)</Label>
        <Textarea
          id="notes"
          placeholder="Additional details about this box..."
          rows={3}
          disabled={isLoading}
          {...register('notes')}
          className="rounded-lg text-sm"
        />
      </div>

      {/* 6. Save CTA */}
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold rounded-xl"
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving Box...
          </>
        ) : (
          isEditing ? 'Save Changes' : 'Save Box'
        )}
      </Button>
    </form>
  )
}