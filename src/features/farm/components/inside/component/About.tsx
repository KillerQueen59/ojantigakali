import { cardBox, TITLE, MONO, type HitFn, type OpenWin } from './shared'

/** ABOUT · framed portrait. */
export default function About({ hit, openWin }: { hit: HitFn; openWin: OpenWin }) {
  return (
    <div {...hit('about', openWin('about'), { position: 'absolute', left: 150, top: 88, width: 206 })}>
      <div style={{ ...cardBox, padding: 11 }}>
        <div style={{ position: 'relative', height: 186, background: '#93CBEC', overflow: 'hidden', boxShadow: 'inset 0 0 0 3px #4A2F18' }}>
          <img
            src="/me-pixel-noframe.png"
            alt="Ojan"
            draggable={false}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 16%', imageRendering: 'pixelated' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '9px 2px 0' }}>
          <span style={{ fontFamily: TITLE, fontSize: 19, color: '#F6E7C5', whiteSpace: 'nowrap' }}>ABOUT ME</span>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: '#C9A97A' }}>01</span>
        </div>
      </div>
    </div>
  )
}
