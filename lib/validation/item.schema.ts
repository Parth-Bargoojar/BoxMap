import { z } from 'zod';

export const ItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(1).default(1),
  category: z.string().optional(),
  notes: z.string().optional(),
});