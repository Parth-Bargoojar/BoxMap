export function formatBoxCode(num: number): string {
  const padded = String(num).padStart(3, '0')
  return `BOX-${padded}`
}

export function parseBoxCodeNumber(code: string): number {
  if (!code || !code.startsWith('BOX-')) return 0
  const numStr = code.replace('BOX-', '')
  const parsed = parseInt(numStr, 10)
  return isNaN(parsed) ? 0 : parsed
}

export function generateNextBoxCode(existingCodes: string[]): string {
  let maxNum = 0
  for (const code of existingCodes) {
    const num = parseBoxCodeNumber(code)
    if (num > maxNum) {
      maxNum = num
    }
  }
  return formatBoxCode(maxNum + 1)
}
