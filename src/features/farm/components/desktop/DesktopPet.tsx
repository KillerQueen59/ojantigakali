'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { ZoneId } from '../../data/cards'
import { PETS } from '../../data/pets'
import { farmActions, useFarm } from '../../state/farmStore'
import PixelSprite from '../PixelSprite'
import { useZoneTend } from '../TendBurst'

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

type Mode = 'idle' | 'move' | 'hop'

/**
 * Desktop version of the farm pet. Unlike mobile (one place at a time), the whole
 * valley is visible, so each zone gets its own critter roaming a fixed patch of the
 * 1440×900 scene. Ground critters walk/hop along [minX, maxX] on `groundY`; the
 * orchard butterfly flies inside the [minX,maxX]×[minY,maxY] box. Tap to play.
 */
export default function DesktopPet({
  zone,
  minX,
  maxX,
  groundY = 0,
  minY = 0,
  maxY = 0,
  pxSpeed,
  pixel = 4,
}: {
  zone: ZoneId
  minX: number
  maxX: number
  groundY?: number
  minY?: number
  maxY?: number
  pxSpeed: number
  pixel?: number
}) {
  const pet = PETS[zone]
  const w = pet.rows[0].length * pixel
  const h = pet.rows.length * pixel
  const midX = (minX + maxX) / 2

  const [x, setX] = useState(midX)
  const [y, setY] = useState(pet.flies ? (minY + maxY) / 2 : groundY - h)
  const [facing, setFacing] = useState<1 | -1>(1)
  const [mode, setMode] = useState<Mode>('idle')
  const [dur, setDur] = useState(2)
  const [emotes, setEmotes] = useState<{ id: number; ch: string; color: string }[]>([])

  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const emoteId = useRef(0)
  const xRef = useRef(x)
  xRef.current = x
  const yRef = useRef(y)
  yRef.current = y
  const busy = useRef(false)
  const track = (t: ReturnType<typeof setTimeout>) => {
    timers.current.push(t)
    return t
  }

  useEffect(() => {
    let active = true
    const stroll = () => {
      if (!active) return
      setMode('idle')
      track(
        setTimeout(
          () => {
            if (!active || busy.current) {
              track(setTimeout(stroll, 600))
              return
            }
            const from = xRef.current
            const target = minX + Math.random() * (maxX - minX)
            const dist = Math.abs(target - from)
            setFacing(target >= from ? 1 : -1)
            const seconds = Math.max(0.8, dist * pxSpeed)
            setDur(seconds)
            setX(target)
            if (pet.flies) setY(minY + Math.random() * (maxY - minY))
            setMode('move')
            track(setTimeout(stroll, Math.max(900, seconds * 1000)))
          },
          600 + Math.random() * 1800,
        ),
      )
    }
    stroll()
    return () => {
      active = false
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [pet, minX, maxX, minY, maxY, pxSpeed])

  const play = useCallback(() => {
    busy.current = true
    setMode('hop')
    const id = ++emoteId.current
    const e = pet.emotes[Math.floor(Math.random() * pet.emotes.length)]
    setEmotes((v) => [...v, { id, ...e }])
    track(setTimeout(() => setEmotes((v) => v.filter((k) => k.id !== id)), 900))
    track(
      setTimeout(() => {
        setMode((m) => (m === 'hop' ? 'idle' : m))
        busy.current = false
      }, 460),
    )
  }, [pet])

  // Cheer when this pet's zone gets tended.
  const cheered = useZoneTend(zone)
  useEffect(() => {
    if (cheered > 0) play()
  }, [cheered, play])

  // Walk to wherever the visitor clicks the ground (overrides wandering).
  const petTarget = useFarm((s) => s.petTarget)
  useEffect(() => {
    if (!petTarget) return
    busy.current = true
    const from = xRef.current
    const tx = clamp(petTarget.x, 70, 1370)
    const ty = pet.flies ? clamp(petTarget.y, 120, 600) - h / 2 : clamp(petTarget.y, 335, 862) - h
    const dist = Math.hypot(tx - from, ty - yRef.current)
    setFacing(tx >= from ? 1 : -1)
    const seconds = Math.max(0.45, dist * pxSpeed)
    setDur(seconds)
    setX(tx)
    setY(ty)
    setMode('move')
    const t = setTimeout(() => {
      setMode('idle')
      busy.current = false
      farmActions.clearPetTarget()
    }, Math.max(450, seconds * 1000))
    return () => clearTimeout(t)
  }, [petTarget, pet.flies, h, pxSpeed])

  const animation = pet.flies
    ? mode === 'hop'
      ? 'farm-petHop .44s ease-out'
      : 'farm-flutter 1.3s ease-in-out infinite'
    : mode === 'hop'
      ? 'farm-petHop .44s ease-out'
      : mode === 'move'
        ? pet.move === 'hop'
          ? 'farm-petHopLoop .6s ease-in-out infinite'
          : 'farm-petWalk .5s ease-in-out infinite'
        : 'farm-petIdle 2.4s ease-in-out infinite'

  const ease = pet.flies ? 'ease-in-out' : 'linear'

  return (
    <button
      type="button"
      aria-label={`Play with the ${zone} animal`}
      onClick={(e) => {
        e.stopPropagation()
        play()
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        transform: 'translateX(-50%)',
        transition: `left ${dur}s ${ease}, top ${dur}s ${ease}`,
        border: 0,
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
        lineHeight: 0,
        zIndex: 3,
      }}
    >
      <div style={{ position: 'relative' }}>
        {emotes.map((e) => (
          <span
            key={e.id}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '100%',
              fontSize: 18,
              color: e.color,
              animation: 'farm-heartFloat .9s ease-out forwards',
              pointerEvents: 'none',
            }}
          >
            {e.ch}
          </span>
        ))}
        <div style={{ transform: `scaleX(${facing})`, transformOrigin: 'center bottom' }}>
          <div style={{ animation, transformOrigin: 'center bottom' }}>
            <PixelSprite rows={pet.rows} palette={pet.palette} pixel={pixel} />
          </div>
        </div>
      </div>
    </button>
  )
}
