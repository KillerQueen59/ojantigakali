'use client'

import { CATALOG } from '../../data/cards'
import { WINDOW_CONTENT } from '../../data/content'
import { POI_POS, SECTIONS, ZONES } from '../../data/zones'
import { farmActions, useFarm } from '../../state/farmStore'
import SceneBackground from '../art/SceneBackground'
import SceneProps from '../art/SceneProps'
import DesktopPet from './DesktopPet'
import Meter from '../Meter'
import TendBurst, { useZoneTend } from '../TendBurst'

// One roaming critter per zone, each bounded to its patch of the 1440×900 scene.
const DESKTOP_PETS = [
  { zone: 'crop' as const, minX: 300, maxX: 500, groundY: 830, pxSpeed: 0.011 },
  { zone: 'barn' as const, minX: 560, maxX: 780, groundY: 800, pxSpeed: 0.017 },
  { zone: 'coop' as const, minX: 950, maxX: 1170, groundY: 812, pxSpeed: 0.011 },
  { zone: 'orchard' as const, minX: 840, maxX: 986, minY: 270, maxY: 430, pxSpeed: 0.009 },
]

const title = 'var(--farm-font-title)'
const mono = 'var(--farm-font-mono)'
const body = 'var(--farm-font-body)'

function Icon({ href, size }: { href: string; size: number }) {
  return (
    <svg width={size} height={size} shapeRendering="crispEdges" aria-hidden>
      <use href={href} />
    </svg>
  )
}

function Poi({ id }: { id: Exclude<(typeof SECTIONS)[number]['id'], null> }) {
  const active = useFarm((s) => s.win === id)
  const section = SECTIONS.find((s) => s.id === id)!
  const [top, left] = POI_POS[id]
  return (
    <button
      type="button"
      onClick={() => farmActions.toggleWin(id)}
      style={{ position: 'absolute', top, left, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 0, background: 'transparent', cursor: 'pointer', padding: 0 }}
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

function ZonePlaque({ zone }: { zone: (typeof ZONES)[number] }) {
  const value = useFarm((s) => s.meters[zone.id])
  const tended = useFarm((s) => !!s.tended[zone.id])
  const pulse = useZoneTend(zone.id)
  const full = value >= 50
  const chipBg = full ? '#F2C14E' : tended ? '#D9C49A' : zone.chip
  const chipFg = full || tended ? '#3B2A1A' : '#FFF'
  const chipLabel = full ? '⭐ HARVEST!' : tended ? '✓ TENDED' : zone.action
  return (
    <div
      style={{ position: 'absolute', top: zone.top, left: zone.left, width: zone.w, background: '#8B5A2B', padding: 4, boxShadow: full ? '0 0 0 3px #F2C14E, 3px 3px 0 rgba(0,0,0,.35)' : '3px 3px 0 rgba(0,0,0,.35), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18' }}
    >
      <div style={{ position: 'relative', background: '#F6E7C5', padding: '10px 12px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontFamily: title, fontSize: 18, color: '#3B2A1A' }}>{zone.name}</span>
          <span style={{ fontFamily: mono, fontSize: 12, color: '#6E4523' }}>{value}/50</span>
        </div>
        <div key={pulse} style={{ margin: '8px 0', transformOrigin: 'left center', animation: pulse ? 'farm-tendPulse .32s ease-out' : undefined }}>
          <Meter value={value} color={full ? '#F2C14E' : zone.chip} />
        </div>
        <button
          type="button"
          className="farm-action"
          onClick={() => farmActions.tend(zone.id, zone.name)}
          style={{ display: 'inline-flex', alignItems: 'center', border: 0, cursor: 'pointer', background: chipBg, color: chipFg, fontFamily: title, fontSize: 15, padding: '4px 10px', whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(0,0,0,.3)', animation: full ? 'farm-bob 1s ease-in-out infinite' : undefined }}
        >
          {chipLabel}
        </button>
        <TendBurst zone={zone.id} />
      </div>
    </div>
  )
}

function StatusHud() {
  const helped = useFarm((s) => s.helped)
  const ready = useFarm((s) => ZONES.filter((z) => s.meters[z.id] >= 50).length)
  const readyLabel = ready ? `${ready} HARVEST${ready > 1 ? 'S' : ''} READY` : 'NO HARVESTS READY YET'
  return (
    <div style={{ position: 'absolute', top: 20, right: 24, background: '#8B5A2B', padding: 4, boxShadow: '3px 3px 0 rgba(0,0,0,.35), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18' }}>
      <div style={{ background: '#F6E7C5', padding: '10px 12px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
        <div style={{ fontFamily: title, fontSize: 17, color: '#3B2A1A' }}>FARM STATUS</div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#6E4523', marginTop: 4 }}>{helped} VISITORS HELPED TODAY</div>
        <div style={{ fontFamily: mono, fontSize: 12, color: '#B8802F' }}>{readyLabel}</div>
        <button type="button" onClick={farmActions.resetDemo} style={{ marginTop: 6, border: 0, background: 'transparent', cursor: 'pointer', fontFamily: mono, fontSize: 10, color: '#A9713C', padding: 0 }}>
          ↺ RESET DEMO
        </button>
      </div>
    </div>
  )
}

function Hotbar() {
  const win = useFarm((s) => s.win)
  return (
    <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#8B5A2B', padding: 8, display: 'flex', gap: 8, boxShadow: '4px 4px 0 rgba(0,0,0,.35)' }}>
      {SECTIONS.map((s, i) => {
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

export default function DesktopValley() {
  const scaleD = useFarm((s) => s.scaleD)
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#7FBFE6' }}>
      {/* The scene is one centered, contain-scaled 1440×900 canvas. The background
          layer shares this transform (so the horizon stays locked to the props) but
          its sky/grass bands extend far past the frame to fill the letterbox — no
          gap at any zoom, nothing cropped. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 1440,
          height: 900,
          transform: `translate(-50%, -50%) scale(${scaleD})`,
          transformOrigin: 'center',
        }}
      >
        <SceneBackground />
        <SceneProps />
        {DESKTOP_PETS.map((p) => (
          <DesktopPet key={p.zone} {...p} />
        ))}
        {ZONES.map((z) => (
          <ZonePlaque key={z.id} zone={z} />
        ))}
        {SECTIONS.filter((s) => s.id).map((s) => (
          <Poi key={s.id} id={s.id!} />
        ))}
        <StatusHud />
        <Hotbar />
      </div>
      <ContentWindow />
    </div>
  )
}
