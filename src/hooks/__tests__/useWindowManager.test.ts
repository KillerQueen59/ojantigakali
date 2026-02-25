import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWindowManager } from '@/hooks/useWindowManager'

describe('useWindowManager', () => {
  it('starts with the "about" window pre-opened', () => {
    const { result } = renderHook(() => useWindowManager())
    expect(result.current.windows).toHaveLength(1)
    expect(result.current.windows[0].id).toBe('about')
  })

  it('isOpen returns true for the pre-opened window', () => {
    const { result } = renderHook(() => useWindowManager())
    expect(result.current.isOpen('about')).toBe(true)
  })

  it('isOpen returns false for a closed window', () => {
    const { result } = renderHook(() => useWindowManager())
    expect(result.current.isOpen('projects')).toBe(false)
  })

  it('openWindow adds a new window', () => {
    const { result } = renderHook(() => useWindowManager())
    act(() => {
      result.current.openWindow('projects')
    })
    expect(result.current.windows).toHaveLength(2)
    expect(result.current.isOpen('projects')).toBe(true)
  })

  it('openWindow on duplicate brings to front without adding a duplicate', () => {
    const { result } = renderHook(() => useWindowManager())
    const zBefore = result.current.windows[0].zIndex

    act(() => {
      result.current.openWindow('about')
    })

    expect(result.current.windows).toHaveLength(1)
    expect(result.current.windows[0].zIndex).toBeGreaterThan(zBefore)
  })

  it('closeWindow removes the window', () => {
    const { result } = renderHook(() => useWindowManager())
    act(() => {
      result.current.closeWindow('about')
    })
    expect(result.current.windows).toHaveLength(0)
    expect(result.current.isOpen('about')).toBe(false)
  })

  it('closeAll empties the windows list', () => {
    const { result } = renderHook(() => useWindowManager())
    act(() => {
      result.current.openWindow('projects')
      result.current.openWindow('contact')
    })
    expect(result.current.windows.length).toBeGreaterThan(0)

    act(() => {
      result.current.closeAll()
    })
    expect(result.current.windows).toHaveLength(0)
  })

  it('bringToFront increases zIndex of the target window', () => {
    const { result } = renderHook(() => useWindowManager())
    act(() => {
      result.current.openWindow('projects')
    })
    const zAbout = result.current.windows.find((w) => w.id === 'about')!.zIndex

    act(() => {
      result.current.bringToFront('about')
    })
    const zAboutAfter = result.current.windows.find((w) => w.id === 'about')!.zIndex
    expect(zAboutAfter).toBeGreaterThan(zAbout)
  })
})
