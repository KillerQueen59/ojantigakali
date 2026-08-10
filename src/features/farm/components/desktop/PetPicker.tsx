'use client'

import type { ZoneId } from '../../data/cards'
import { PET_META, PET_ORDER, PETS } from '../../data/pets'
import { farmActions, useFarm } from '../../state/farmStore'
import PixelSprite from '../PixelSprite'

const title = 'var(--farm-font-title)'

function PetThumb({ zone }: { zone: ZoneId }) {
  const pet = PETS[zone]
  return (
    <div style={{ width: 34, height: 30, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <PixelSprite rows={pet.rows} palette={pet.palette} pixel={2} />
    </div>
  )
}

/**
 * Small, tucked top-left menu to choose which single critter roams the valley.
 * Kept unobtrusive on purpose — a side toy, not the main focus.
 */
export default function PetPicker() {
  const active = useFarm((s) => s.activePet)
  const focused = useFarm((s) => s.focusZone !== null)
  return (
    <div
      style={{ position: 'fixed', top: 20, left: 24, zIndex: 20, background: '#8B5A2B', padding: 4, boxShadow: '3px 3px 0 rgba(0,0,0,.35), inset 2px 2px 0 #A9713C, inset -2px -2px 0 #4A2F18', opacity: focused ? 0 : 1, pointerEvents: focused ? 'none' : 'auto', transition: 'opacity .3s ease' }}
    >
      <div style={{ background: '#F6E7C5', padding: '7px 9px', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
        <div style={{ fontFamily: title, fontSize: 14, color: '#3B2A1A', marginBottom: 5 }}>🐾 CRITTERS</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {PET_ORDER.map((zone) => {
            const on = active === zone
            return (
              <button
                key={zone}
                type="button"
                className="farm-tile"
                onClick={() => farmActions.setPet(zone)}
                title={PET_META[zone].label}
                aria-label={PET_META[zone].label}
                aria-pressed={on}
                style={{ position: 'relative', width: 40, height: 40, border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', background: on ? '#7A4E28' : '#6E4523', boxShadow: on ? 'inset 0 0 0 3px #F2C14E' : 'inset 2px 2px 0 #4A2F18, inset -2px -2px 0 #A9713C' }}
              >
                <PetThumb zone={zone} />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
