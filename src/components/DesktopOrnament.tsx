'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

// ─── Geometry ──────────────────────────────────────────────────────────
const CX = 210          // compass centre x inside SVG
const CY = 210          // compass centre y inside SVG
const R_DEG   = 148     // outer degree-ring
const R_MAJOR = 118     // tip of the 4 cardinal (N/S/E/W) points
const R_MINOR = 84      // tip of the 4 intercardinal (NE…) points
const R_INNER = 46      // inner boss circle
const R_LABEL = 134     // where N/S/E/W text sits

// Needle proportions
const NEEDLE_N  = 78    // north tip   (above centre)
const NEEDLE_S  = 52    // south tail  (below centre)
const NEEDLE_W  = 5     // half-width at pivot

// ─── Helpers ───────────────────────────────────────────────────────────
function polar(angleDeg: number, r: number) {
  const a = (angleDeg - 90) * (Math.PI / 180)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

// One compass-rose point (kite shape), pointing in `angleDeg`
function rosePoint(angleDeg: number, length: number, halfW: number) {
  const tip  = polar(angleDeg,        length)
  const left = polar(angleDeg - 90,   halfW)
  const right= polar(angleDeg + 90,   halfW)
  return `M ${CX},${CY} L ${left.x},${left.y} L ${tip.x},${tip.y} L ${right.x},${right.y} Z`
}

// ─── Sub-components ────────────────────────────────────────────────────

/** Faint nautical-chart grid — straight lines through centre */
function MapGrid() {
  const lines = [0, 30, 60, 90, 120, 150].map((deg) => {
    const a = polar(deg,       R_DEG + 18)
    const b = polar(deg + 180, R_DEG + 18)
    return { key: deg, x1: a.x, y1: a.y, x2: b.x, y2: b.y }
  })
  return (
    <g stroke="var(--ornament-stroke)" strokeWidth={0.4} strokeOpacity={0.55}>
      {lines.map(({ key, x1, y1, x2, y2 }) => (
        <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} />
      ))}
    </g>
  )
}

/** Outer degree ring with tick marks */
function DegreeRing() {
  const ticks: React.ReactNode[] = []
  for (let i = 0; i < 72; i++) {
    const deg  = i * 5
    const isCard = deg % 90 === 0
    const isMid  = deg % 45 === 0 && !isCard
    const inner = polar(deg, R_DEG - (isCard ? 12 : isMid ? 8 : 5))
    const outer = polar(deg, R_DEG)
    ticks.push(
      <line
        key={i}
        x1={inner.x} y1={inner.y}
        x2={outer.x} y2={outer.y}
        stroke="var(--ornament-stroke)"
        strokeWidth={isCard ? 1.4 : isMid ? 0.9 : 0.5}
      />
    )
  }
  return (
    <>
      <circle cx={CX} cy={CY} r={R_DEG}
        fill="none" stroke="var(--ornament-stroke)" strokeWidth={0.8} />
      {ticks}
    </>
  )
}

/** 8-point compass star */
function CompassStar() {
  return (
    <>
      {/* 4 major cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <path
          key={deg}
          d={rosePoint(deg, R_MAJOR, 11)}
          fill="var(--ornament-fill-major)"
        />
      ))}
      {/* 4 minor intercardinal points */}
      {[45, 135, 225, 315].map((deg) => (
        <path
          key={deg}
          d={rosePoint(deg, R_MINOR, 7)}
          fill="var(--ornament-fill-minor)"
        />
      ))}
    </>
  )
}

/** N / S / E / W labels, styled like a nautical chart */
function CardinalLabels() {
  const DIRS = [
    { label: 'N', deg: 0 },
    { label: 'E', deg: 90 },
    { label: 'S', deg: 180 },
    { label: 'W', deg: 270 },
  ]
  return (
    <>
      {DIRS.map(({ label, deg }) => {
        const { x, y } = polar(deg, R_LABEL)
        return (
          <text
            key={label}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={label === 'N' ? 13 : 11}
            fontWeight={label === 'N' ? 800 : 700}
            fontFamily="inherit"
            fill={label === 'N' ? 'var(--needle-north)' : 'var(--ornament-fill-major)'}
            letterSpacing="0.05em"
          >
            {label}
          </text>
        )
      })}
    </>
  )
}

/** Inner boss ring */
function CenterBoss() {
  return (
    <>
      <circle cx={CX} cy={CY} r={R_INNER}
        fill="none" stroke="var(--ornament-stroke)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={R_INNER - 6}
        fill="none" stroke="var(--ornament-stroke)" strokeWidth={0.4} />
      {/* LOG POSE label */}
      <text
        x={CX} y={CY - 16}
        textAnchor="middle" dominantBaseline="central"
        fontSize={6.5} fontWeight={700} letterSpacing="0.18em"
        textDecoration="none"
        fill="var(--ornament-sub)"
        fontFamily="inherit"
      >
        LOG&nbsp;POSE
      </text>
    </>
  )
}

/** Animated Log Pose needle — GSAP controls its rotation */
function Needle({ needleRef }: { needleRef: React.RefObject<SVGGElement | null> }) {
  return (
    <g ref={needleRef} style={{ transformOrigin: `${CX}px ${CY}px` }}>
      {/* North half (orange/gold) */}
      <polygon
        points={`${CX},${CY - NEEDLE_N} ${CX - NEEDLE_W},${CY} ${CX + NEEDLE_W},${CY}`}
        fill="var(--needle-north)"
        opacity={0.92}
      />
      {/* South half (light) */}
      <polygon
        points={`${CX},${CY + NEEDLE_S} ${CX - NEEDLE_W},${CY} ${CX + NEEDLE_W},${CY}`}
        fill="var(--needle-south)"
        opacity={0.85}
      />
      {/* Pivot jewel */}
      <circle cx={CX} cy={CY} r={4}
        fill="var(--needle-north)" stroke="var(--needle-ring)" strokeWidth={1.2} />
      <circle cx={CX} cy={CY} r={2} fill="var(--needle-ring)" />
    </g>
  )
}

// ─── Main Component ────────────────────────────────────────────────────
export default function DesktopOrnament({
  size = 420,
  showTagline = true,
}: {
  size?: number
  showTagline?: boolean
}) {
  const svgRef    = useRef<SVGSVGElement>(null)
  const needleRef = useRef<SVGGElement>(null)
  const idleTl    = useRef<gsap.core.Timeline | null>(null)
  const tracking  = useRef(false)

  // Idle wobble timeline — mimics a Log Pose searching for its island
  const startIdle = useCallback(() => {
    idleTl.current?.kill()
    idleTl.current = gsap.timeline({ repeat: -1 })
      .to(needleRef.current, {
        rotation: 18,
        duration: 2.8,
        ease: 'sine.inOut',
        svgOrigin: `${CX} ${CY}`,
      })
      .to(needleRef.current, {
        rotation: -22,
        duration: 3.5,
        ease: 'sine.inOut',
        svgOrigin: `${CX} ${CY}`,
      })
      .to(needleRef.current, {
        rotation: 10,
        duration: 2.2,
        ease: 'sine.inOut',
        svgOrigin: `${CX} ${CY}`,
      })
      .to(needleRef.current, {
        rotation: -8,
        duration: 1.8,
        ease: 'sine.inOut',
        svgOrigin: `${CX} ${CY}`,
      })
      .to(needleRef.current, {
        rotation: 0,
        duration: 2.4,
        ease: 'power2.inOut',
        svgOrigin: `${CX} ${CY}`,
      })
  }, [])

  // Mount: entrance + start idle
  useEffect(() => {
    if (!needleRef.current || !svgRef.current) return

    // Entrance: whole SVG scales in
    gsap.from(svgRef.current, {
      scale: 0.82,
      opacity: 0,
      duration: 1.4,
      ease: 'elastic.out(1, 0.55)',
      svgOrigin: `${CX} ${CY}`,
    })

    startIdle()
    return () => { idleTl.current?.kill() }
  }, [startIdle])

  // Mouse-move handler — makes needle track cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!needleRef.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width  * (CX / 420))
    const dy = e.clientY - (rect.top  + rect.height * (CY / 420))
    const angle = Math.atan2(dx, -dy) * (180 / Math.PI)

    gsap.to(needleRef.current, {
      rotation: angle,
      duration: 0.55,
      ease: 'power2.out',
      svgOrigin: `${CX} ${CY}`,
      overwrite: true,
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    tracking.current = true
    idleTl.current?.pause()
  }, [])

  const handleMouseLeave = useCallback(() => {
    tracking.current = false
    // Spin once, then settle back to 0, then resume idle
    gsap.timeline()
      .to(needleRef.current, {
        rotation: '+=360',
        duration: 1.0,
        ease: 'power2.inOut',
        svgOrigin: `${CX} ${CY}`,
        overwrite: true,
      })
      .to(needleRef.current, {
        rotation: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.35)',
        svgOrigin: `${CX} ${CY}`,
        onComplete: startIdle,
      })
  }, [startIdle])

  // Attach events directly to SVG element (keeps pointer-events off the invisible wrapper)
  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mouseleave', handleMouseLeave)
    el.addEventListener('mousemove',  handleMouseMove as EventListener)
    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mouseleave', handleMouseLeave)
      el.removeEventListener('mousemove',  handleMouseMove as EventListener)
    }
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove])

  return (
    /* Outer wrapper is pointer-events:none so it never blocks icon clicks */
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        gap: 16,
      }}
    >
      {/* ── Compass SVG — gets pointer events for needle tracking ── */}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 420 420"
        style={{ pointerEvents: 'auto', cursor: 'crosshair', overflow: 'visible' }}
        aria-label="Log Pose compass"
      >
        <MapGrid />
        <DegreeRing />
        <CompassStar />
        <CardinalLabels />
        <CenterBoss />
        <Needle needleRef={needleRef} />
      </svg>

      {/* ── Name + tagline below the compass ── */}
      {showTagline && <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
          marginTop: -8,
        }}
      >
        <h1
          style={{
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--ornament-text)',
          }}
        >
          Your Name
        </h1>

        {/* Ornamental divider */}
        <svg width={180} height={22} viewBox="0 0 180 22" style={{ margin: '12px 0 8px' }} aria-hidden>
          <line x1={0}   y1={11} x2={66}  y2={11} stroke="var(--ornament-sub)" strokeWidth={0.8} />
          <line x1={66}  y1={5}  x2={66}  y2={17} stroke="var(--ornament-sub)" strokeWidth={0.8} />
          <polygon points="90,4 98,11 90,18 82,11"
            fill="none" stroke="var(--ornament-sub)" strokeWidth={0.9} />
          <line x1={114} y1={5}  x2={114} y2={17} stroke="var(--ornament-sub)" strokeWidth={0.8} />
          <line x1={114} y1={11} x2={180} y2={11} stroke="var(--ornament-sub)" strokeWidth={0.8} />
        </svg>

        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: 'var(--ornament-sub)',
          }}
        >
          Full-Stack Developer
        </span>
      </div>}
    </div>
  )
}
