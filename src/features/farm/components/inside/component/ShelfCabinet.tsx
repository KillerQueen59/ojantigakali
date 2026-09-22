import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react'
import { farmActions, useFarm } from '../../../state/farmStore'
import PixelSprite from '../../PixelSprite'
import { SHELF_PAL, SHELF_FRAME, TROPHY_ITEMS, BOOK_ITEMS } from './pixelItems'
import { TITLE, MONO, type OpenWin, type TipKey } from './shared'

const PX = 3
const WIDTH = SHELF_FRAME[0].length * PX // 228
const HEIGHT = SHELF_FRAME.length * PX // 288
const TROPHY_H = 41 * PX // split under the two upper (trophy) shelves

const layer: CSSProperties = { position: 'absolute', left: 0, top: 0, display: 'block', pointerEvents: 'none' }
const tag: CSSProperties = {
  fontFamily: TITLE,
  fontSize: 12,
  color: '#3B2A1A',
  background: '#F6E7C5',
  padding: '2px 7px',
  boxShadow: '2px 2px 0 rgba(0,0,0,.3)',
  whiteSpace: 'nowrap',
}
const zoneBtn: CSSProperties = { position: 'absolute', left: 0, width: WIDTH, border: 0, padding: 0, background: 'transparent', cursor: 'pointer' }
// only the item layers move; the wooden frame stays put
const lift = (on: boolean): CSSProperties => ({
  transform: on ? 'translateY(-4px)' : 'none',
  filter: on ? 'brightness(1.06)' : 'none',
  transition: 'transform .12s ease, filter .12s ease',
})

/**
 * One wooden cabinet holding BOTH the trophy case (upper two shelves) and the
 * bookshelf (lower two shelves). The frame is a static layer; the trophies and
 * books are separate layers that lift on hover of their zone. Two invisible
 * zones keep the separate interactions — top opens the trophy case, bottom
 * opens Education.
 */
export default function ShelfCabinet({ openWin, setTip }: { openWin: OpenWin; setTip: Dispatch<SetStateAction<TipKey | null>> }) {
  const n = useFarm((s) => s.inventory.length)
  const [hover, setHover] = useState<'trophy' | 'education' | null>(null)
  const zone = (key: 'trophy' | 'education') => ({
    onMouseEnter: () => {
      setHover(key)
      setTip(key)
    },
    onMouseLeave: () => {
      setHover((h) => (h === key ? null : h))
      setTip((t: TipKey | null) => (t === key ? null : t))
    },
  })
  return (
    <div style={{ position: 'absolute', left: 140, top: 344, width: WIDTH, height: HEIGHT }}>
      <PixelSprite rows={SHELF_FRAME} palette={SHELF_PAL} pixel={PX} style={{ ...layer, filter: 'drop-shadow(5px 6px 0 rgba(0,0,0,.34))' }} />
      <PixelSprite rows={TROPHY_ITEMS} palette={SHELF_PAL} pixel={PX} style={{ ...layer, ...lift(hover === 'trophy') }} />
      <PixelSprite rows={BOOK_ITEMS} palette={SHELF_PAL} pixel={PX} style={{ ...layer, ...lift(hover === 'education') }} />

      <button type="button" onClick={farmActions.openTrophy} {...zone('trophy')} style={{ ...zoneBtn, top: 0, height: TROPHY_H }}>
        <span style={{ position: 'absolute', left: 8, bottom: 8, ...tag, display: 'flex', alignItems: 'baseline', gap: 6 }}>
          TROPHIES
          <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 10, color: '#8B5A2B' }}>{n}</span>
        </span>
      </button>
      <button type="button" onClick={openWin('education')} {...zone('education')} style={{ ...zoneBtn, top: TROPHY_H, height: HEIGHT - TROPHY_H }}>
        <span style={{ position: 'absolute', left: 8, bottom: 8, ...tag }}>BOOKSHELF · EDUCATION</span>
      </button>
    </div>
  )
}
