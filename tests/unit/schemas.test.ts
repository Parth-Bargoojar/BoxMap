import { describe, it, expect } from 'vitest'
import { BoxSchema } from '@/lib/validation/box.schema'
import { ItemSchema } from '@/lib/validation/item.schema'
import { AuthSchema } from '@/lib/validation/auth.schema'

describe('Schema Validations', () => {
  describe('BoxSchema', () => {
    it('passes with valid box data', () => {
      const validData = {
        name: 'Winter Storage Box',
        notes: 'Contains heavy winter coats',
      }
      const result = BoxSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails when box name is missing or empty', () => {
      const invalidData = {
        name: '',
      }
      const result = BoxSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('ItemSchema', () => {
    it('passes with valid item data and defaults quantity to 1', () => {
      const validData = {
        name: 'Ski Goggles',
      }
      const result = ItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.quantity).toBe(1)
      }
    })

    it('passes with custom quantity', () => {
      const validData = {
        name: 'Wool Socks',
        quantity: 5,
      }
      const result = ItemSchema.safeParse(validData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.quantity).toBe(5)
      }
    })

    it('fails when item quantity is 0 or negative', () => {
      const invalidData = {
        name: 'Gloves',
        quantity: 0,
      }
      const result = ItemSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('AuthSchema', () => {
    it('validates correct email and password for auth', () => {
      const validAuth = {
        email: 'user@example.com',
        password: 'securePassword123',
      }
      expect(AuthSchema.safeParse(validAuth).success).toBe(true)
    })

    it('rejects invalid email formats', () => {
      const invalidEmail = {
        email: 'not-an-email',
        password: 'securePassword123',
      }
      expect(AuthSchema.safeParse(invalidEmail).success).toBe(false)
    })

    it('rejects passwords shorter than 8 characters', () => {
      const shortPassword = {
        email: 'test@example.com',
        password: '123',
      }
      expect(AuthSchema.safeParse(shortPassword).success).toBe(false)
    })
  })
})
