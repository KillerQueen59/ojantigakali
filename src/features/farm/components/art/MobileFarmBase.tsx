// AUTO-GENERATED from the farm prototype scene. Do not hand-edit. viewBox 0 0 390 220.
import type { CSSProperties, ReactNode } from 'react'

const INNER = `<rect width="390" height="220" fill="#86C5E8"></rect><rect x="26" y="28" width="70" height="16" fill="#FFF"></rect><rect x="42" y="18" width="40" height="12" fill="#FFF"></rect><rect x="300" y="20" width="34" height="34" fill="#F2C14E"></rect><polygon points="0,180 0,140 120,116 260,150 390,124 390,180" fill="#6FAE4E"></polygon><rect x="0" y="172" width="390" height="48" fill="#5A9E3D"></rect>`

type Props = { className?: string; style?: CSSProperties; children?: ReactNode }

export default function MobileFarmBase({ className, style, children }: Props) {
  return (
    <svg viewBox="0 0 390 220" shapeRendering="crispEdges" preserveAspectRatio="xMidYMid slice" className={className} style={style}>
      <g dangerouslySetInnerHTML={{ __html: INNER }} />
      {children}
    </svg>
  )
}
