import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMobile } from '@/hooks/useMobile'

function makeMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  const mq = {
    matches,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
      if (event === 'change') listeners.push(handler)
    }),
    removeEventListener: vi.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
      const idx = listeners.indexOf(handler)
      if (idx !== -1) listeners.splice(idx, 1)
    }),
    dispatchEvent: vi.fn(),
    _trigger: (newMatches: boolean) => {
      listeners.forEach((fn) => fn({ matches: newMatches } as MediaQueryListEvent))
    },
  }
  return mq
}

describe('useMobile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns false when matchMedia reports desktop (matches = false)', () => {
    const mq = makeMatchMedia(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  it('returns true when matchMedia reports mobile (matches = true)', () => {
    const mq = makeMatchMedia(true)
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  it('updates when the media query fires a change event', () => {
    const mq = makeMatchMedia(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)

    act(() => {
      mq._trigger(true)
    })
    expect(result.current).toBe(true)
  })

  it('removes the event listener on unmount', () => {
    const mq = makeMatchMedia(false)
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList)

    const { unmount } = renderHook(() => useMobile())
    unmount()
    expect(mq.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
