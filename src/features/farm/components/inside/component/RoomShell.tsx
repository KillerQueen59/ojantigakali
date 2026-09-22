import { SCENE_W, SCENE_H } from './shared'

/**
 * The room's static architecture, drawn as crisp SVG pixel art on the shared
 * 1440×900 grid (same idiom as SceneBackground / SceneProps). Gives the flat
 * back wall its bones: ceiling rafters, exposed beams, timber studs, corner
 * posts, a chair-rail, wainscot panelling, a perspective floor with baseboard,
 * a window light-wash, a side archway, and the static fireplace + rug.
 *
 * Purely decorative and non-interactive: sits behind every furniture piece with
 * pointer-events disabled, so it never intercepts a click or covers a label.
 * Anything that moves (flames, lamp sway, dust, clock) stays in the parent.
 */

// ── Palette (all inside the existing farm wood/parchment tokens) ────────────
const WALL = '#B5794A'
const WALL_DARK = '#A96C3B' // one shade darker — light-direction shading
const WASH = '#BE7F4A' // hard-edged warm wash from the window
const WOOD = '#6E4523'
const WOOD_DARK = '#4A2F18'
const WOOD_DARKER = '#2A1A0E'
const WOOD_LIGHT = '#A9713C'
const WOOD_LIGHTER = '#C68B54'
const FLOOR_A = '#8B5A2B'
const FLOOR_B = '#7A4E28'
const SEAM = '#5E3D1F'
const SHADOW = '#5E3D1F' // flat drop / contact shadow on wood & floor
const EMBER = '#2A1A0E'

// ── Vertical bands ──────────────────────────────────────────────────────────
const CEIL_H = 58 // ceiling gap plane
const BEAM_TOP = 58 // exposed ceiling beam
const BEAM_BOT = 88
const WALL_TOP = 88
const RAIL_TOP = 440 // chair-rail beam (~65% down the wall)
const RAIL_BOT = 470
const WAINSCOT_BOT = 636 // meets the baseboard
const BASE_BOT = 652 // baseboard trim
const POST_W = 34 // corner posts (wider than studs)

type R = { x: number; y: number; w: number; h: number; f: string }

export default function RoomShell() {
  const rects: R[] = []
  const push = (x: number, y: number, w: number, h: number, f: string) => rects.push({ x, y, w, h, f })

  // ── Ceiling plane (planks in shadow) + rafters running toward the viewer ──
  push(0, 0, SCENE_W, CEIL_H, '#3A2410')
  for (let gx = 0; gx < SCENE_W; gx += 160) push(gx, 0, 2, CEIL_H, WOOD_DARKER) // plank gaps
  // rafters narrow slightly toward the room's centre for a shallow perspective
  const rafters = [
    { x: 96, w: 30 },
    { x: 372, w: 26 },
    { x: 700, w: 22 },
    { x: 1024, w: 26 },
    { x: 1310, w: 30 },
  ]
  for (const rf of rafters) {
    push(rf.x, 0, rf.w, CEIL_H, WOOD)
    push(rf.x, 0, 2, CEIL_H, WOOD_LIGHT) // lit left edge
    push(rf.x + rf.w - 2, 0, 2, CEIL_H, WOOD_DARKER) // dark right edge
  }

  // ── Exposed ceiling beam (lit top face, dark under-face) ──────────────────
  push(0, BEAM_TOP, SCENE_W, BEAM_BOT - BEAM_TOP, WOOD)
  push(0, BEAM_TOP, SCENE_W, 6, WOOD_LIGHT) // lit top
  push(0, BEAM_BOT - 6, SCENE_W, 6, WOOD_DARK) // dark under

  // ── Wall field ────────────────────────────────────────────────────────────
  // (base + window light-wash are painted in the JSX below, before these rects,
  // so the wash reads through; everything pushed here sits on top of it.)

  // Light-direction shading: darken the far-left and lower-left one shade.
  push(POST_W, WALL_TOP, 300 - POST_W, WAINSCOT_BOT - WALL_TOP, WALL_DARK)
  push(POST_W, RAIL_BOT, 640 - POST_W, WAINSCOT_BOT - RAIL_BOT, WALL_DARK)

  // Window light-wash: a hard-edged parallelogram spilling down-left from the
  // farm window (upper right). Rendered as a polygon below.

  // Timber studs across the upper wall: 2px dark seam + 1px lit left edge.
  const studTop = BEAM_BOT
  const studBot = RAIL_TOP
  for (let x = 80; x <= 1360; x += 120) {
    push(x - 1, studTop, 1, studBot - studTop, WOOD_LIGHTER) // left highlight
    push(x, studTop, 2, studBot - studTop, WOOD) // seam
  }

  // ── Chair-rail beam ───────────────────────────────────────────────────────
  push(POST_W, RAIL_TOP, SCENE_W - 2 * POST_W, RAIL_BOT - RAIL_TOP, WOOD)
  push(POST_W, RAIL_TOP, SCENE_W - 2 * POST_W, 6, WOOD_LIGHT) // lit top
  push(POST_W, RAIL_BOT - 6, SCENE_W - 2 * POST_W, 6, WOOD_DARK) // dark under

  // ── Wainscot: panelled lower wall in a distinct shade ─────────────────────
  push(POST_W, RAIL_BOT, SCENE_W - 2 * POST_W, WAINSCOT_BOT - RAIL_BOT, WOOD_LIGHT)
  push(POST_W, RAIL_BOT, SCENE_W - 2 * POST_W, 4, WOOD_LIGHTER) // top rail highlight
  // recessed panels
  const panelTop = RAIL_BOT + 16
  const panelBot = WAINSCOT_BOT - 10
  for (let x = 70; x < SCENE_W - 90; x += 190) {
    const w = 150
    push(x, panelTop, w, panelBot - panelTop, WOOD) // recess
    push(x, panelTop, w, 3, WOOD_DARK) // shadowed inner top
    push(x, panelTop, 3, panelBot - panelTop, WOOD_DARK) // shadowed inner left
    push(x + w - 3, panelTop, 3, panelBot - panelTop, WOOD_LIGHTER) // lit inner right
    push(x, panelBot - 3, w, 3, WOOD_LIGHTER) // lit inner bottom
  }

  // ── Baseboard trim: lit top edge, body, shadow line into the floor ────────
  push(POST_W, WAINSCOT_BOT, SCENE_W - 2 * POST_W, BASE_BOT - WAINSCOT_BOT, FLOOR_A)
  push(POST_W, WAINSCOT_BOT, SCENE_W - 2 * POST_W, 3, WOOD_LIGHTER) // lit top
  push(POST_W, BASE_BOT - 4, SCENE_W - 2 * POST_W, 4, WOOD_DARK) // shadow line

  // ── Floorboards: rows grow toward the front (bottom) for perspective ──────
  let y = BASE_BOT
  let rowH = 18
  let row = 0
  while (y < SCENE_H) {
    const h = Math.min(rowH, SCENE_H - y)
    push(0, y, SCENE_W, h, row % 2 === 0 ? FLOOR_A : FLOOR_B)
    push(0, y, SCENE_W, 2, SEAM) // seam between boards
    // vertical plank seams, offset per row and spaced tighter toward the back
    const step = 150 + row * 14
    const off = (row % 2) * (step / 2)
    for (let x = off; x < SCENE_W; x += step) push(x, y, 3, h, SEAM)
    // lower-left floor darkening (same light direction), one seam-shade band
    const dw = 480 - row * 30
    if (dw > 0) push(0, y, dw, 2, SEAM)
    y += h
    rowH += 4
    row++
  }

  // ── Corner posts: frame the room, slightly wider than the studs ───────────
  for (const px of [0, SCENE_W - POST_W]) {
    push(px, BEAM_TOP, POST_W, SCENE_H - BEAM_TOP, WOOD)
    const innerLit = px === 0 ? px + POST_W - 3 : px // light comes from the right
    push(innerLit, BEAM_TOP, 3, SCENE_H - BEAM_TOP, WOOD_LIGHT)
    const outerDark = px === 0 ? px : px + POST_W - 3
    push(outerDark, BEAM_TOP, 3, SCENE_H - BEAM_TOP, WOOD_DARK)
  }

  // ── Side archway (implies somewhere else) — an arched alcove in the empty
  //    mid-wall between the notice board and the farm window, below the clock. ─
  const aL = 806
  const aR = 930
  const aTop = 220
  const aBot = RAIL_TOP // meets the chair rail
  // opening interior (a dim hallway beyond)
  push(aL, aTop, aR - aL, aBot - aTop, WOOD_DARKER)
  push(aL + 14, aTop + 40, aR - aL - 28, aBot - aTop - 40, '#3A2410') // faint lit room beyond
  // jambs + header frame
  push(aL - 16, aTop, 16, aBot - aTop, WOOD)
  push(aR, aTop, 16, aBot - aTop, WOOD)
  push(aL - 16, aTop - 16, aR - aL + 32, 16, WOOD)
  push(aL - 16, aTop - 16, aR - aL + 32, 4, WOOD_LIGHT) // lit header top
  push(aL, aTop, 3, aBot - aTop, WOOD_LIGHT) // window-lit inner edge (right of left jamb)
  push(aR - 3, aTop, 3, aBot - aTop, WOOD_DARK) // shadowed inner edge
  // stepped arch corners
  for (let i = 0; i < 5; i++) {
    const s = (i + 1) * 6
    push(aL, aTop + i * 5, s, 5, WOOD)
    push(aR - s, aTop + i * 5, s, 5, WOOD)
  }

  // ── Lamp fixture: rafter cross-tie + ceiling mount plate (cord/shade stay
  //    dynamic in the parent, hung from here). ───────────────────────────────
  push(600, BEAM_BOT - 2, 180, 6, WOOD_DARK) // cross-tie under the beam
  push(672, BEAM_BOT + 2, 20, 10, WOOD) // mount plate
  push(672, BEAM_BOT + 2, 20, 3, WOOD_LIGHT)

  // ── Fireplace (static stonework; the flames stay animated in the parent) ──
  push(56, 214, 26, 232, '#5A3819') // flue
  push(34, 196, 70, 22, WOOD_DARK) // flue cap
  push(22, 436, 94, 250, WOOD) // mantel body
  push(22, 436, 94, 5, WOOD_LIGHT)
  push(27, 441, 84, 240, WOOD) // inner
  push(27, 441, 5, 240, WOOD_DARK)
  push(106, 441, 5, 240, WOOD_DARK)
  push(34, 466, 70, 190, EMBER) // firebox opening
  push(42, 640, 54, 22, '#7A4B22') // log bed (static)
  push(14, 672, 110, 16, WOOD_DARK) // hearth base
  push(10, 686, 118, 8, SHADOW) // contact shadow on floor

  // ── Rug (static) on the floor — same footprint as before (x376, y694, 640×172) ─
  push(372, 690, 648, 6, SHADOW) // contact shadow where the rug meets the floor
  push(376, 694, 640, 172, '#8E3B3E') // field
  push(376, 694, 640, 10, '#C0564A') // border ring (top / bottom / sides)
  push(376, 856, 640, 10, '#C0564A')
  push(376, 694, 10, 172, '#C0564A')
  push(1006, 694, 10, 172, '#C0564A')
  // faint inner gold frame (x452, y736, 488×88)
  push(452, 736, 488, 4, '#B98A4E')
  push(452, 820, 488, 4, '#B98A4E')
  push(452, 736, 4, 88, '#B98A4E')
  push(936, 736, 4, 88, '#B98A4E')
  for (let x = 398; x < 1010; x += 40) push(x, 704, 3, 152, '#A34A4D') // woven pile (faint)

  // window light-wash parallelogram, painted just above the studs so it reads
  // as sun on the wall (kept out of the rect list because it's a polygon).
  const washPoly = '780,88 1392,88 1150,440 512,440'

  return (
    <svg
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      width={SCENE_W}
      height={SCENE_H}
      shapeRendering="crispEdges"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      aria-hidden
    >
      {/* wall base first so the wash can sit over it */}
      <rect x={0} y={WALL_TOP} width={SCENE_W} height={WAINSCOT_BOT - WALL_TOP} fill={WALL} />
      <polygon points={washPoly} fill={WASH} />
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.f} />
      ))}
    </svg>
  )
}
