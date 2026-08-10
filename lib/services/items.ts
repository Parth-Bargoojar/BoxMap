import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { Item, ServiceError } from '@/types'
import { ItemSchema } from '@/lib/validation/item.schema'

export interface CreateItemInput {
  boxId: string
  name: string
  quantity?: number
  category?: string | null
  notes?: string | null
}

export interface UpdateItemInput {
  itemId: string
  name?: string
  quantity?: number
  category?: string | null
  notes?: string | null
}

export async function createItem(input: CreateItemInput, client?: unknown): Promise<Item> {
  const validationResult = ItemSchema.safeParse(input)
  if (!validationResult.success) {
    const errorMsg = validationResult.error.issues.map((i) => i.message).join(', ')
    throw new ServiceError(`Invalid item input: ${errorMsg}`)
  }

  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to create an item.')
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      user_id: user.id,
      box_id: input.boxId,
      name: input.name,
      quantity: input.quantity && input.quantity > 0 ? input.quantity : 1,
      category: input.category || null,
      notes: input.notes || null,
    })
    .select('*')
    .single()

  if (error || !data) {
    throw new ServiceError('Could not create item.')
  }

  return data as Item
}

export async function updateItem(input: UpdateItemInput, client?: unknown): Promise<Item> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to update an item.')
  }

  const updates: Partial<Item> = {
    updated_at: new Date().toISOString(),
  }

  if (input.name !== undefined) updates.name = input.name
  if (input.quantity !== undefined) updates.quantity = input.quantity
  if (input.category !== undefined) updates.category = input.category
  if (input.notes !== undefined) updates.notes = input.notes

  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', input.itemId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new ServiceError('Could not update item.')
  }

  return data as Item
}

export async function deleteItem(itemId: string, client?: unknown): Promise<boolean> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to delete an item.')
  }

  const { error } = await supabase.from('items').delete().eq('id', itemId).eq('user_id', user.id)

  if (error) {
    throw new ServiceError('Could not delete item.')
  }

  return true
}

export async function moveItem(itemId: string, destinationBoxId: string, client?: unknown): Promise<Item> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to move an item.')
  }

  const { data: destBox, error: destError } = await supabase
    .from('boxes')
    .select('id')
    .eq('id', destinationBoxId)
    .eq('user_id', user.id)
    .single()

  if (destError || !destBox) {
    throw new ServiceError('Destination box not found or permission denied.')
  }

  const { data, error } = await supabase
    .from('items')
    .update({
      box_id: destinationBoxId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .eq('user_id', user.id)
    .select('*')
    .single()

  if (error || !data) {
    throw new ServiceError('Could not move item to destination box.')
  }

  return data as Item
}