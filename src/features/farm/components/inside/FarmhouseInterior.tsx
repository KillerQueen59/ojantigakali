'use client'

import { useState, type CSSProperties } from 'react'
import { farmActions, useFarm } from '../../state/farmStore'
import type { SectionId } from '../../state/farmStore'
import DesktopPet from '../desktop/DesktopPet'
import { CRITTERS } from '../../data/critters'
import { MONO, SCENE_W, SCENE_H, TIPS, type Interactive, type TipKey } from './component/shared'
import RoomShell from './component/RoomShell'
import WallClock from './component/Clock'
import About from './component/About'
import ShelfCabinet from './component/ShelfCabinet'
import Projects from './component/Projects'
import FarmWindow from './component/FarmWindow'
import Desk from './component/Desk'
import TvConsole from './component/TvConsole'
import CritterNest from './component/CritterNest'

/**
 * The "inside" half of the world: a hand-drawn 1440×900 farmhouse interior that
 * doubles as the main menu. The room's architecture (walls, beams, studs, floor,
 * ceiling, wainscot, archway, fireplace, rug) is real pixel art drawn by
 * <RoomShell> as crisp SVG rects; each furniture piece is its own component in
 * ./component and opens a section reader (shared ContentWindow, mounted by
 * FarmExperience) or steps outside to the farm. Contain-scaled to the limiting
 * axis like the outside valley; the letterbox is the dark wood backdrop.
 */
export default function FarmhouseInterior() {
  const scaleD = useFarm((s) => s.scaleD)
  const activeCritter = useFarm((s) => s.activeCritter)
  const [tip, setTip] = useState<TipKey | null>(null)

  // A furniture piece: fires an action, lifts on hover, and sets the caption.
  const hit = (key: TipKey, onClick: () => void, extra?: CSSProperties): Interactive => ({
    className: 'farm-lift',
    onClick,
    onMouseEnter: () => setTip(key),
    onMouseLeave: () => setTip((t) => (t === key ? null : t)),
    style: { cursor: 'pointer', ...extra },
  })

  const openWin = (id: SectionId) => () => farmActions.toggleWin(id)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#241A12' }}>
      {/* Contain-scaled fixed stage. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: SCENE_W,
          height: SCENE_H,
          transform: `translate(-50%, -50%) scale(${scaleD})`,
          transformOrigin: 'center',
          fontFamily: MONO,
          userSelect: 'none',
        }}
      >
        {/* ── Room architecture (static pixel art) ───────────────────────── */}
        <RoomShell />

        {/* Atmospheric warm vignette from the window. */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(closest-side at 62% 34%,rgba(255,226,160,.24),rgba(30,18,8,.34) 92%)', pointerEvents: 'none' }} />

        {/* Fireplace flames (dynamic — the hearth/mantel are in RoomShell) */}
        <div style={{ position: 'absolute', left: 34, top: 466, width: 70, height: 190, background: '#2A1A0E', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 8, bottom: 16, width: 54, height: 22, background: '#7A4B22' }} />
          <div style={{ position: 'absolute', left: 14, bottom: 34, width: 42, height: 52, background: '#F0932B', animation: 'farm-flick 1.1s steps(3,end) infinite', transformOrigin: '50% 100%' }} />
          <div style={{ position: 'absolute', left: 24, bottom: 40, width: 22, height: 34, background: '#F7D148', animation: 'farm-flick .7s steps(3,end) infinite', transformOrigin: '50% 100%' }} />
        </div>

        {/* Hanging lamp (dynamic sway + glow; mount plate/cord anchor in RoomShell) */}
        <div style={{ position: 'absolute', left: 678, top: 26, width: 8, height: 62, background: '#4A2F18' }} />
        <div style={{ position: 'absolute', left: 614, top: 84, width: 136, height: 20, background: '#4A2F18', animation: 'farm-lampSway 5s ease-in-out infinite', transformOrigin: '50% -60px' }} />
        <div style={{ position: 'absolute', left: 640, top: 100, width: 84, height: 26, background: '#F7D148', boxShadow: '0 0 42px 22px rgba(247,209,72,.28)' }} />

        {/* Clock — live, on Jakarta time (WIB, UTC+7). Left as-is. */}
        <WallClock />

        {/* Dust motes (dynamic) */}
        <div style={{ position: 'absolute', left: 342, top: 196, width: 9, height: 9, background: 'rgba(255,240,200,.7)', animation: 'farm-dustRise 7s linear infinite' }} />
        <div style={{ position: 'absolute', left: 918, top: 246, width: 7, height: 7, background: 'rgba(255,240,200,.6)', animation: 'farm-dustRise 9s linear infinite 1.4s' }} />
        <div style={{ position: 'absolute', left: 1108, top: 300, width: 8, height: 8, background: 'rgba(255,240,200,.5)', animation: 'farm-dustRise 8s linear infinite 3s' }} />

        {/* ── Furniture (each its own component) ──────────────────────────── */}
        <About hit={hit} openWin={openWin} />
        <ShelfCabinet openWin={openWin} setTip={setTip} />
        <Projects hit={hit} openWin={openWin} />
        <FarmWindow hit={hit} />
        <Desk openWin={openWin} setTip={setTip} />
        <TvConsole openWin={openWin} setTip={setTip} />

        {/* Your critter — lives inside with you, roams the farm outside */}
        <DesktopPet key={activeCritter} zone="crop" pet={CRITTERS[activeCritter].pet} minX={176} maxX={660} groundY={862} minY={340} maxY={720} pxSpeed={0.013} pixel={CRITTERS[activeCritter].pet.pixel} />

        <CritterNest setTip={setTip} />

        <div style={{ position: 'absolute', left: 26, top: 26, fontFamily: MONO, fontWeight: 500, fontSize: 10, letterSpacing: '.13em', color: 'rgba(246,231,197,.72)' }}>OJAN.FARM v2.0 · INSIDE THE FARMHOUSE</div>

        {/* Hover caption */}
        {tip && (
          <div style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', background: 'rgba(58,36,18,.9)', color: '#F6E7C5', fontFamily: 'var(--farm-font-title)', fontSize: 17, padding: '9px 18px', boxShadow: '3px 3px 0 rgba(0,0,0,.35)', whiteSpace: 'nowrap' }}>
            {TIPS[tip]}
          </div>
        )}
      </div>
    </div>
  )
}
