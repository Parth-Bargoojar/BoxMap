import { describe, it, expect } from 'vitest'
import { formatBoxCode, parseBoxCodeNumber, generateNextBoxCode } from '@/lib/utils/box-code'

describe('box_code utilities', () => {
  it('formats box codes with 3-digit padding', () => {
    expect(formatBoxCode(1)).toBe('BOX-001')
    expect(formatBoxCode(14)).toBe('BOX-014')
    expect(formatBoxCode(100)).toBe('BOX-100')
    expect(formatBoxCode(999)).toBe('BOX-999')
  })

  it('parses box code numbers correctly', () => {
    expect(parseBoxCodeNumber('BOX-001')).toBe(1)
    expect(parseBoxCodeNumber('BOX-014')).toBe(14)
    expect(parseBoxCodeNumber('BOX-100')).toBe(100)
    expect(parseBoxCodeNumber('INVALID')).toBe(0)
    expect(parseBoxCodeNumber('')).toBe(0)
  })

  it('generates next sequential box code per user list', () => {
    expect(generateNextBoxCode([])).toBe('BOX-001')
    expect(generateNextBoxCode(['BOX-001', 'BOX-002'])).toBe('BOX-003')
    expect(generateNextBoxCode(['BOX-001', 'BOX-014', 'BOX-005'])).toBe('BOX-015')
  })
})
