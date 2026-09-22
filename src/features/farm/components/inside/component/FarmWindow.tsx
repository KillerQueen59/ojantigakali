import { farmActions, useFarm } from '../../../state/farmStore'
import { ZONES } from '../../../data/zones'
import SceneBackground from '../../art/SceneBackground'
import SceneProps from '../../art/SceneProps'
import { TITLE, MONO, SCENE_W, SCENE_H, type HitFn } from './shared'

/** THE FARM · window to the outside. Live miniature stays dynamic; the sill under
 *  it is static pixel structure and now carries the GO OUTSIDE tag so the view is
 *  no longer covered. */
export default function FarmWindow({ hit }: { hit: HitFn }) {
  return (
    <div {...hit('farm', farmActions.goOutside, { position: 'absolute', left: 952, top: 74, width: 400 })}>
      <div style={{ background: '#6E4523', padding: 12, boxShadow: '7px 7px 0 rgba(0,0,0,.36), inset 2px 2px 0 #8B5A2B, inset -2px -2px 0 #4A2F18' }}>
        <div style={{ position: 'relative', height: 266, overflow: 'hidden', background: '#8FCBEE', boxShadow: 'inset 0 0 0 3px #4A2F18' }}>
          {/* Live miniature of the farm outside. */}
          <div style={{ position: 'absolute', left: -28, top: -2, width: SCENE_W, height: SCENE_H, transform: 'scale(0.30)', transformOrigin: '0 0', pointerEvents: 'none' }}>
            <SceneBackground />
            <SceneProps />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 11, background: '#6E4523', transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 11, background: '#6E4523', transform: 'translateX(-50%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,0) 40%)', pointerEvents: 'none' }} />
        </div>
        {/* Window sill: visible thickness with a lit top surface; carries the tag. */}
        <div style={{ position: 'relative', height: 42, marginTop: 8 }}>
          <div style={{ position: 'absolute', left: -6, right: -6, top: 14, height: 24, background: '#8B5A2B', boxShadow: 'inset 0 3px 0 #C68B54, inset 0 -5px 0 #4A2F18, 0 5px 0 rgba(0,0,0,.28)' }} />
          <div style={{ position: 'absolute', left: 4, top: -2, background: '#4A2F18', color: '#F6E7C5', fontFamily: TITLE, fontSize: 18, padding: '8px 13px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)' }}>GO OUTSIDE ↗</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '10px 3px 0' }}>
          <span style={{ fontFamily: TITLE, fontSize: 19, color: '#F6E7C5', whiteSpace: 'nowrap' }}>THE FARM</span>
          <FarmSummary />
        </div>
      </div>
    </div>
  )
}

/** Top-right THE FARM meta line: plots, helped today, harvests ready. */
function FarmSummary() {
  const helped = useFarm((s) => s.helped)
  const ready = useFarm((s) => ZONES.filter((z) => s.meters[z.id] >= 50).length)
  return (
    <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: '#C9A97A', whiteSpace: 'nowrap' }}>
      4 PLOTS · {helped} HELPED · {ready} READY
    </span>
  )
}
