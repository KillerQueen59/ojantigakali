// Farm scene background (sky/sun/clouds/hills/grass), drawn IN-FRAME only (0..1440).
// The full-viewport letterbox is filled by <FillBackdrop> behind this layer, whose
// sky/grass split is computed from the same camera transform — so there's never an
// edge gap or seam at any window size. overflow:visible only lets clouds drift out.
import type { CSSProperties } from 'react'

const INNER = `<rect x="0" y="0" width="1440" height="340" fill="#7FBFE6"></rect><rect x="0" y="230" width="1440" height="60" fill="#93CBEC"></rect><rect x="0" y="290" width="1440" height="50" fill="#AFDBF3"></rect><g><rect x="428" y="80" width="12" height="12" fill="#F2C14E"></rect><rect x="532" y="80" width="12" height="12" fill="#F2C14E"></rect><rect x="480" y="28" width="12" height="12" fill="#F2C14E"></rect><rect x="480" y="132" width="12" height="12" fill="#F2C14E"></rect><rect x="448" y="48" width="76" height="76" fill="#F8D77E"></rect><rect x="458" y="58" width="56" height="56" fill="#FFE9A8"></rect></g><g style="animation:farm-cloudDrift 90s linear infinite"><rect x="0" y="64" width="130" height="26" fill="#FFF"></rect><rect x="22" y="46" width="72" height="20" fill="#FFF"></rect><rect x="10" y="86" width="100" height="10" fill="#E9F5FC"></rect></g><g style="animation:farm-cloudDrift 130s linear infinite;animation-delay:-60s"><rect x="0" y="140" width="96" height="20" fill="#FFFFFFEE"></rect><rect x="18" y="126" width="52" height="16" fill="#FFFFFFEE"></rect><rect x="8" y="156" width="76" height="8" fill="#E9F5FCDD"></rect></g><g style="animation:farm-cloudDrift 112s linear infinite;animation-delay:-30s"><rect x="0" y="196" width="80" height="16" fill="#FFFFFFCC"></rect><rect x="14" y="186" width="44" height="12" fill="#FFFFFFCC"></rect></g><polygon points="0,340 0,236 240,196 520,252 760,204 1040,268 1260,224 1440,272 1440,340" fill="#88BC72"></polygon><polygon points="0,340 0,250 180,190 400,260 620,210 900,290 1140,230 1440,300 1440,340" fill="#6FAE4E"></polygon><rect x="0" y="330" width="1440" height="570" fill="#5A9E3D"></rect><rect x="0" y="330" width="1440" height="14" fill="#63AC45"></rect>`

export default function SceneBackground({ style }: { style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 1440 900"
      width={1440}
      height={900}
      shapeRendering="crispEdges"
      style={{ position: 'absolute', inset: 0, overflow: 'visible', ...style }}
      dangerouslySetInnerHTML={{ __html: INNER }}
    />
  )
}
