'use client'

import { CATALOG } from '../data/cards'
import { exportCard } from '../canvas/exportCard'
import { farmActions, useFarm } from '../state/farmStore'
import Card from './Card'

const title = 'var(--farm-font-title)'
const mono = 'var(--farm-font-mono)'

function PixelButton({
  label,
  bg,
  fg,
  size,
  onClick,
}: {
  label: string
  bg: string
  fg: string
  size: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        border: 0,
        cursor: 'pointer',
        background: bg,
        color: fg,
        fontFamily: title,
        fontSize: size,
        padding: size >= 18 ? '10px 20px' : '8px 16px',
        boxShadow: '2px 2px 0 rgba(0,0,0,.3)',
      }}
    >
      {label}
    </button>
  )
}

export function HarvestModal() {
  const harvest = useFarm((s) => s.harvest)
  const show = useFarm((s) => s.showHarvest)
  if (!show || !harvest || !CATALOG[harvest.key]) return null
  const item = CATALOG[harvest.key]
  const zoneTitle = harvest.zone.split(' · ')[0]

  return (
    <div
      onClick={farmActions.keepItem}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(30,39,73,.6)', display: 'grid', placeItems: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 320, background: '#8B5A2B', padding: 6, boxShadow: '8px 8px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .25s ease-out' }}
      >
        <div style={{ background: '#4A2F18', padding: '8px 12px', fontFamily: title, fontSize: 20, color: '#F6E7C5' }}>
          {zoneTitle} HARVEST
        </div>
        <div style={{ background: '#F6E7C5', padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ textAlign: 'center', fontFamily: title, fontSize: 20, color: '#B8802F' }}>
            ⭐ NEW CARD! ⭐
          </div>
          <Card itemKey={harvest.key} item={item} num={harvest.num} artSize={104} />
          <div style={{ display: 'flex', gap: 8 }}>
            <PixelButton label="SHARE CARD" bg="#F2C14E" fg="#3B2A1A" size={17} onClick={farmActions.openShare} />
            <PixelButton label="KEEP" bg="#8B5A2B" fg="#F6E7C5" size={17} onClick={farmActions.keepItem} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ShareModal() {
  const harvest = useFarm((s) => s.harvest)
  const show = useFarm((s) => s.showShare)
  if (!show || !harvest || !CATALOG[harvest.key]) return null
  const item = CATALOG[harvest.key]

  return (
    <div
      onClick={farmActions.closeShare}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(30,39,73,.7)', display: 'grid', placeItems: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 360, background: '#F6E7C5', padding: 16, boxShadow: '8px 8px 0 rgba(0,0,0,.45)', animation: 'farm-pop .25s ease-out', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        <div style={{ textAlign: 'center', fontFamily: mono, fontSize: 11, letterSpacing: '.15em', color: '#8B5A2B' }}>
          I HELPED OJAN HARVEST
        </div>
        <Card itemKey={harvest.key} item={item} num={harvest.num} artSize={96} />
        <div style={{ textAlign: 'center', fontFamily: title, fontSize: 16, color: '#4A2F18' }}>
          ojantigakali.com → help the farm
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <PixelButton label="DOWNLOAD PNG" bg="#F2C14E" fg="#3B2A1A" size={18} onClick={() => exportCard(harvest.key, item, harvest.num)} />
          <PixelButton label="CLOSE" bg="#8B5A2B" fg="#F6E7C5" size={18} onClick={farmActions.closeShare} />
        </div>
      </div>
    </div>
  )
}

export function Toast() {
  const on = useFarm((s) => s.toastOn)
  const msg = useFarm((s) => s.toastMsg)
  if (!on) return null
  return (
    <div
      style={{ position: 'fixed', bottom: 32, left: '50%', zIndex: 80, transform: 'translateX(-50%)', background: '#4A2F18', color: '#F6E7C5', fontFamily: title, fontSize: 17, padding: '8px 18px', boxShadow: '3px 3px 0 rgba(0,0,0,.4)', animation: 'farm-toastUp .2s ease-out' }}
    >
      {msg}
    </div>
  )
}
