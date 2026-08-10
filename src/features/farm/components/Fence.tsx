import type { CSSProperties } from 'react'

// Hue-shifted wood ramp (warm highlights, cool shadows), lit from the top-left.
const C = { hi: '#D9A86A', light: '#C68B54', base: '#A9713C', mid: '#8B5A2B', dark: '#5E3A1C', out: '#3A2410' }

type Rect = { x: number; y: number; w: number; h: number; f: string }

/** A vertical fence post (with a pointed cap), vertical mid at (cx, cy). */
function post(cx: number, cy: number, ph = 30): Rect[] {
  const pw = 11
  const x = Math.round(cx - pw / 2)
  const y = Math.round(cy - ph / 2)
  return [
    { x: x - 1, y: y + 4, w: pw + 2, h: ph - 4, f: C.out },
    { x, y: y + 5, w: pw, h: ph - 6, f: C.base },
    { x, y: y + 5, w: 3, h: ph - 6, f: C.light },
    { x: x + pw - 3, y: y + 5, w: 3, h: ph - 6, f: C.dark },
    { x: x + 2, y, w: pw - 4, h: 5, f: C.out },
    { x: x + 3, y: y + 1, w: pw - 6, h: 3, f: C.hi },
  ]
}

/** Horizontal rail with plank shading, x0..x1 at top y. */
function railH(x0: number, x1: number, y: number): Rect[] {
  const w = x1 - x0
  if (w <= 0) return []
  return [
    { x: x0, y, w, h: 8, f: C.out },
    { x: x0, y: y + 1, w, h: 2, f: C.light },
    { x: x0, y: y + 3, w, h: 3, f: C.base },
    { x: x0, y: y + 6, w, h: 1, f: C.mid },
  ]
}

/** Vertical rail with plank shading, y0..y1 at left x. */
function railV(y0: number, y1: number, x: number): Rect[] {
  const h = y1 - y0
  if (h <= 0) return []
  return [
    { x, y: y0, w: 8, h, f: C.out },
    { x: x + 1, y: y0, w: 2, h, f: C.light },
    { x: x + 3, y: y0, w: 3, h, f: C.base },
    { x: x + 6, y: y0, w: 1, h, f: C.mid },
  ]
}

/**
 * Pixel-art paddock fence sized to (w × h). `openTop` drops the back rail so the
 * fence never crosses a building sitting behind it; `gate` leaves a front opening.
 */
export default function Fence({
  w,
  h,
  openTop = true,
  gate = true,
  style,
}: {
  w: number
  h: number
  openTop?: boolean
  gate?: boolean
  style?: CSSProperties
}) {
  const rails: Rect[] = []
  const posts: Rect[] = []

  // Side rails (two per side) + evenly spaced posts.
  rails.push(...railV(6, h - 6, 3), ...railV(6, h - 6, 15))
  rails.push(...railV(6, h - 6, w - 11), ...railV(6, h - 6, w - 23))

  // Back (top) rail — only when enclosed.
  if (!openTop) rails.push(...railH(6, w - 6, 3), ...railH(6, w - 6, 15))

  // Front (bottom) rails, split around a centre gate.
  const gateHalf = gate ? 36 : 0
  const gx0 = Math.round(w / 2 - gateHalf)
  const gx1 = Math.round(w / 2 + gateHalf)
  if (gate) {
    rails.push(...railH(6, gx0, h - 15), ...railH(6, gx0, h - 8))
    rails.push(...railH(gx1, w - 6, h - 15), ...railH(gx1, w - 6, h - 8))
  } else {
    rails.push(...railH(6, w - 6, h - 15), ...railH(6, w - 6, h - 8))
  }

  // Corner posts (gate posts a touch taller for emphasis).
  posts.push(...post(4, 4), ...post(w - 4, 4), ...post(4, h - 4), ...post(w - 4, h - 4))
  if (gate) posts.push(...post(gx0, h - 4, 36), ...post(gx1, h - 4, 36))

  // Front-rail posts.
  const fcols = Math.max(2, Math.round(w / 52))
  for (let i = 1; i < fcols; i++) {
    const x = Math.round((w * i) / fcols)
    if (!gate || x < gx0 - 8 || x > gx1 + 8) posts.push(...post(x, h - 4))
  }
  // Side-rail posts (mid).
  posts.push(...post(4, Math.round(h / 2)), ...post(w - 4, Math.round(h / 2)))
  if (!openTop) {
    const tcols = Math.max(2, Math.round(w / 52))
    for (let i = 1; i < tcols; i++) posts.push(...post(Math.round((w * i) / tcols), 4))
  }

  const all = [...rails, ...posts]
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      shapeRendering="crispEdges"
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', ...style }}
      aria-hidden
    >
      {all.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.f} />
      ))}
    </svg>
  )
}
