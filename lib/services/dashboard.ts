import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { ServiceError } from '@/types'

export interface DashboardStats {
  box_count: number
  item_count: number
  location_count: number
}

export async function getDashboardStats(client?: unknown): Promise<DashboardStats> {
  const supabase = (client as ReturnType<typeof createBrowserClient>) || createBrowserClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { box_count: 0, item_count: 0, location_count: 0 }
  }

  const [boxRes, itemRes, locRes] = await Promise.all([
    supabase.from('boxes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('items').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('locations').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  if (boxRes.error || itemRes.error || locRes.error) {
    throw new ServiceError('Could not calculate dashboard statistics.')
  }

  return {
    box_count: boxRes.count || 0,
    item_count: itemRes.count || 0,
    location_count: locRes.count || 0,
  }
}