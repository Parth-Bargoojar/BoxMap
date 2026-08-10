export interface Item {
  id: string;
  user_id: string;
  box_id: string;
  name: string;
  quantity: number;
  category: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  room: string | null;
  area: string | null;
  position: string | null;
  created_at: string;
  updated_at: string;
}