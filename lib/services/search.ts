import { createClient } from '@/lib/supabase/client'
import { Item, Box, Location, ServiceError } from '@/types'

export interface SearchResultItem {
  item: Item
  box: Box
  location: Location | null
}

export async function searchItems(
  query: string,
  limit: number = 20
): Promise<SearchResultItem[]> {
  if (!query || query.trim() === '') {
    return []
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new ServiceError('You must be logged in to search inventory.')
  }

  const { data, error } = await supabase
    .from('items')
    .select('*, boxes(*, locations(*))')
    .eq('user_id', user.id)
    .ilike('name', `%${query.trim()}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new ServiceError('Search failed. Please try again.')
  }

  return (data || []).map((row) => {
    const rawItem = row as unknown as Item & {
      boxes: Box & { locations: Location | null }
    }
    const boxData = rawItem.boxes
    const locationData = boxData?.locations || null

    const itemObj: Item = {
      id: rawItem.id,
      user_id: rawItem.user_id,
      box_id: rawItem.box_id,
      name: rawItem.name,
      quantity: rawItem.quantity,
      category: rawItem.category,
      notes: rawItem.notes,
      created_at: rawItem.created_at,
      updated_at: rawItem.updated_at,
    }

    const boxObj: Box = {
      id: boxData.id,
      user_id: boxData.user_id,
      box_code: boxData.box_code,
      name: boxData.name,
      photo_path: boxData.photo_path,
      location_id: boxData.location_id,
      notes: boxData.notes,
      created_at: boxData.created_at,
      updated_at: boxData.updated_at,
    }

    return {
      item: itemObj,
      box: boxObj,
      location: locationData,
    }
  })
}