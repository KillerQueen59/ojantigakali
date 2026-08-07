import type { CSSProperties } from 'react'

/**
 * Renders a character-grid sprite as crisp SVG rects. `.` and any key mapped to
 * "transparent" are skipped. Consecutive same-color cells in a row are merged into
 * one rect to keep the DOM light.
 */
export default function PixelSprite({
  rows,
  palette,
  pixel = 1,
  className,
  style,
}: {
  rows: string[]
  palette: Record<string, string>
  pixel?: number
  className?: string
  style?: CSSProperties
}) {
  const w = rows[0].length
  const h = rows.length
  const rects: { x: number; y: number; len: number; fill: string }[] = []
  rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      const fill = palette[ch]
      if (!fill || fill === 'transparent') {
        x++
        continue
      }
      let len = 1
      while (x + len < row.length && row[x + len] === ch) len++
      rects.push({ x, y, len, fill })
      x += len
    }
  })
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * pixel}
      height={h * pixel}
      shapeRendering="crispEdges"
      className={className}
      style={style}
      aria-hidden
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.len} height={1} fill={r.fill} />
      ))}
    </svg>
  )
}
