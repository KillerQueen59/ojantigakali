import { cardBox, TITLE, MONO, type HitFn, type OpenWin } from './shared'

/** PROJECTS · notice board. */
export default function Projects({ hit, openWin }: { hit: HitFn; openWin: OpenWin }) {
  return (
    <div {...hit('projects', openWin('projects'), { position: 'absolute', left: 420, top: 66, width: 368 })}>
      <div style={{ ...cardBox, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingBottom: 11 }}>
          <span style={{ fontFamily: TITLE, fontSize: 18, color: '#F2C14E', letterSpacing: '.03em', whiteSpace: 'nowrap' }}>NOTICE BOARD · PROJECTS</span>
          <span style={{ fontFamily: MONO, fontWeight: 500, fontSize: 10, color: '#C9A97A' }}>03</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          <Slip name="SERAT KALAM" tags="GO · SVELTEKIT · POSTGRES · VPS" rot={-0.6} />
          <Slip name="GRIND" tags="NEXT.JS · SUPABASE · PWA" rot={0.5} />
          <Slip name="SPURS ANALYTICS" tags="GO · NEXT.JS · DATA PIPELINE" rot={-0.3} />
          <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 11, letterSpacing: '.08em', color: '#E5D3A8', textAlign: 'right', paddingTop: 2 }}>OPEN THE BOARD →</div>
        </div>
      </div>
    </div>
  )
}

function Slip({ name, tags, rot }: { name: string; tags: string; rot: number }) {
  return (
    <div style={{ background: '#F6E7C5', padding: '10px 12px', boxShadow: '3px 3px 0 rgba(0,0,0,.28)', transform: `rotate(${rot}deg)` }}>
      <div style={{ fontFamily: TITLE, fontSize: 18, color: '#3B2A1A' }}>{name}</div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, letterSpacing: '.06em', color: '#8B5A2B' }}>{tags}</div>
    </div>
  )
}
