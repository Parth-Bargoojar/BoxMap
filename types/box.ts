import { Item, Location } from './item'

export interface Box {
  id: string
  user_id: string
  box_code: string
  name: string
  photo_path: string | null
  location_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface BoxWithDetails extends Box {
  items: Item[]
  location: Location | null
}

export interface CreateBoxInput {
  name: string
  photo?: File | Blob | null
  room?: string | null
  area?: string | null
  position?: string | null
  notes?: string | null
  items?: Array<{
    name: string
    quantity?: number
    category?: string | null
    notes?: string | null
  }>
}

export interface UpdateBoxInput {
  boxId: string
  name?: string
  photo?: File | Blob | null
  room?: string | null
  area?: string | null
  position?: string | null
  notes?: string | null
}

export class ServiceError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message)
    this.name = 'ServiceError'
  }
}