import type { ArtRect } from '../data/cards'

/**
 * Renders a 24×24 pixel-art item as SVG rects. Every rect is drawn twice — first
 * expanded 1px on all sides in ink (#4A2F18) as an outline, then the real fill on
 * top — so white/cream items don't vanish against a light mat. viewBox is -1 -1 26 26
 * to make room for that outline pass.
 */
export default function CardArt({ art, size }: { art: ArtRect[]; size: number }) {
  return (
    <svg width={size} height={size} viewBox="-1 -1 26 26" shapeRendering="crispEdges">
      {art.map((r, i) => (
        <rect key={`o${i}`} x={r[0] - 1} y={r[1] - 1} width={r[2] + 2} height={r[3] + 2} fill="#4A2F18" />
      ))}
      {art.map((r, i) => (
        <rect key={`f${i}`} x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={r[4]} />
      ))}
    </svg>
  )
}
