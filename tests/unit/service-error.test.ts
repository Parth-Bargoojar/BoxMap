import { describe, it, expect } from 'vitest'
import { ServiceError } from '@/types'

describe('ServiceError', () => {
  it('instantiates catchable typed error with human readable message', () => {
    const err = new ServiceError('Box not found', 'NOT_FOUND')
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ServiceError)
    expect(err.message).toBe('Box not found')
    expect(err.code).toBe('NOT_FOUND')
  })
})
