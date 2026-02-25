'use client'

import { useState, useCallback } from 'react'

export interface WindowState {
  id: string
  position: { x: number; y: number }
  zIndex: number
  originRect?: { x: number; y: number; width: number; height: number }
}

let zCounter = 100
const CASCADE_OFFSET = 28

export function useWindowManager() {
  const [windows, setWindows] = useState<WindowState[]>([
    { id: 'about', position: { x: 180, y: 60 }, zIndex: ++zCounter },
  ])

  const openWindow = useCallback((id: string, originRect?: { x: number; y: number; width: number; height: number }) => {
    setWindows((prev) => {
      // No duplicates
      if (prev.find((w) => w.id === id)) {
        // Bring to front instead
        const newZ = ++zCounter
        return prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
      }

      const newZ = ++zCounter
      // Cascade position based on number of open windows
      const offset = prev.length * CASCADE_OFFSET
      return [
        ...prev,
        {
          id,
          position: {
            x: 180 + offset,
            y: 60 + offset,
          },
          zIndex: newZ,
          originRect,
        },
      ]
    })
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const bringToFront = useCallback((id: string) => {
    setWindows((prev) => {
      const newZ = ++zCounter
      return prev.map((w) => (w.id === id ? { ...w, zIndex: newZ } : w))
    })
  }, [])

  const updatePosition = useCallback(
    (id: string, position: { x: number; y: number }) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position } : w))
      )
    },
    []
  )

  const isOpen = useCallback(
    (id: string) => windows.some((w) => w.id === id),
    [windows]
  )

  const closeAll = useCallback(() => setWindows([]), [])

  return { windows, openWindow, closeWindow, closeAll, bringToFront, updatePosition, isOpen }
}
