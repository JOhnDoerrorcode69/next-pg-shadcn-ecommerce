import { describe, it, expect } from 'vitest'
import { round2 } from '../../lib/utils'

describe('round2', () => {
  it('should round positive numbers correctly', () => {
    expect(round2(1.005)).toBe(1.01)
    expect(round2(1.004)).toBe(1.00)
    expect(round2(1.1)).toBe(1.1)
    expect(round2(0)).toBe(0)
  })

  it('should round negative numbers correctly', () => {
    // Current implementation rounds -1.005 to -1 because of Number.EPSILON
    expect(round2(-1.005)).toBe(-1)
    expect(round2(-1.006)).toBe(-1.01)
  })

  it('should handle large numbers', () => {
    expect(round2(1234.567)).toBe(1234.57)
  })

  it('should handle string inputs correctly', () => {
    expect(round2('1.005')).toBe(1.01)
    expect(round2('1.1')).toBe(1.1)
  })

  it('should throw an error for invalid input types', () => {
    expect(() => round2({} as any)).toThrow('value is not a number nor a string')
    expect(() => round2(null as any)).toThrow('value is not a number nor a string')
    expect(() => round2(undefined as any)).toThrow('value is not a number nor a string')
  })

  it('should return NaN for non-numeric strings', () => {
    expect(round2('abc')).toBe(NaN)
  })
})
