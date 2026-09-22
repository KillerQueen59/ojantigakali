'use client'

import { CATALOG, CATALOG_KEYS } from '../data/cards'
import { CRITTERS, CRITTER_ORDER, CRITTER_PAL, NEST_PAL } from '../data/critters'
import { exportCard } from '../canvas/exportCard'
import { farmActions, useFarm } from '../state/farmStore'
import Card from './Card'
import PixelSprite from './PixelSprite'

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

/** Trophy shelf: every harvest card the visitor has collected. */
export function TrophyModal() {
  const show = useFarm((s) => s.showTrophy)
  const inventory = useFarm((s) => s.inventory)
  const account = useFarm((s) => s.account)
  if (!show) return null
  const items = inventory.filter((e) => CATALOG[e.key])
  const unique = new Set(items.map((e) => e.key)).size

  return (
    <div
      onClick={farmActions.closeTrophy}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,15,6,.62)', display: 'grid', placeItems: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 720, maxWidth: 'calc(100vw - 32px)', background: '#8B5A2B', padding: 6, boxShadow: '10px 10px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .2s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#4A2F18', padding: '8px 12px' }}>
          <span style={{ fontFamily: title, fontSize: 20, color: '#F6E7C5', letterSpacing: '.04em' }}>
            TROPHY SHELF · {unique}/{CATALOG_KEYS.length} SPECIES
          </span>
          <button type="button" onClick={farmActions.closeTrophy} aria-label="Close" style={{ width: 30, height: 26, border: 0, cursor: 'pointer', background: '#C8483A', color: '#FFF', fontFamily: title, fontSize: 18, display: 'grid', placeItems: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,.35)' }}>✕</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, background: '#EBD7A9', padding: '8px 14px', flexWrap: 'wrap' }}>
          {account?.kind === 'user' ? (
            <>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: mono, fontSize: 11, letterSpacing: '.06em', color: '#4A2F18' }}>
                {account.avatarUrl && (
                  <img src={account.avatarUrl} alt="" width={20} height={20} style={{ imageRendering: 'pixelated', borderRadius: 2 }} />
                )}
                SYNCED · {account.displayName ?? 'GITHUB'}
              </span>
              <button type="button" onClick={farmActions.signOut} style={{ border: 0, cursor: 'pointer', background: '#8B5A2B', color: '#F6E7C5', fontFamily: title, fontSize: 13, padding: '5px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,.3)' }}>
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.06em', color: '#8B5A2B' }}>
                PLAYING AS GUEST · CARDS SAVED TO THIS BROWSER
              </span>
              <button type="button" onClick={farmActions.signIn} style={{ border: 0, cursor: 'pointer', background: '#2B2B2B', color: '#F6E7C5', fontFamily: title, fontSize: 13, padding: '5px 12px', boxShadow: '2px 2px 0 rgba(0,0,0,.3)' }}>
                SYNC WITH GITHUB
              </button>
            </>
          )}
        </div>
        <div style={{ background: '#F6E7C5', padding: '20px 22px', maxHeight: '72vh', overflow: 'auto' }}>
          {items.length === 0 ? (
            <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: '#C8483A', padding: '30px 0', textAlign: 'center' }}>
              EMPTY — GO OUTSIDE, FILL A METER TO 50, AND HARVEST
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 14 }}>
              {items.map((e, i) => (
                <Card key={`${e.key}-${e.num}-${i}`} itemKey={e.key} item={CATALOG[e.key]} num={e.num} artSize={88} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** MY CRITTER: pick the house pet that roams the farmhouse. Opened by its nest. */
export function CrittersModal() {
  const show = useFarm((s) => s.showCritters)
  const active = useFarm((s) => s.activeCritter)
  const unlocked = useFarm((s) => s.unlockedCritters)
  if (!show) return null
  return (
    <div
      onClick={farmActions.closeCritters}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,15,6,.62)', display: 'grid', placeItems: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#8B5A2B', padding: 6, boxShadow: '10px 10px 0 rgba(0,0,0,.45), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', animation: 'farm-pop .2s ease-out' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#4A2F18', padding: '8px 12px' }}>
          <span style={{ fontFamily: title, fontSize: 20, color: '#F6E7C5', letterSpacing: '.04em' }}>
            MY CRITTER · {unlocked.length}/{CRITTER_ORDER.length}
          </span>
          <button type="button" onClick={farmActions.closeCritters} aria-label="Close" style={{ width: 30, height: 26, border: 0, cursor: 'pointer', background: '#C8483A', color: '#FFF', fontFamily: title, fontSize: 18, display: 'grid', placeItems: 'center', boxShadow: '2px 2px 0 rgba(0,0,0,.35)' }}>✕</button>
        </div>
        <div style={{ background: '#F6E7C5', padding: '18px 20px', display: 'flex', gap: 12 }}>
          {CRITTER_ORDER.map((id) => {
            const c = CRITTERS[id]
            const on = active === id
            const isUnlocked = unlocked.includes(id)
            return (
              <button
                key={id}
                type="button"
                onClick={() => farmActions.setCritter(id)}
                aria-pressed={on}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, border: 0, cursor: 'pointer', background: 'transparent', padding: 0 }}
              >
                <span style={{ position: 'relative', width: 96, height: 92, overflow: 'hidden', background: '#CBB07A', boxShadow: on ? 'inset 0 0 0 3px #F2C14E' : 'inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18' }}>
                  <span style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 16, background: '#8B5A2B', boxShadow: 'inset 0 3px 0 #A9713C' }} />
                  <PixelSprite rows={c.nest} palette={NEST_PAL} pixel={3} style={{ position: 'absolute', left: '50%', bottom: 8, transform: 'translateX(-50%)', filter: isUnlocked ? undefined : 'grayscale(0.9) brightness(0.92)' }} />
                  <PixelSprite rows={c.pet.rows} palette={CRITTER_PAL} pixel={3} style={{ position: 'absolute', left: '53%', bottom: 5, transform: 'translateX(-50%)', filter: isUnlocked ? 'drop-shadow(0 1px 0 rgba(0,0,0,.35))' : 'grayscale(1) brightness(0.75)' }} />
                  {!isUnlocked && (
                    <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(43,32,40,.3)', fontSize: 26 }}>🔒</span>
                  )}
                </span>
                <span style={{ fontFamily: mono, fontWeight: 600, fontSize: 10, letterSpacing: '.06em', color: on ? '#B8802F' : isUnlocked ? '#4A2F18' : '#9A8A6A' }}>{id.toUpperCase()}</span>
              </button>
            )
          })}
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
