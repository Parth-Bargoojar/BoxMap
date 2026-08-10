import { z } from 'zod';

export const BoxSchema = z.object({
  name: z.string().min(1, 'Box name is required'),
  photo_path: z.string().optional(),
  notes: z.string().optional(),
  location: z.object({
    room: z.string().optional(),
    area: z.string().optional(),
    position: z.string().optional(),
  }).optional(),
  items: z.array(z.object({
    name: z.string().min(1, 'Item name is required'),
    quantity: z.number().min(1).default(1),
    category: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});