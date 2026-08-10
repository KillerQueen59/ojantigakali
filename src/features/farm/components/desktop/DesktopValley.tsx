'use client'

import { useEffect, useState } from 'react'
import { WINDOW_CONTENT } from '../../data/content'
import { PET_META, PETS } from '../../data/pets'
import { SECTIONS, ZONES, type Zone } from '../../data/zones'
import { farmActions, useFarm } from '../../state/farmStore'
import SceneBackdrop from '../art/SceneBackdrop'
import ZoneEntity, { ZONE_ART } from '../art/ZoneEntities'
import Fence from '../Fence'
import PixelSprite from '../PixelSprite'
import DesktopPet from './DesktopPet'
import PetPicker from './PetPicker'
import Meter from '../Meter'
import TendBurst, { useZoneTend } from '../TendBurst'

const SCENE_W = 1440
const SCENE_H = 900

// Per-zone roaming bounds for the single active critter (scene coords).
const PET_BOUNDS: Record<Zone['id'], { minX: number; maxX: number; groundY?: number; minY?: number; maxY?: number; pxSpeed: number }> = {
  crop: { minX: 300, maxX: 500, groundY: 830, pxSpeed: 0.011 },
  barn: { minX: 560, maxX: 780, groundY: 800, pxSpeed: 0.017 },
  coop: { minX: 950, maxX: 1170, groundY: 812, pxSpeed: 0.011 },
  orchard: { minX: 840, maxX: 986, minY: 270, maxY: 430, pxSpeed: 0.009 },
}

const title = 'var(--farm-font-title)'
const mono = 'var(--farm-font-mono)'
const body = 'var(--farm-font-body)'

/** Cover scale = fill the viewport keeping aspect (same as the backdrop's slice). */
function useCover() {
  const [s, setS] = useState(1)
  useEffect(() => {
    const on = () => setS(Math.max(window.innerWidth / SCENE_W, window.innerHeight / SCENE_H))
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return s
}

/** Map a scene point to a viewport position that tracks the cover backdrop. */
function place(px: number, py: number, s: number) {
  return {
    left: `calc(50% + ${(s * (px - SCENE_W / 2)).toFixed(1)}px)`,
    top: `calc(50% + ${(s * (py - SCENE_H / 2)).toFixed(1)}px)`,
  }
}

function Icon({ href, size }: { href: string; size: number }) {
  return (
    <svg width={size} height={size} shapeRendering="crispEdges" aria-hidden>
      <use href={href} />
    </svg>
  )
}

/**
 * A fixed-size farm zone: its structure + fence + click hotspot as one unit, glued
 * to the cover backdrop. Normal → placed at its scene anchor at 1:1 pixel size.
 * Focused → grows to the viewport centre; the others dim out.
 */
function ZoneGroup({ zone, s, focusedId }: { zone: Zone; s: number; focusedId: Zone['id'] | null }) {
  const a = ZONE_ART[zone.id]
  const value = useFarm((st) => st.meters[zone.id])
  const full = value >= 50

  const gx = Math.min(a.x, zone.fence.left, zone.hit.left)
  const gy = Math.min(a.y, zone.fence.top, zone.hit.top)
  const gx1 = Math.max(a.x + a.w, zone.fence.left + zone.fence.w, zone.hit.left + zone.hit.w)
  const gy1 = Math.max(a.y + a.h, zone.fence.top + zone.fence.h, zone.hit.top + zone.hit.h)
  const gw = gx1 - gx
  const gh = gy1 - gy

  const isFocus = focusedId === zone.id
  const dim = focusedId !== null && !isFocus
  const scale = isFocus ? zone.zoom : 1
  const pos = isFocus ? { left: '50%', top: '48%' } : place(gx + gw / 2, gy + gh / 2, s)

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        width: gw,
        height: gh,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center',
        zIndex: isFocus ? 31 : 2,
        opacity: dim ? 0 : 1,
        pointerEvents: dim ? 'none' : 'auto',
        transition: 'left .55s cubic-bezier(.22,.61,.36,1), top .55s cubic-bezier(.22,.61,.36,1), transform .55s cubic-bezier(.22,.61,.36,1), opacity .3s ease',
      }}
    >
      <div style={{ position: 'absolute', left: a.x - gx, top: a.y - gy }}>
        <ZoneEntity id={zone.id} />
      </div>
      <div style={{ position: 'absolute', left: zone.fence.left - gx, top: zone.fence.top - gy, width: zone.fence.w, height: zone.fence.h }}>
        <Fence w={zone.fence.w} h={zone.fence.h} openTop={zone.fence.openTop ?? true} />
      </div>
      {/* hotspot — click to focus; hidden once anything is focused */}
      <button
        type="button"
        className="farm-hotspot"
        onClick={() => farmActions.focusOn(zone.id)}
        aria-label={`Focus ${zone.name}`}
        style={{ position: 'absolute', left: zone.hit.left - gx, top: zone.hit.top - gy, width: zone.hit.w, height: zone.hit.h, border: 0, background: 'transparent', padding: 0, cursor: 'pointer', opacity: focusedId ? 0 : 1, pointerEvents: focusedId ? 'none' : 'auto', transition: 'opacity .3s ease' }}
      >
        <span className="farm-hotspot-hi" style={{ position: 'absolute', inset: 0, background: 'rgba(242,193,78,.14)', boxShadow: 'inset 0 0 0 2px rgba(242,193,78,.5)' }} />
        <span className="farm-hotspot-sign" style={{ position: 'absolute', top: -8, left: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: '#4A2F18', padding: '6px 12px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          <span style={{ fontFamily: title, fontSize: 16, color: '#F6E7C5' }}>{zone.name}</span>
          <span style={{ fontFamily: mono, fontSize: 11, color: full ? '#F2C14E' : '#D9C49A' }}>
            {full ? '⭐ READY TO HARVEST' : `${value}/50 · ▸ CLICK TO TEND`}
          </span>
        </span>
      </button>
    </div>
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
      <div onClick={farmActions.clearFocus} style={{ position: 'fixed', inset: 0, zIndex: 30, background: 'radial-gradient(circle at 50% 46%, rgba(30,39,73,0) 30%, rgba(30,39,73,.5) 100%)', animation: 'farm-fadeIn .4s ease' }} />
      <button type="button" className="farm-action" onClick={farmActions.clearFocus} style={{ position: 'fixed', top: 22, left: 26, zIndex: 33, display: 'inline-flex', alignItems: 'center', gap: 6, border: 0, cursor: 'pointer', background: '#4A2F18', color: '#F6E7C5', fontFamily: title, fontSize: 16, padding: '8px 14px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)', animation: 'farm-pop .2s ease-out' }}>
        ← BACK
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'fixed', left: '50%', bottom: 116, transform: 'translateX(-50%)', zIndex: 33, width: 380, background: '#8B5A2B', padding: 5, boxShadow: '6px 6px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .22s ease-out' }}>
        <div style={{ position: 'relative', background: '#F6E7C5', padding: '14px 16px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontFamily: title, fontSize: 22, color: '#3B2A1A' }}>{zone.name}</span>
            <span style={{ fontFamily: mono, fontSize: 13, color: '#6E4523' }}>{value}/50</span>
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: '#B8802F', marginTop: 2 }}>{zone.sub}</div>
          <div key={pulse} style={{ margin: '12px 0', transformOrigin: 'left center', animation: pulse ? 'farm-tendPulse .32s ease-out' : undefined }}>
            <Meter value={value} color={full ? '#F2C14E' : zone.chip} />
          </div>
          <button type="button" className="farm-action" onClick={() => farmActions.tend(zone.id, zone.name)} style={{ display: 'inline-flex', alignItems: 'center', border: 0, cursor: 'pointer', background: chipBg, color: chipFg, fontFamily: title, fontSize: 17, padding: '7px 16px', whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(0,0,0,.3)', animation: full ? 'farm-bob 1s ease-in-out infinite' : undefined }}>
            {chipLabel}
          </button>
          <TendBurst zone={zone.id} />
        </div>
      </div>
    </>
  )
}

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 8, paddingTop: 8, borderTop: '2px solid #E5D3A8' }}>
          <span style={{ width: 26, height: 22, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
            <PixelSprite rows={pet.rows} palette={pet.palette} pixel={2} />
          </span>
          <span style={{ fontFamily: mono, fontSize: 11, color: '#6E4523' }}>OUT NOW · {PET_META[activePet].label}</span>
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
  return (
    <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: '#8B5A2B', padding: 8, display: 'flex', gap: 8, boxShadow: '4px 4px 0 rgba(0,0,0,.35)', opacity: focused ? 0 : 1, pointerEvents: focused ? 'none' : 'auto', transition: 'opacity .3s ease' }}>
      {SECTIONS.map((s, i) => {
        const locked = s.id === null
        const active = !locked && win === s.id
        return (
          <button key={i} type="button" className="farm-hotbar-slot" onClick={() => (locked ? farmActions.lockedToast() : farmActions.toggleWin(s.id!))} style={{ position: 'relative', width: 62, height: 62, border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', background: active ? '#7A4E28' : locked ? '#5E3D1F' : '#6E4523', opacity: locked ? 0.75 : 1, boxShadow: active ? 'inset 0 0 0 3px #F2C14E' : 'inset 2px 2px 0 #4A2F18, inset -2px -2px 0 #A9713C' }}>
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
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', width: 640, background: '#8B5A2B', padding: 6, boxShadow: '6px 6px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .18s ease-out' }}>
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

export default function DesktopValley() {
  const s = useCover()
  const focusZone = useFarm((st) => st.focusZone)
  const activePet = useFarm((st) => st.activePet)
  const petBounds = PET_BOUNDS[activePet]

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#7FBFE6' }}>
      {/* Stretchy COVER background — fills the viewport, no distortion. */}
      <SceneBackdrop />

      {/* Roaming critter scales with the landscape (glued), fades while focusing. */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: SCENE_W, height: SCENE_H, transform: `translate(-50%, -50%) scale(${s})`, transformOrigin: 'center', zIndex: 1, opacity: focusZone ? 0 : 1, pointerEvents: focusZone ? 'none' : 'auto', transition: 'opacity .3s ease' }}>
        <DesktopPet key={activePet} zone={activePet} {...petBounds} />
      </div>

      {/* The 4 fixed-size farm entities, glued to the backdrop. */}
      {ZONES.map((z) => (
        <ZoneGroup key={z.id} zone={z} s={s} focusedId={focusZone} />
      ))}

      <PetPicker />
      <StatusHud />
      <Hotbar />
      <FocusPanel />
      <ContentWindow />
    </div>
  )
}
