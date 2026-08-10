import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { Box, BoxWithDetails, CreateBoxInput, UpdateBoxInput, ServiceError, Item, Location } from '@/types'
import { BoxSchema } from '@/lib/validation/box.schema'
import { generateNextBoxCode } from '@/lib/utils/box-code'

export async function createBox(input: CreateBoxInput, client?: unknown): Promise<BoxWithDetails> {
  const validationResult = BoxSchema.safeParse(input)
  if (!validationResult.success) {
    const errorMsg = validationResult.error.issues.map((i) => i.message).join(', ')
    throw new ServiceError(`Invalid box input: ${errorMsg}`)
  }

  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new ServiceError('You must be logged in to create a box.')
  }

  const { data: existingBoxes, error: fetchCodesError } = await supabase
    .from('boxes')
    .select('box_code')
    .eq('user_id', user.id)

  if (fetchCodesError) {
    throw new ServiceError('Could not verify existing box codes.')
  }

  const boxCode = generateNextBoxCode((existingBoxes || []).map((b) => b.box_code))

  let locationId: string | null = null
  const { room, area, position } = input
  if (room || area || position) {
    const { data: locData, error: locError } = await supabase
      .from('locations')
      .insert({
        user_id: user.id,
        room: room || null,
        area: area || null,
        position: position || null,
      })
      .select('id')
      .single()

    if (locError) {
      throw new ServiceError('Could not save physical location.')
    }
    locationId = locData.id
  }

  const { data: boxRecord, error: boxError } = await supabase
    .from('boxes')
    .insert({
      user_id: user.id,
      box_code: boxCode,
      name: input.name,
      location_id: locationId,
      notes: input.notes || null,
    })
    .select('*')
    .single()

  if (boxError || !boxRecord) {
    throw new ServiceError('Could not create box record.')
  }

  let photoPath: string | null = null

  if (input.photo) {
    const filename = `photo-${Date.now()}.webp`
    const path = `${user.id}/${boxRecord.id}/${filename}`
    const { error: uploadError } = await supabase.storage
      .from('box-photos')
      .upload(path, input.photo, { contentType: 'image/webp', upsert: true })

    if (!uploadError) {
      photoPath = path
      await supabase.from('boxes').update({ photo_path: photoPath }).eq('id', boxRecord.id)
    }
  }

  const itemsToInsert = (input.items || []).map((item) => ({
    user_id: user.id,
    box_id: boxRecord.id,
    name: item.name,
    quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
    category: item.category || null,
    notes: item.notes || null,
  }))

  let insertedItems: Item[] = []
  if (itemsToInsert.length > 0) {
    const { data: itemsData, error: itemsError } = await supabase
      .from('items')
      .insert(itemsToInsert)
      .select('*')

    if (itemsError) {
      throw new ServiceError('Box was created, but items could not be saved.')
    }
    insertedItems = (itemsData || []) as Item[]
  }

  const { data: finalBox, error: finalError } = await supabase
    .from('boxes')
    .select('*, locations(*), items(*)')
    .eq('id', boxRecord.id)
    .single()

  if (finalError || !finalBox) {
    return {
      ...(boxRecord as Box),
      photo_path: photoPath,
      location: null,
      items: insertedItems,
    }
  }

  const rawBox = finalBox as unknown as Box & { locations: Location | null; items: Item[] }
  return {
    id: rawBox.id,
    user_id: rawBox.user_id,
    box_code: rawBox.box_code,
    name: rawBox.name,
    photo_path: rawBox.photo_path,
    location_id: rawBox.location_id,
    notes: rawBox.notes,
    created_at: rawBox.created_at,
    updated_at: rawBox.updated_at,
    location: rawBox.locations || null,
    items: rawBox.items || [],
  }
}

export async function getBoxes(
  options?: {
    sort?: 'newest' | 'oldest' | 'name' | 'updated'
    page?: number
    limit?: number
  },
  client?: unknown
): Promise<{ boxes: BoxWithDetails[]; total: number }> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { boxes: [], total: 0 }
  }

  const page = options?.page || 1
  const limit = options?.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('boxes')
    .select('*, locations(*), items(*)', { count: 'exact' })
    .eq('user_id', user.id)

  switch (options?.sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    case 'updated':
      query = query.order('updated_at', { ascending: false })
      break
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false })
      break
  }

  const { data, count, error } = await query.range(from, to)

  if (error) {
    throw new ServiceError('Could not fetch boxes from database.')
  }

  const boxes: BoxWithDetails[] = (data || []).map((b) => {
    const raw = b as unknown as Box & { locations: Location | null; items: Item[] }
    return {
      id: raw.id,
      user_id: raw.user_id,
      box_code: raw.box_code,
      name: raw.name,
      photo_path: raw.photo_path,
      location_id: raw.location_id,
      notes: raw.notes,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      location: raw.locations || null,
      items: raw.items || [],
    }
  })

  return {
    boxes,
    total: count || 0,
  }
}

export async function getBox(boxId: string, client?: unknown): Promise<BoxWithDetails> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to view this box.')
  }

  const { data, error } = await supabase
    .from('boxes')
    .select('*, locations(*), items(*)')
    .eq('id', boxId)
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    throw new ServiceError('Box not found.')
  }

  const raw = data as unknown as Box & { locations: Location | null; items: Item[] }
  return {
    id: raw.id,
    user_id: raw.user_id,
    box_code: raw.box_code,
    name: raw.name,
    photo_path: raw.photo_path,
    location_id: raw.location_id,
    notes: raw.notes,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    location: raw.locations || null,
    items: raw.items || [],
  }
}

export async function updateBox(input: UpdateBoxInput, client?: unknown): Promise<Box> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to update a box.')
  }

  const { boxId, name, photo, room, area, position, notes } = input

  const { data: currentBox, error: fetchError } = await supabase
    .from('boxes')
    .select('*, locations(*)')
    .eq('id', boxId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !currentBox) {
    throw new ServiceError('Box not found or permission denied.')
  }

  const rawCurrent = currentBox as unknown as Box & { locations: Location | null }
  let locationId = rawCurrent.location_id

  if (room !== undefined || area !== undefined || position !== undefined) {
    if (locationId) {
      await supabase
        .from('locations')
        .update({
          room: room !== undefined ? room : rawCurrent.locations?.room || null,
          area: area !== undefined ? area : rawCurrent.locations?.area || null,
          position: position !== undefined ? position : rawCurrent.locations?.position || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', locationId)
    } else if (room || area || position) {
      const { data: newLoc } = await supabase
        .from('locations')
        .insert({
          user_id: user.id,
          room: room || null,
          area: area || null,
          position: position || null,
        })
        .select('id')
        .single()

      if (newLoc) locationId = newLoc.id
    }
  }

  let photoPath = rawCurrent.photo_path

  if (photo) {
    const filename = `photo-${Date.now()}.webp`
    const newPath = `${user.id}/${boxId}/${filename}`
    const { error: uploadError } = await supabase.storage
      .from('box-photos')
      .upload(newPath, photo, { contentType: 'image/webp', upsert: true })

    if (!uploadError) {
      if (rawCurrent.photo_path) {
        await supabase.storage.from('box-photos').remove([rawCurrent.photo_path])
      }
      photoPath = newPath
    }
  }

  const updates: Partial<Box> = {
    updated_at: new Date().toISOString(),
  }
  if (name !== undefined) updates.name = name
  if (notes !== undefined) updates.notes = notes
  if (locationId !== rawCurrent.location_id) updates.location_id = locationId
  if (photoPath !== rawCurrent.photo_path) updates.photo_path = photoPath

  const { data: updatedBox, error: updateError } = await supabase
    .from('boxes')
    .update(updates)
    .eq('id', boxId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (updateError || !updatedBox) {
    throw new ServiceError('Could not update box details.')
  }

  return updatedBox as Box
}

export async function deleteBox(boxId: string, client?: unknown): Promise<boolean> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to delete a box.')
  }

  const { data: box } = await supabase
    .from('boxes')
    .select('photo_path')
    .eq('id', boxId)
    .eq('user_id', user.id)
    .single()

  const { error } = await supabase.from('boxes').delete().eq('id', boxId).eq('user_id', user.id)

  if (error) {
    throw new ServiceError('Could not delete box.')
  }

  if (box?.photo_path) {
    await supabase.storage.from('box-photos').remove([box.photo_path])
  }

  return true
}