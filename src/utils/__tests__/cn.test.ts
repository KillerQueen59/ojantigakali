import { describe, it, expect } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn', () => {
  it('returns a single string argument unchanged', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('joins multiple string arguments with a space', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('omits falsy values', () => {
    expect(cn('foo', false, null, undefined, 0 as unknown as string, 'bar')).toBe('foo bar')
  })

  it('handles conditional objects', () => {
    expect(cn({ active: true, disabled: false })).toBe('active')
  })

  it('handles arrays', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })

  it('handles mixed inputs', () => {
    const isActive = true
    expect(cn('base', isActive && 'active', !isActive && 'inactive')).toBe('base active')
  })

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })
})
