import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react'
import PixelSprite from '../../PixelSprite'
import { TV_PAL, TV_FRAME, TV_SCREEN, TV_DRAWER_T, TV_DRAWER_B } from './pixelItems'
import { TITLE, MONO, type OpenWin, type TipKey } from './shared'

const PX = 5
const WIDTH = TV_FRAME[0].length * PX // 290
const HEIGHT = TV_FRAME.length * PX // 320

const layer: CSSProperties = { position: 'absolute', left: 0, top: 0, display: 'block', pointerEvents: 'none' }
const zoneBtn: CSSProperties = { position: 'absolute', border: 0, padding: 0, background: 'transparent', cursor: 'pointer' }
const label: CSSProperties = { position: 'absolute', pointerEvents: 'none', left: '50%', transform: 'translateX(-50%)', background: '#F6E7C5', color: '#3B2A1A', fontFamily: TITLE, padding: '2px 8px', boxShadow: '2px 2px 0 rgba(0,0,0,.3)', whiteSpace: 'nowrap' }

const screenGlow = (on: boolean): CSSProperties => ({
  animation: 'farm-tvFlicker 6s ease-in-out infinite',
  filter: on ? 'drop-shadow(0 0 12px rgba(123,217,168,.65)) brightness(1.14)' : 'drop-shadow(0 0 6px rgba(123,217,168,.42))',
  transition: 'filter .14s ease',
})
const openDrawer = (on: boolean): CSSProperties => ({
  transform: on ? 'translateY(3px)' : 'none',
  filter: on ? 'brightness(1.1)' : 'none',
  transition: 'transform .12s ease, filter .12s ease',
})

type Zone = 'work' | 'resume' | 'contact'

/**
 * Retro TV on a chest of drawers, consolidating three sections. The glowing CRT
 * is WORK (the highlight — biggest element, animated screen, gold nameplate); the
 * two stacked drawers are Resume (top) and Contact (bottom). The wooden frame is a
 * static layer; only the screen (idle CRT flicker/glow) and the hovered drawer move.
 */
export default function TvConsole({ openWin, setTip }: { openWin: OpenWin; setTip: Dispatch<SetStateAction<TipKey | null>> }) {
  const [hover, setHover] = useState<Zone | null>(null)
  const zone = (key: Zone, tip: TipKey) => ({
    onMouseEnter: () => {
      setHover(key)
      setTip(tip)
    },
    onMouseLeave: () => {
      setHover((h) => (h === key ? null : h))
      setTip((t: TipKey | null) => (t === tip ? null : t))
    },
  })
  return (
    <div style={{ position: 'absolute', left: 1076, top: 538, width: WIDTH, height: HEIGHT }}>
      <PixelSprite rows={TV_FRAME} palette={TV_PAL} pixel={PX} style={{ ...layer, filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.34))' }} />
      <PixelSprite rows={TV_SCREEN} palette={TV_PAL} pixel={PX} style={{ ...layer, ...screenGlow(hover === 'work') }} />
      <PixelSprite rows={TV_DRAWER_T} palette={TV_PAL} pixel={PX} style={{ ...layer, ...openDrawer(hover === 'resume') }} />
      <PixelSprite rows={TV_DRAWER_B} palette={TV_PAL} pixel={PX} style={{ ...layer, ...openDrawer(hover === 'contact') }} />

      {/* click zones */}
      <button type="button" onClick={openWin('experience')} {...zone('work', 'experience')} style={{ ...zoneBtn, left: 55, top: 30, width: 185, height: 145 }} aria-label="Work experience" />
      <button type="button" onClick={openWin('resume')} {...zone('resume', 'resume')} style={{ ...zoneBtn, left: 40, top: 185, width: 210, height: 52 }} aria-label="Resume" />
      <button type="button" onClick={openWin('contact')} {...zone('contact', 'contact')} style={{ ...zoneBtn, left: 40, top: 240, width: 210, height: 52 }} aria-label="Contact" />

      {/* labels — Work is the highlight */}
      <span style={{ ...label, top: 160, background: '#F2C14E', fontSize: 16, letterSpacing: '.02em', display: 'flex', alignItems: 'baseline', gap: 6 }}>
        WORK · EXPERIENCE
        <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 10, color: '#6E4523' }}>02</span>
      </span>
      <span style={{ ...label, top: 199, fontSize: 13 }}>RESUME ↓</span>
      <span style={{ ...label, top: 254, fontSize: 13 }}>CONTACT</span>
    </div>
  )
}
