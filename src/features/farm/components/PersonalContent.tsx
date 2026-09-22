'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

const TITLE = 'var(--farm-font-title)'
const MONO = 'var(--farm-font-mono)'
const BODY = 'var(--farm-font-body)'

const INK = '#3B2A1A'
const INK_SOFT = '#6E4523'
const BRAND = '#8B5A2B'
const EDGE = '#D9C49A'
const TAN = '#EDD9AC'
const PARCH_EMPTY = '#E5D3A8'
const ORANGE = '#E06B2C' // Strava-ish accent
const BLUE = '#3E6FA8'

const STRAVA_URL = 'https://www.strava.com/athletes/ojan' // TODO: real athlete URL

type StravaStats = {
  connected: boolean
  weekSessions: number
  weekHours: number
  weekSports: number
  last: { name: string; sport: string; detail: string; when: string } | null
}

/** Sample shown until the /api/strava endpoint is live. Clearly labelled as demo. */
const SAMPLE: StravaStats = {
  connected: false,
  weekSessions: 5,
  weekHours: 6.5,
  weekSports: 3,
  last: { name: 'Evening padel', sport: 'PADEL', detail: '75 min', when: 'YESTERDAY' },
}

/** The sports I play, in rough order of how often. `main` gets the accent tile. */
const SPORTS: { icon: string; name: string; note: string; main?: boolean }[] = [
  { icon: '🏋️', name: 'GYM', note: 'strength & conditioning', main: true },
  { icon: '🎾', name: 'TENNIS', note: 'weekend rallies' },
  { icon: '🏓', name: 'PADEL', note: 'the new addiction' },
  { icon: '🏃', name: 'RUNNING', note: 'to clear the head' },
]

/** Fetches live Strava stats; falls back to the labelled sample if not wired yet. */
function useStrava(): { data: StravaStats; live: boolean } {
  const [data, setData] = useState<StravaStats>(SAMPLE)
  const [live, setLive] = useState(false)
  useEffect(() => {
    let alive = true
    fetch('/api/strava/stats')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('off'))))
      .then((d: StravaStats) => {
        if (alive) {
          setData({ ...d, connected: true })
          setLive(true)
        }
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])
  return { data, live }
}

function useCountUp(target: number, ms = 900) {
  const [val, setVal] = useState(0)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setVal(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target, ms])
  return val
}

function SectionLabel({ children, dot, mt = 20, right }: { children: ReactNode; dot: string; mt?: number; right?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: `${mt}px 0 10px` }}>
      <span style={{ width: 9, height: 9, background: dot }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: '.12em', color: INK_SOFT }}>{children}</span>
      <span style={{ flex: 1, height: 2, background: EDGE }} />
      {right}
    </div>
  )
}

function Chip({ children, tone = TAN, fg = INK_SOFT }: { children: ReactNode; tone?: string; fg?: string }) {
  return (
    <span
      className="farm-lift"
      style={{ fontFamily: MONO, fontWeight: 600, fontSize: 11, letterSpacing: '.04em', color: fg, background: tone, padding: '4px 8px', boxShadow: 'inset 0 0 0 1px rgba(74,47,24,.14)', whiteSpace: 'nowrap' }}
    >
      {children}
    </span>
  )
}

function TrainStat({ target, suffix, label, decimals = 0 }: { target: number; suffix: string; label: string; decimals?: number }) {
  const v = useCountUp(target)
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toString()
  return (
    <div style={{ flex: '1 1 96px', background: TAN, padding: '9px 11px', boxShadow: 'inset 0 0 0 2px ' + EDGE }}>
      <div style={{ fontFamily: TITLE, fontSize: 24, lineHeight: 1, color: INK }}>
        {shown}
        <span style={{ fontSize: 13, color: ORANGE }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 9, letterSpacing: '.07em', color: INK_SOFT, marginTop: 5 }}>{label}</div>
    </div>
  )
}

function SportTile({ icon, name, note, main }: { icon: string; name: string; note: string; main?: boolean }) {
  return (
    <div
      className="farm-lift"
      style={{ flex: '1 1 108px', background: main ? 'rgba(224,107,44,.12)' : TAN, padding: '9px 11px', boxShadow: 'inset 0 0 0 2px ' + EDGE }}
    >
      <div style={{ fontSize: 20, lineHeight: 1 }}>{icon}</div>
      <div style={{ fontFamily: TITLE, fontSize: 15, color: INK, marginTop: 5 }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: INK_SOFT, marginTop: 2, letterSpacing: '.04em' }}>{note}</div>
    </div>
  )
}

/** A pair of pixel sneakers + a stat row. */
function Shoe({ name, use, km, color, retired }: { name: string; use: string; km: string; color: string; retired?: boolean }) {
  return (
    <div
      className="farm-lift"
      style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', background: retired ? 'rgba(217,196,154,.2)' : TAN, boxShadow: 'inset 0 0 0 2px ' + EDGE, marginBottom: 6, opacity: retired ? 0.72 : 1 }}
    >
      <svg width="34" height="24" viewBox="0 0 17 12" shapeRendering="crispEdges" style={{ flexShrink: 0 }}>
        <rect x="1" y="7" width="15" height="3" fill="#4A2F18" />
        <rect x="2" y="3" width="8" height="5" fill={color} />
        <rect x="10" y="5" width="5" height="3" fill={color} />
        <rect x="3" y="4" width="6" height="1" fill="#FFFFFF" />
        <rect x="2" y="6" width="13" height="1" fill="#FFFFFF" />
        <rect x="1" y="10" width="15" height="1" fill="#2A1A0E" />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: INK, lineHeight: 1.1 }}>
          {name} {retired && <span style={{ fontFamily: MONO, fontSize: 9, color: BRAND }}>· RETIRED</span>}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '.05em', color: INK_SOFT, marginTop: 2 }}>{use}</div>
      </div>
      <div style={{ fontFamily: TITLE, fontSize: 15, color: BRAND, whiteSpace: 'nowrap' }}>{km}</div>
    </div>
  )
}

export default function PersonalContent() {
  const { data, live } = useStrava()
  return (
    <div>
      {/* ── Intro ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <img
          src="/me-pixel.png"
          alt="Pixel portrait of Ojan"
          draggable={false}
          style={{ width: 92, height: 'auto', imageRendering: 'pixelated', flexShrink: 0, boxShadow: '4px 4px 0 rgba(0,0,0,.28)' }}
        />
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ fontFamily: TITLE, fontSize: 23, lineHeight: 1.1, color: INK }}>Off the clock</div>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.55, margin: '8px 0 10px', color: INK }}>
            When I&rsquo;m not shipping code I&rsquo;m usually <strong>moving</strong> &mdash; gym, tennis, padel, a run to clear the
            head. Sport is how I reset, chase a number, and stay a little competitive off the keyboard.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Chip>🏋️ GYM RAT</Chip>
            <Chip>🎾 RACQUET SPORTS</Chip>
            <Chip>⚽ TOTTENHAM</Chip>
            <Chip>👟 SNEAKERHEAD</Chip>
          </div>
        </div>
      </div>

      {/* ── Sports I play ────────────────────────────────────────────── */}
      <SectionLabel dot={BLUE}>SPORTS I PLAY</SectionLabel>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {SPORTS.map((s) => (
          <SportTile key={s.name} {...s} />
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: BRAND, letterSpacing: '.05em', marginTop: 6 }}>
        ▸ &hellip; and whatever else gets me off the couch
      </div>

      {/* ── Strava training log (all sports) ─────────────────────────── */}
      <SectionLabel
        dot={ORANGE}
        right={
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, letterSpacing: '.08em', color: live ? ORANGE : BRAND, background: live ? 'rgba(224,107,44,.14)' : PARCH_EMPTY, padding: '3px 7px' }}>
            {live ? '● STRAVA LIVE' : 'SAMPLE · NOT CONNECTED'}
          </span>
        }
      >
        TRAINING · THIS WEEK
      </SectionLabel>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <TrainStat target={data.weekSessions} suffix="" label="SESSIONS" />
        <TrainStat target={data.weekHours} suffix=" h" label="HOURS MOVED" decimals={1} />
        <TrainStat target={data.weekSports} suffix="" label="SPORTS" />
      </div>
      {data.last && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, padding: '9px 12px', background: 'rgba(224,107,44,.1)', boxShadow: 'inset 0 0 0 2px ' + EDGE }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, color: ORANGE, letterSpacing: '.08em' }}>LAST</span>
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, color: INK, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.last.name}</span>
          <span style={{ fontFamily: MONO, fontSize: 9, color: BRAND, letterSpacing: '.06em' }}>{data.last.sport}</span>
          <span style={{ fontFamily: TITLE, fontSize: 14, color: INK_SOFT }}>{data.last.detail}</span>
        </div>
      )}
      <a
        href={STRAVA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="farm-lift"
        style={{ display: 'inline-block', marginTop: 10, fontFamily: TITLE, fontSize: 14, color: '#F6E7C5', background: ORANGE, padding: '8px 13px', textDecoration: 'none', boxShadow: '3px 3px 0 rgba(0,0,0,.3)' }}
      >
        FOLLOW ON STRAVA →
      </a>

      {/* ── Shoe rack ────────────────────────────────────────────────── */}
      <SectionLabel dot={BRAND}>THE SHOE RACK</SectionLabel>
      <Shoe name="Nike Pegasus 41" use="DAILY TRAINER · GYM & RUNS" km="620 km" color="#3E6FA8" />
      <Shoe name="Nike Vaporfly 3" use="RACE DAY · SAVED FOR PBs" km="98 km" color="#E06B2C" />
      <Shoe name="Asics Gel-Resolution" use="TENNIS / PADEL COURT" km="150 hrs" color="#4E9A3E" />
      <Shoe name="Nike Metcon 9" use="LIFTING · RETIRED" km="—" color="#8B5A2B" retired />
      <div style={{ fontFamily: MONO, fontSize: 9, color: BRAND, letterSpacing: '.05em', marginTop: 4 }}>
        ▸ SAMPLE RACK &mdash; send me your real list to swap in
      </div>
    </div>
  )
}
