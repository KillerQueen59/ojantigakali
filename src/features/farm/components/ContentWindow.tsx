'use client'

import { WINDOW_CONTENT } from '../data/content'
import { farmActions, useFarm } from '../state/farmStore'

const title = 'var(--farm-font-title)'
const body = 'var(--farm-font-body)'

/**
 * Section reader modal, shared by the inside farmhouse and the outside valley.
 * Reads `win` from the store and renders the matching WINDOW_CONTENT entry.
 */
export default function ContentWindow() {
  const win = useFarm((s) => s.win)
  if (!win) return null
  const { title: winTitle, body: winBody } = WINDOW_CONTENT[win]
  return (
    <div
      onClick={farmActions.closeWin}
      style={{ position: 'fixed', inset: 0, zIndex: 55, background: 'rgba(26,15,6,.6)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', top: 96, left: '50%', transform: 'translateX(-50%)', width: 660, maxWidth: 'calc(100vw - 32px)', background: '#8B5A2B', padding: 6, boxShadow: '10px 10px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .18s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#4A2F18', padding: '8px 12px' }}>
          <span style={{ fontFamily: title, fontSize: 20, color: '#F6E7C5', letterSpacing: '.04em' }}>{winTitle}</span>
          <button type="button" onClick={farmActions.closeWin} aria-label="Close" style={{ width: 30, height: 26, border: 0, cursor: 'pointer', background: '#C8483A', color: '#FFF', fontFamily: title, fontSize: 18, display: 'grid', placeItems: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,.35)' }}>✕</button>
        </div>
        <div style={{ background: '#F6E7C5', padding: '24px 28px', fontFamily: body, fontSize: 16, lineHeight: 1.65, color: '#3B2A1A', maxHeight: '70vh', overflow: 'auto' }}>
          {winBody}
        </div>
      </div>
    </div>
  )
}
