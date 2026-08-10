import { describe, it, expect } from 'vitest'

describe('Search Query Normalization & Matching Logic', () => {
  function normalizeQuery(q: string) {
    return q.trim().toLowerCase()
  }

  function matchesItem(itemName: string, query: string) {
    const normName = normalizeQuery(itemName)
    const normQuery = normalizeQuery(query)
    return normName.includes(normQuery)
  }

  it('normalizes queries by trimming whitespace and converting to lowercase', () => {
    expect(normalizeQuery('  JACKET  ')).toBe('jacket')
    expect(normalizeQuery('Snow BOOTS')).toBe('snow boots')
  })

  it('matches items case-insensitively and partially', () => {
    expect(matchesItem('Black Leather Jacket', 'jacket')).toBe(true)
    expect(matchesItem('Black Leather Jacket', 'LEATHER')).toBe(true)
    expect(matchesItem('Black Leather Jacket', '   black   ')).toBe(true)
    expect(matchesItem('Black Leather Jacket', 'umbrella')).toBe(false)
  })
})
