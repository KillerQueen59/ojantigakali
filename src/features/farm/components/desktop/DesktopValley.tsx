'use client'

import { useEffect, useRef, useState } from 'react'
import { WINDOW_CONTENT } from '../../data/content'
import { PET_META, PET_ORDER, PETS } from '../../data/pets'
import { POI_POS, SECTIONS, ZONES, type Zone } from '../../data/zones'
import { farmActions, useFarm } from '../../state/farmStore'
import SceneBackground from '../art/SceneBackground'
import SceneProps from '../art/SceneProps'
import Fence from '../Fence'
import PixelSprite from '../PixelSprite'
import DesktopPet from './DesktopPet'
import Meter from '../Meter'
import TendBurst, { useZoneTend } from '../TendBurst'

// Per-zone roaming bounds for the single active critter.
const PET_BOUNDS: Record<Zone['id'], { minX: number; maxX: number; groundY?: number; minY?: number; maxY?: number; pxSpeed: number }> = {
  crop: { minX: 300, maxX: 500, groundY: 830, pxSpeed: 0.011 },
  barn: { minX: 560, maxX: 780, groundY: 800, pxSpeed: 0.017 },
  coop: { minX: 950, maxX: 1170, groundY: 812, pxSpeed: 0.011 },
  orchard: { minX: 840, maxX: 986, minY: 270, maxY: 430, pxSpeed: 0.009 },
}

const title = 'var(--farm-font-title)'
const mono = 'var(--farm-font-mono)'
const body = 'var(--farm-font-body)'

const SCENE_W = 1440
const SCENE_H = 900
const HORIZON = 330 // grass line in scene coords

function Icon({ href, size }: { href: string; size: number }) {
  return (
    <svg width={size} height={size} shapeRendering="crispEdges" aria-hidden>
      <use href={href} />
    </svg>
  )
}

/**
 * Full-viewport stretchable background behind the fixed prop canvas. Sky fills to
 * the scene horizon, grass below, and the river is continued to the right edge —
 * split computed from the fit-scale so it lines up with the in-frame background
 * (no seam) and fills every edge at any window size (no letterbox gap).
 */
function FillBackdrop() {
  const scaleD = useFarm((s) => s.scaleD)
  const horizon = `calc(50% + ${(scaleD * (HORIZON - SCENE_H / 2)).toFixed(1)}px)`
  const sceneRight = `calc(50% + ${(scaleD * (SCENE_W / 2)).toFixed(1)}px)`
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: horizon, background: '#7FBFE6' }} />
      <div style={{ position: 'absolute', top: horizon, left: 0, right: 0, bottom: 0, background: '#5A9E3D' }} />
      <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: sceneRight, background: '#4FA3D1' }} />
    </div>
  )
}

function Poi({ id }: { id: Exclude<(typeof SECTIONS)[number]['id'], null> }) {
  const active = useFarm((s) => s.win === id)
  const section = SECTIONS.find((s) => s.id === id)!
  const [top, left] = POI_POS[id]
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        farmActions.toggleWin(id)
      }}
      style={{ position: 'absolute', top, left, zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 0, background: 'transparent', cursor: 'pointer', padding: 0 }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4A2F18', padding: '5px 11px', boxShadow: active ? '3px 3px 0 rgba(0,0,0,.35), inset 0 0 0 2px #F2C14E' : '3px 3px 0 rgba(0,0,0,.35)' }}>
        <Icon href={section.icon} size={18} />
        <span style={{ fontFamily: title, fontSize: 15, color: '#F6E7C5', whiteSpace: 'nowrap' }}>
          {section.label}
        </span>
      </span>
      <span style={{ color: '#4A2F18', fontSize: 13, lineHeight: 1, animation: 'farm-bob 1.4s ease-in-out infinite' }}>▼</span>
    </button>
  )
}

/** Permanent pixel-art fence enclosing a section. */
function ZoneFenceArt({ zone }: { zone: Zone }) {
  const f = zone.fence
  return (
    <div style={{ position: 'absolute', top: f.top, left: f.left, width: f.w, height: f.h, zIndex: 2, pointerEvents: 'none' }}>
      <Fence w={f.w} h={f.h} openTop={f.openTop ?? true} />
    </div>
  )
}

/**
 * Transparent click/hover target over a section. The fence is always on; hovering
 * lifts a name/progress sign + subtle highlight, and clicking zooms the camera in.
 */
function ZoneHotspot({ zone }: { zone: Zone }) {
  const focused = useFarm((s) => s.focusZone !== null)
  const value = useFarm((s) => s.meters[zone.id])
  const full = value >= 50
  const { top, left, w, h } = zone.hit
  return (
    <button
      type="button"
      className="farm-hotspot"
      onClick={(e) => {
        e.stopPropagation()
        farmActions.focusOn(zone.id)
      }}
      aria-label={`Focus ${zone.name}`}
      style={{ position: 'absolute', top, left, width: w, height: h, zIndex: 6, border: 0, background: 'transparent', padding: 0, cursor: 'pointer', opacity: focused ? 0 : 1, pointerEvents: focused ? 'none' : 'auto', transition: 'opacity .3s ease' }}
    >
      <span className="farm-hotspot-hi" style={{ position: 'absolute', inset: 0, background: 'rgba(242,193,78,.14)', boxShadow: 'inset 0 0 0 2px rgba(242,193,78,.5)' }} />
      <span
        className="farm-hotspot-sign"
        style={{ position: 'absolute', top: -8, left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: '#4A2F18', padding: '6px 12px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)', whiteSpace: 'nowrap', pointerEvents: 'none' }}
      >
        <span style={{ fontFamily: title, fontSize: 16, color: '#F6E7C5' }}>{zone.name}</span>
        <span style={{ fontFamily: mono, fontSize: 11, color: full ? '#F2C14E' : '#D9C49A' }}>
          {full ? '⭐ READY TO HARVEST' : `${value}/50 · ▸ CLICK TO TEND`}
        </span>
      </span>
    </button>
  )
}

/** Fixed HUD shown while a section is focused: meter + water/feed action + exit. */
function FocusPanel() {
  const zoneId = useFarm((s) => s.focusZone)
  const value = useFarm((s) => (s.focusZone ? s.meters[s.focusZone] : 0))
  const tended = useFarm((s) => (s.focusZone ? !!s.tended[s.focusZone] : false))
  const pulse = useZoneTend(zoneId ?? 'crop')

  useEffect(() => {
    if (!zoneId) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') farmActions.clearFocus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoneId])

  if (!zoneId) return null
  const zone = ZONES.find((z) => z.id === zoneId)!
  const full = value >= 50
  const chipBg = full ? '#F2C14E' : tended ? '#D9C49A' : zone.chip
  const chipFg = full || tended ? '#3B2A1A' : '#FFF'
  const chipLabel = full ? '⭐ HARVEST!' : tended ? '✓ TENDED' : zone.action

  return (
    <>
      <div
        onClick={farmActions.clearFocus}
        style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'radial-gradient(circle at 50% 46%, rgba(30,39,73,0) 34%, rgba(30,39,73,.42) 100%)', animation: 'farm-fadeIn .4s ease' }}
      />
      <button
        type="button"
        className="farm-action"
        onClick={farmActions.clearFocus}
        style={{ position: 'fixed', top: 22, left: 26, zIndex: 33, display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, cursor: 'pointer', background: '#4A2F18', color: '#F6E7C5', fontFamily: title, fontSize: 16, padding: '8px 14px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)', animation: 'farm-pop .2s ease-out' }}
      >
        ← BACK
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'fixed', left: '50%', bottom: 116, transform: 'translateX(-50%)', zIndex: 33, width: 380, background: '#8B5A2B', padding: 5, boxShadow: '6px 6px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .22s ease-out' }}
      >
        <div style={{ position: 'relative', background: '#F6E7C5', padding: '14px 16px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: title, fontSize: 22, color: '#3B2A1A' }}>{zone.name}</span>
            <span style={{ fontFamily: mono, fontSize: 13, color: '#6E4523' }}>{value}/50</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: '#B8802F', marginTop: 2 }}>{zone.sub}</div>
          <div key={pulse} style={{ margin: '12px 0', transformOrigin: 'left center', animation: pulse ? 'farm-tendPulse .32s ease-out' : undefined }}>
            <Meter value={value} color={full ? '#F2C14E' : zone.chip} />
          </div>
          <button
            type="button"
            className="farm-action"
            onClick={() => farmActions.tend(zone.id, zone.name)}
            style={{ display: 'inline-flex', alignItems: 'center', border: 0, cursor: 'pointer', background: chipBg, color: chipFg, fontFamily: title, fontSize: 17, padding: '7px 16px', whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(0,0,0,.3)', animation: full ? 'farm-bob 1s ease-in-out infinite' : undefined }}
          >
            {chipLabel}
          </button>
          <TendBurst zone={zone.id} />
        </div>
      </div>
    </>
  )
}

/** Top-right farm panel: status + which critter is out. */
function StatusHud() {
  const helped = useFarm((s) => s.helped)
  const focused = useFarm((s) => s.focusZone !== null)
  const activePet = useFarm((s) => s.activePet)
  const ready = useFarm((s) => ZONES.filter((z) => s.meters[z.id] >= 50).length)
  const readyLabel = ready ? `${ready} HARVEST${ready > 1 ? 'S' : ''} READY` : 'NO HARVESTS READY YET'
  const pet = PETS[activePet]
  return (
    <div style={{ position: 'fixed', top: 20, right: 24, zIndex: 20, background: '#8B5A2B', padding: 4, boxShadow: '3px 3px 0 rgba(0,0,0,.35), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', opacity: focused ? 0 : 1, pointerEvents: focused ? 'none' : 'auto', transition: 'opacity .3s ease' }}>
      <div style={{ background: '#F6E7C5', padding: '10px 12px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
        <div style={{ fontFamily: title, fontSize: 17, color: '#3B2A1A' }}>FARM STATUS</div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#6E4523', marginTop: 4 }}>{helped} VISITORS HELPED TODAY</div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#B8802F' }}>{readyLabel}</div>
        {/* Merged critter picker: pick which single critter roams the valley. */}
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '2px solid #E5D3A8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 26, height: 22, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              <PixelSprite rows={pet.rows} palette={pet.palette} pixel={2} />
            </span>
            <span style={{ fontFamily: mono, fontSize: 11, color: '#6E4523' }}>OUT NOW · {PET_META[activePet].label}</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
            {PET_ORDER.map((zone) => {
              const on = activePet === zone
              const p = PETS[zone]
              return (
                <button
                  key={zone}
                  type="button"
                  className="farm-tile"
                  onClick={() => farmActions.setPet(zone)}
                  title={PET_META[zone].label}
                  aria-label={PET_META[zone].label}
                  aria-pressed={on}
                  style={{ width: 36, height: 36, border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', background: on ? '#7A4E28' : '#6E4523', boxShadow: on ? 'inset 0 0 0 3px #F2C14E' : 'inset 2px 2px 0 #4A2F18, inset -2px -2px 0 #A9713C' }}
                >
                  <span style={{ width: 30, height: 26, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                    <PixelSprite rows={p.rows} palette={p.palette} pixel={2} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <button type="button" onClick={farmActions.resetDemo} style={{ marginTop: 8, border: 0, background: 'transparent', cursor: 'pointer', fontFamily: mono, fontSize: 10, color: '#A9713C', padding: 0 }}>
          ↺ RESET DEMO
        </button>
      </div>
    </div>
  )
}

function Hotbar() {
  const win = useFarm((s) => s.win)
  const focused = useFarm((s) => s.focusZone !== null)
  const [open, setOpen] = useState(true)
  return (
    <div style={{ position: 'fixed', top: 20, left: 24, zIndex: 20, background: '#8B5A2B', padding: 8, display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '4px 4px 0 rgba(0,0,0,.35)', opacity: focused ? 0 : 1, pointerEvents: focused ? 'none' : 'auto', transition: 'opacity .3s ease' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Collapse menu' : 'Expand menu'}
        aria-expanded={open}
        style={{ width: 62, height: 26, border: 0, cursor: 'pointer', background: '#4A2F18', color: '#F6E7C5', fontFamily: title, fontSize: 15, display: 'grid', placeItems: 'center', boxShadow: 'inset 2px 2px 0 #6E4523, inset -2px -2px 0 #2A1B0E' }}
      >
        {open ? '▾' : '☰'}
      </button>
      {open &&
        SECTIONS.map((s, i) => {
        const locked = s.id === null
        const active = !locked && win === s.id
        return (
          <button
            key={i}
            type="button"
            className="farm-hotbar-slot"
            onClick={() => (locked ? farmActions.lockedToast() : farmActions.toggleWin(s.id!))}
            style={{ position: 'relative', width: 62, height: 62, border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', background: active ? '#7A4E28' : locked ? '#5E3D1F' : '#6E4523', opacity: locked ? 0.75 : 1, boxShadow: active ? 'inset 0 0 0 3px #F2C14E' : 'inset 2px 2px 0 #4A2F18, inset -2px -2px 0 #A9713C' }}
          >
            <span style={{ position: 'absolute', top: 2, left: 4, fontFamily: title, fontSize: 11, color: active ? '#F2C14E' : '#D9C49A' }}>{i + 1}</span>
            <Icon href={s.icon} size={36} />
            <span className="farm-tip">{s.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function ContentWindow() {
  const win = useFarm((s) => s.win)
  if (!win) return null
  const { title: winTitle, body: winBody } = WINDOW_CONTENT[win]
  return (
    <div onClick={farmActions.closeWin} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(30,39,73,.18)' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', width: 640, background: '#8B5A2B', padding: 6, boxShadow: '6px 6px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .18s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#4A2F18', padding: '8px 12px' }}>
          <span style={{ fontFamily: title, fontSize: 20, color: '#F6E7C5' }}>{winTitle}</span>
          <button type="button" onClick={farmActions.closeWin} style={{ width: 24, height: 24, border: 0, cursor: 'pointer', background: 'transparent', color: '#F6E7C5', fontFamily: title, fontSize: 18 }}>✕</button>
        </div>
        <div style={{ background: '#F6E7C5', padding: '24px 28px', fontFamily: body, fontSize: 16, lineHeight: 1.65, color: '#3B2A1A', maxHeight: 560, overflow: 'auto' }}>
          {winBody}
        </div>
      </div>
    </div>
  )
}

/** A short golden ring ping wherever the visitor clicks to send the pet. */
function ClickPing() {
  const petTarget = useFarm((s) => s.petTarget)
  const [pings, setPings] = useState<{ id: number; x: number; y: number }[]>([])
  const idRef = useRef(0)
  const lastRef = useRef('')
  useEffect(() => {
    if (!petTarget) return
    const key = `${petTarget.x.toFixed(1)},${petTarget.y.toFixed(1)}`
    if (key === lastRef.current) return
    lastRef.current = key
    const id = ++idRef.current
    const { x, y } = petTarget
    setPings((p) => [...p, { id, x, y }])
    const t = setTimeout(() => setPings((p) => p.filter((k) => k.id !== id)), 700)
    return () => clearTimeout(t)
  }, [petTarget])
  return (
    <>
      {pings.map((p) => (
        <div key={p.id} style={{ position: 'absolute', left: p.x, top: p.y, transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 2 }}>
          <div style={{ width: 36, height: 36, boxSizing: 'border-box', borderRadius: '50%', border: '3px solid #F2C14E', boxShadow: '0 0 0 1px rgba(74,47,24,.5)', animation: 'farm-ping .7s ease-out forwards' }} />
          <div style={{ position: 'absolute', inset: 0, margin: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#F2C14E', animation: 'farm-pingDot .7s ease-out forwards' }} />
        </div>
      ))}
    </>
  )
}

export default function DesktopValley() {
  const scaleD = useFarm((s) => s.scaleD)
  const focusZone = useFarm((s) => s.focusZone)
  const activePet = useFarm((s) => s.activePet)
  const focused = focusZone ? ZONES.find((z) => z.id === focusZone) ?? null : null

  // Camera. Base transform centers the scene; focusing pans a section's focus
  // point to the viewport centre and scales up (translate(-50%,-50%) cancels the
  // scene-centre origin, so screen(p) = viewportCentre + s·(p − sceneCentre)).
  const transform = focused
    ? `translate(-50%, -50%) translate(${(-focused.zoom * (focused.focus[0] - SCENE_W / 2)).toFixed(1)}px, ${(-focused.zoom * (focused.focus[1] - SCENE_H / 2)).toFixed(1)}px) scale(${focused.zoom})`
    : `translate(-50%, -50%) scale(${scaleD})`

  const petBounds = PET_BOUNDS[activePet]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#7FBFE6' }}>
      <FillBackdrop />
      {/* Fixed, contain-scaled 1440×900 prop canvas on top of the stretch background. */}
      <div
        onClick={(e) => {
          if (focusZone) return
          const r = e.currentTarget.getBoundingClientRect()
          farmActions.setPetTarget((e.clientX - r.left) / scaleD, (e.clientY - r.top) / scaleD)
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: SCENE_W,
          height: SCENE_H,
          transform,
          transformOrigin: 'center',
          transition: 'transform .55s cubic-bezier(.22,.61,.36,1)',
          cursor: focusZone ? 'default' : 'pointer',
        }}
      >
        <SceneBackground />
        <SceneProps />
        <ClickPing />
        {ZONES.map((z) => (
          <ZoneFenceArt key={z.id} zone={z} />
        ))}
        <DesktopPet key={activePet} zone={activePet} {...petBounds} />
        {ZONES.map((z) => (
          <ZoneHotspot key={z.id} zone={z} />
        ))}
        {/* Portfolio POIs fade out while a section is focused. */}
        <div style={{ opacity: focusZone ? 0 : 1, pointerEvents: focusZone ? 'none' : 'auto', transition: 'opacity .3s ease' }}>
          {SECTIONS.filter((s) => s.id).map((s) => (
            <Poi key={s.id} id={s.id!} />
          ))}
        </div>
      </div>
      <StatusHud />
      <Hotbar />
      <FocusPanel />
      <ContentWindow />
    </div>
  )
}
