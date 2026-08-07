'use client'

import { useEffect, useRef, useState } from 'react'
import type { ZoneId } from '../data/cards'
import { useFarm } from '../state/farmStore'

/** Returns a counter that ticks up each time THIS zone is tended (0 on mount). */
export function useZoneTend(zone: ZoneId): number {
  const tick = useFarm((s) => s.tendTick)
  const tendZone = useFarm((s) => s.tendZone)
  const [n, setN] = useState(0)
  const last = useRef(0)
  useEffect(() => {
    if (tick === last.current) return
    last.current = tick
    if (tendZone === zone) setN((x) => x + 1)
  }, [tick, tendZone, zone])
  return n
}

type Particle = { id: number; left: number; delay: number; water: boolean; color: string }

/**
 * A short particle burst over a zone's meter when it's tended — blue droplets
 * falling for "pour water" zones, gold/green specks tossing up for "feed" zones.
 * Drop it inside a position:relative container; it fills it and ignores pointers.
 */
export default function TendBurst({ zone }: { zone: ZoneId }) {
  const tick = useFarm((s) => s.tendTick)
  const tendZone = useFarm((s) => s.tendZone)
  const kind = useFarm((s) => s.tendKind)
  const [parts, setParts] = useState<Particle[]>([])
  const idRef = useRef(0)
  const last = useRef(0)

  useEffect(() => {
    if (tick === last.current) return
    last.current = tick
    if (tendZone !== zone || !kind) return
    const water = kind === 'water'
    const batch: Particle[] = Array.from({ length: 8 }, () => ({
      id: ++idRef.current,
      left: 50 + (Math.random() * 46 - 23),
      delay: Math.random() * 130,
      water,
      color: water ? '#3e6fa8' : Math.random() < 0.5 ? '#f2c14e' : '#74b854',
    }))
    setParts((p) => [...p, ...batch])
    const ids = new Set(batch.map((b) => b.id))
    const t = setTimeout(() => setParts((p) => p.filter((x) => !ids.has(x.id))), 850)
    return () => clearTimeout(t)
  }, [tick, tendZone, kind, zone])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible', zIndex: 4 }}>
      {parts.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: p.water ? '28%' : '58%',
            left: `${p.left}%`,
            width: 4,
            height: p.water ? 6 : 4,
            background: p.color,
            boxShadow: p.water ? 'inset -1px -1px 0 rgba(255,255,255,.45)' : undefined,
            animation: `${p.water ? 'farm-dropDown' : 'farm-tossUp'} .7s ease-out ${p.delay}ms forwards`,
          }}
        />
      ))}
    </div>
  )
}
