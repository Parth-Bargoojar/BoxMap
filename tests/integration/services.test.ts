import { describe, it, expect, vi } from 'vitest'
import { getDashboardStats } from '@/lib/services/dashboard'
import { createBox } from '@/lib/services/boxes'
import { createItem, deleteItem, moveItem } from '@/lib/services/items'
import { ServiceError } from '@/types'

describe('Service Layer Integration Tests', () => {
  describe('getDashboardStats', () => {
    it('returns zero stats when user is not authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      }

      const stats = await getDashboardStats(mockSupabase as unknown)
      expect(stats).toEqual({ box_count: 0, item_count: 0, location_count: 0 })
    })

    it('returns correct stats counts when authenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-123' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 5, error: null }),
          }),
        }),
      }

      const stats = await getDashboardStats(mockSupabase as unknown)
      expect(stats).toEqual({ box_count: 5, item_count: 5, location_count: 5 })
    })

    it('throws ServiceError on database failure', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-123' } } }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: null, error: new Error('DB Connection Failed') }),
          }),
        }),
      }

      await expect(getDashboardStats(mockSupabase as unknown)).rejects.toThrow(ServiceError)
    })
  })

  describe('createBox validation & execution', () => {
    it('throws ServiceError when box name is invalid', async () => {
      await expect(createBox({ name: '' })).rejects.toThrow(ServiceError)
    })

    it('throws ServiceError when unauthenticated', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
        },
      }

      await expect(createBox({ name: 'Valid Box' }, mockSupabase as unknown)).rejects.toThrow(ServiceError)
    })
  })

  describe('items service operations', () => {
    it('throws ServiceError when user is not logged in during item creation', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      }

      await expect(
        createItem({ boxId: 'box-1', name: 'Item 1', quantity: 1 }, mockSupabase as unknown)
      ).rejects.toThrow(ServiceError)
    })

    it('throws ServiceError when user is not logged in during item move', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      }

      await expect(
        moveItem('item-1', 'box-2', mockSupabase as unknown)
      ).rejects.toThrow(ServiceError)
    })

    it('throws ServiceError when user is not logged in during item delete', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
        },
      }

      await expect(
        deleteItem('item-1', mockSupabase as unknown)
      ).rejects.toThrow(ServiceError)
    })
  })
})
