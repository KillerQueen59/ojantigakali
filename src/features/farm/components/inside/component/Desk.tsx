import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { farmActions, useFarm } from '../../../state/farmStore'
import PixelSprite from '../../PixelSprite'
import { SOFA, LAMP, FLOORPLANT, LOUNGE_PAL } from './pixelItems'
import { TITLE, MONO, BODY, type OpenWin, type TipKey } from './shared'

/** PROFILE · a cozy lounge on the rug ("sit down, get to know me"): a plush sofa
 *  flanked by a floor plant and a warm lamp, sitting at the back edge of the rug.
 *  Clicking the sofa opens the exact profile card; its minimize button returns to
 *  the lounge. */
export default function Desk({ openWin, setTip }: { openWin: OpenWin; setTip: Dispatch<SetStateAction<TipKey | null>> }) {
  const deskMin = useFarm((s) => s.deskMin)
  const tip = {
    onMouseEnter: () => setTip('desk'),
    onMouseLeave: () => setTip((t: TipKey | null) => (t === 'desk' ? null : t)),
  }

  return (
    <>
      {deskMin && (
        <>
          {/* decorative flanks (non-interactive) — feet aligned at the rug's back edge */}
          <div style={{ position: 'absolute', left: 452, bottom: 198, pointerEvents: 'none' }}>
            <PixelSprite rows={FLOORPLANT} palette={LOUNGE_PAL} pixel={5} style={{ display: 'block', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.22))' }} />
          </div>
          <div style={{ position: 'absolute', left: 852, bottom: 198, pointerEvents: 'none' }}>
            <PixelSprite rows={LAMP} palette={LOUNGE_PAL} pixel={5} style={{ display: 'block', filter: 'drop-shadow(3px 4px 0 rgba(0,0,0,.22))' }} />
            <div style={{ position: 'absolute', left: 40, top: 24, width: 0, height: 0, boxShadow: '0 0 44px 26px rgba(247,209,72,.22)' }} />
          </div>
          {/* the clickable sofa */}
          <div
            {...tip}
            className="farm-lift"
            onClick={farmActions.toggleDesk}
            style={{ position: 'absolute', left: 556, bottom: 198, cursor: 'pointer' }}
          >
            <PixelSprite rows={SOFA} palette={LOUNGE_PAL} pixel={6} style={{ display: 'block', filter: 'drop-shadow(4px 5px 0 rgba(0,0,0,.25))' }} />
            <div style={{ position: 'absolute', left: '50%', top: -32, transform: 'translateX(-50%) rotate(-1deg)', background: '#F6E7C5', padding: '7px 13px', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: TITLE, fontSize: 17, color: '#3B2A1A' }}>Muhammad Fauzan Ramadhan</span>
              <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 10, letterSpacing: '.08em', color: '#8B5A2B' }}>▸ SIT & READ</span>
            </div>
          </div>
        </>
      )}

      {!deskMin && (
        <div
          onClick={openWin('profile')}
          {...tip}
          style={{ position: 'absolute', left: 436, bottom: 250, width: 566, cursor: 'pointer' }}
        >
      <div style={{ position: 'relative', background: '#8B5A2B', padding: 6, boxShadow: '8px 8px 0 rgba(0,0,0,.4), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', transform: 'rotate(-.9deg)' }}>
        <button
          type="button"
          aria-label="Minimize desk"
          onClick={(e) => {
            e.stopPropagation()
            farmActions.toggleDesk()
          }}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 2, width: 30, height: 26, border: 0, cursor: 'pointer', background: '#6E4523', color: '#F6E7C5', fontFamily: TITLE, fontSize: 18, display: 'grid', placeItems: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,.3)' }}
        >
          –
        </button>
        <div style={{ background: '#F6E7C5', padding: '20px 24px 21px', display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div style={{ fontFamily: TITLE, fontSize: 34, lineHeight: 1, color: '#3B2A1A', paddingRight: 34 }}>Muhammad Fauzan Ramadhan</div>
          <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, letterSpacing: '.13em', color: '#6E4523' }}>“OJAN” · BACKEND ENGINEER · 4 YRS · BOGOR, INDONESIA</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, background: '#4E9A3E' }} />
            <span style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, letterSpacing: '.11em', color: '#4E9A3E' }}>OPEN TO WORK</span>
          </div>
          <div style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.6, color: '#3B2A1A', textWrap: 'pretty' }}>
            Four years building backend systems that move money. Currently on the Disbursement Team at OY! Indonesia, pushing high-volume fund transfers across payment providers.
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', paddingTop: 2 }}>
            {['JAVA', 'SPRING BOOT', 'POSTGRESQL', 'REDIS', 'RABBITMQ', 'ELASTICSEARCH'].map((s) => (
              <span key={s} style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, background: '#EDD9AC', color: '#6E4523', padding: '4px 8px' }}>{s}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, paddingTop: 7, borderTop: '2px dashed #D9C49A', marginTop: 4 }}>
            <DeskButton bg="#F2C14E" fg="#3B2A1A" onClick={openWin('profile')}>READ EVERYTHING</DeskButton>
            <DeskButton bg="#6E4523" fg="#F6E7C5" onClick={openWin('resume')}>RESUME ↓</DeskButton>
            <DeskButton bg="#6E4523" fg="#F6E7C5" onClick={copyEmail}>COPY EMAIL</DeskButton>
          </div>
        </div>
        </div>
        </div>
      )}
    </>
  )
}

function copyEmail() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText('hello@ojantigakali.com').catch(() => {})
  }
  farmActions.toggleWin('contact')
}

function DeskButton({ bg, fg, onClick, children }: { bg: string; fg: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      className="farm-action"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      style={{ border: 0, cursor: 'pointer', fontFamily: TITLE, fontSize: 17, background: bg, color: fg, padding: '9px 14px', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', whiteSpace: 'nowrap' }}
    >
      {children}
    </button>
  )
}
