import type { Dispatch, SetStateAction } from 'react'
import { farmActions, useFarm } from '../../../state/farmStore'
import { CRITTERS, NEST_PAL } from '../../../data/critters'
import PixelSprite from '../../PixelSprite'
import { type TipKey } from './shared'

/** The active critter's nest, sitting on the floor. Clicking it opens the
 *  "MY CRITTER" picker modal. The critter itself roams the room separately. */
export default function CritterNest({ setTip }: { setTip: Dispatch<SetStateAction<TipKey | null>> }) {
  const activeCritter = useFarm((s) => s.activeCritter)
  const nest = CRITTERS[activeCritter].nest
  return (
    <div
      className="farm-lift"
      onClick={farmActions.openCritters}
      onMouseEnter={() => setTip('critter')}
      onMouseLeave={() => setTip((t) => (t === 'critter' ? null : t))}
      style={{ position: 'absolute', left: 168, bottom: 44, cursor: 'pointer' }}
    >
      <PixelSprite rows={nest} palette={NEST_PAL} pixel={5} style={{ display: 'block', filter: 'drop-shadow(4px 5px 0 rgba(0,0,0,.28))' }} />
    </div>
  )
}
