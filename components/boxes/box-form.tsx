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

  // Separate inputs: `capture` forces the camera, which would otherwise make
  // "choose from gallery" impossible on mobile.
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
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
    if (cameraInputRef.current) cameraInputRef.current.value = ''
    if (galleryInputRef.current) galleryInputRef.current.value = ''
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
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto max-w-[640px] space-y-5"
    >
      {errorMsg && (
        <div
          className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error-soft/80 p-4 text-sm text-error backdrop-blur-sm"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
          <div className="flex-1">
            <h4 className="font-semibold">Save failed</h4>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 1. Photo */}
      <div className="glass rounded-2xl p-5 shadow-glass">
        {photoPreview ? (
          <div className="space-y-4">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[360px] overflow-hidden rounded-xl border border-glass-hairline shadow-glass">
              <Image src={photoPreview} alt="Box photo preview" fill className="object-cover" />
            </div>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
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
          <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-border-strong/60 px-4 py-8 text-center">
            <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl text-primary shadow-glass">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Add a photo of your box</p>
              <p className="mt-0.5 text-xs text-text-muted">
                It makes boxes far easier to recognise later
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isLoading}
                className="gap-2 font-semibold sm:hidden"
              >
                <Camera className="h-4 w-4" />
                Take Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isLoading}
                className="gap-2 font-semibold"
              >
                <ImageIcon className="h-4 w-4" />
                Choose Image
              </Button>
            </div>
          </div>
        )}

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handlePhotoSelect}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoSelect}
        />
      </div>

      {/* 2. Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-text-primary">
          Box Name <span className="text-error">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g. Winter Clothes, Holiday Decorations"
          disabled={isLoading}
          aria-invalid={errors.name ? true : undefined}
          {...register('name')}
          className="h-12 rounded-xl text-base"
        />
        {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
      </div>

      {/* 3. Location */}
      <div className="glass space-y-3 rounded-2xl p-5 shadow-glass">
        <div>
          <Label className="text-sm font-semibold text-text-primary">Physical Location</Label>
          <p className="mt-0.5 text-xs text-text-muted">Optional — where the box physically lives</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="room" className="text-xs text-text-secondary">Room</Label>
            <Input id="room" placeholder="Storage Room" disabled={isLoading} {...register('room')} className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="area" className="text-xs text-text-secondary">Shelf / Area</Label>
            <Input id="area" placeholder="Shelf B" disabled={isLoading} {...register('area')} className="text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="position" className="text-xs text-text-secondary">Position</Label>
            <Input id="position" placeholder="Bottom" disabled={isLoading} {...register('position')} className="text-sm" />
          </div>
        </div>
      </div>

      {/* 4. Items (fast entry) */}
      <div className="glass space-y-4 rounded-2xl p-5 shadow-glass">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Label className="text-sm font-semibold text-text-primary">Box Contents</Label>
            <p className="mt-0.5 text-xs text-text-muted">
              Press Enter to jump to the next item
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ name: '', quantity: 1 })}
            disabled={isLoading}
            className="shrink-0 gap-1.5"
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
                  aria-label={`Item ${index + 1} name`}
                  disabled={isLoading}
                  onKeyDown={(e) => handleItemKeyDown(e, index)}
                  className="flex-1 text-sm"
                />
                <Input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  aria-label={`Item ${index + 1} quantity`}
                  disabled={isLoading}
                  {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                  className="w-[72px] text-center text-sm"
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    disabled={isLoading}
                    aria-label={`Remove item ${index + 1}`}
                    className="shrink-0 text-text-muted hover:bg-error-soft hover:text-error"
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
        <Label htmlFor="notes" className="text-sm font-semibold text-text-primary">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="Additional details about this box..."
          rows={3}
          disabled={isLoading}
          {...register('notes')}
          className="rounded-xl text-sm"
        />
      </div>

      {/* 6. Save */}
      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-xl text-base font-semibold shadow-glass-lg"
        disabled={!isValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving Box...
          </>
        ) : isEditing ? (
          'Save Changes'
        ) : (
          'Save Box'
        )}
      </Button>
    </form>
  )
}