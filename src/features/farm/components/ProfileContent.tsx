'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { farmActions } from '../state/farmStore'

const TITLE = 'var(--farm-font-title)'
const MONO = 'var(--farm-font-mono)'
const BODY = 'var(--farm-font-body)'

const INK = '#3B2A1A'
const INK_SOFT = '#6E4523'
const BRAND = '#8B5A2B'
const EDGE = '#D9C49A'
const TAN = '#EDD9AC'
const PARCH_EMPTY = '#E5D3A8'
const GREEN = '#4E9A3E'
const GOLD = '#B8802F'
const BLUE = '#3E6FA8'
const RED = '#C8483A'

const EMAIL = 'hello@ojantigakali.com'

/** Ease-out count-up that runs once on mount. */
function useCountUp(target: number, ms = 950) {
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

/** Small pixel section header so each audience finds their part instantly. */
function SectionLabel({ children, dot, mt = 20 }: { children: ReactNode; dot: string; mt?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: `${mt}px 0 10px` }}>
      <span style={{ width: 9, height: 9, background: dot }} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: '.12em', color: INK_SOFT }}>{children}</span>
      <span style={{ flex: 1, height: 2, background: EDGE }} />
    </div>
  )
}

function Chip({ children, tone = TAN, fg = INK_SOFT }: { children: ReactNode; tone?: string; fg?: string }) {
  return (
    <span
      className="farm-lift"
      style={{
        fontFamily: MONO,
        fontWeight: 600,
        fontSize: 11,
        letterSpacing: '.04em',
        color: fg,
        background: tone,
        padding: '4px 8px',
        boxShadow: 'inset 0 0 0 1px rgba(74,47,24,.14)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

function Stat({ target, suffix, label, decimals = 0 }: { target: number; suffix: string; label: string; decimals?: number }) {
  const v = useCountUp(target)
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toString()
  return (
    <div style={{ flex: '1 1 128px', background: TAN, padding: '10px 12px', boxShadow: 'inset 0 0 0 2px ' + EDGE }}>
      <div style={{ fontFamily: TITLE, fontSize: 26, lineHeight: 1, color: INK }}>
        {shown}
        <span style={{ fontSize: 15, color: GOLD }}>{suffix}</span>
      </div>
      <div style={{ fontFamily: MONO, fontWeight: 600, fontSize: 9, letterSpacing: '.07em', color: INK_SOFT, marginTop: 6 }}>{label}</div>
    </div>
  )
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  const total = 14
  const v = useCountUp(value, 850)
  const filled = Math.round((v / 50) * total)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
      <span style={{ width: 104, flexShrink: 0, fontFamily: MONO, fontWeight: 600, fontSize: 10, color: INK_SOFT, letterSpacing: '.02em' }}>{label}</span>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} style={{ width: 9, height: 13, background: i < filled ? color : PARCH_EMPTY, boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.15)' }} />
        ))}
      </div>
    </div>
  )
}

function Fact({ k, v, accent }: { k: string; v: ReactNode; accent?: string }) {
  return (
    <div style={{ padding: '7px 0', borderBottom: '2px dashed ' + EDGE }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, letterSpacing: '.09em', color: BRAND, marginBottom: 3 }}>{k}</div>
      <div style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.35, color: accent ?? INK, fontWeight: accent ? 700 : 400 }}>{v}</div>
    </div>
  )
}

function Btn({ children, onClick, bg = INK_SOFT, fg = '#F6E7C5' }: { children: ReactNode; onClick: () => void; bg?: string; fg?: string }) {
  const [down, setDown] = useState(false)
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
      className="farm-lift"
      style={{
        border: 0,
        cursor: 'pointer',
        fontFamily: TITLE,
        fontSize: 15,
        color: fg,
        background: bg,
        padding: '9px 13px',
        boxShadow: down ? '1px 1px 0 rgba(0,0,0,.3)' : '3px 3px 0 rgba(0,0,0,.3)',
        transform: down ? 'translate(2px,2px)' : undefined,
      }}
    >
      {children}
    </button>
  )
}

export default function ProfileContent() {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL).catch(() => {})
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div>
      {/* ── Header: framed portrait + identity ───────────────────────── */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <img
          src="/me-pixel.png"
          alt="Pixel portrait of Ojan"
          draggable={false}
          style={{ width: 96, height: 'auto', imageRendering: 'pixelated', flexShrink: 0, boxShadow: '4px 4px 0 rgba(0,0,0,.28)' }}
        />
        <div style={{ flex: '1 1 240px', minWidth: 0 }}>
          <div style={{ fontFamily: TITLE, fontSize: 24, lineHeight: 1.05, color: INK }}>Muhammad Fauzan Ramadhan</div>
          <div style={{ fontFamily: MONO, fontSize: 12, color: BRAND, margin: '6px 0 10px', letterSpacing: '.04em' }}>
            BACKEND ENGINEER · PAYMENTS · &ldquo;OJAN&rdquo;
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(78,154,62,.14)', padding: '4px 9px', marginBottom: 10 }}>
            <span style={{ position: 'relative', width: 9, height: 9 }}>
              <span style={{ position: 'absolute', inset: 0, background: GREEN, animation: 'farm-ping 1.4s ease-out infinite' }} />
              <span style={{ position: 'absolute', inset: 2, background: GREEN }} />
            </span>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: '.09em', color: GREEN }}>OPEN TO WORK</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <Chip>BOGOR, ID</Chip>
            <Chip>REMOTE-FRIENDLY</Chip>
            <Chip>ID · EN</Chip>
            <Chip>4 YEARS</Chip>
          </div>
        </div>
      </div>

      {/* ── Two-column dashboard: all three readers, no scrolling hunt ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(258px, 1fr))', gap: '4px 26px' }}>
        {/* LEFT — the human read + the scale */}
        <div>
          <SectionLabel dot={GREEN} mt={18}>THE SHORT VERSION</SectionLabel>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.55, margin: '0 0 9px', color: INK }}>
            I go by Ojan. For four years I&rsquo;ve built backend systems that <strong>move money</strong> &mdash; today on the
            Disbursement Team at OY! Indonesia, pushing high-volume transfers across many payment providers without losing a rupiah.
          </p>
          <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.55, margin: '0 0 4px', color: INK }}>
            Off the clock I freelance as <strong>Mamen Studio</strong> &mdash; sites, dashboards, and integrations for small teams
            who need something that just works.
          </p>

          <SectionLabel dot={GOLD}>BY THE NUMBERS</SectionLabel>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <Stat target={4} suffix=" yrs" label="IN PRODUCTION" />
            <Stat target={99.9} suffix="%" label="SERVICE UPTIME" decimals={1} />
            <Stat target={10} suffix="+" label="PROVIDERS" />
            <Stat target={6} suffix="" label="SERVICES OWNED" />
          </div>
        </div>

        {/* RIGHT — the technical read + the hiring facts */}
        <div>
          <SectionLabel dot={BLUE} mt={18}>WHAT I&rsquo;M GOOD AT</SectionLabel>
          <SkillBar label="BACKEND / JVM" value={47} color={GREEN} />
          <SkillBar label="PAYMENTS / FINTECH" value={45} color={GOLD} />
          <SkillBar label="DISTRIBUTED SYS" value={40} color={BLUE} />
          <SkillBar label="DEVOPS / INFRA" value={34} color={INK_SOFT} />
          <SkillBar label="FRONTEND" value={33} color={RED} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
            {['JAVA', 'SPRING', 'GO', 'POSTGRES', 'REDIS', 'RABBITMQ', 'ELASTIC', 'DOCKER'].map((s) => (
              <Chip key={s} tone={PARCH_EMPTY}>{s}</Chip>
            ))}
          </div>

          <SectionLabel dot={RED}>FOR RECRUITERS</SectionLabel>
          <div style={{ background: 'rgba(217,196,154,.28)', padding: '2px 12px 8px', boxShadow: 'inset 0 0 0 2px ' + EDGE }}>
            <Fact k="STATUS" v="Open — full-time or freelance" accent={GREEN} />
            <Fact k="EXPERIENCE" v="4 yrs · backend / payments" />
            <Fact k="CURRENT" v="SWE, OY! Indonesia (2022–now)" />
            <Fact k="LOCATION" v="Bogor, ID · remote-friendly" />
            <Fact k="LANGUAGES" v="Bahasa (native) · English (pro)" />
            <Fact k="EDUCATION" v="— send details to fill in —" />
          </div>
        </div>
      </div>

      {/* ── One clear call to action for all three ───────────────────── */}
      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginTop: 18 }}>
        <Btn bg={GOLD} fg={INK} onClick={copy}>{copied ? 'COPIED! ✓' : 'COPY EMAIL'}</Btn>
        <Btn onClick={() => farmActions.toggleWin('resume')}>RESUME ↓</Btn>
        <Btn onClick={() => farmActions.toggleWin('projects')}>PROJECTS →</Btn>
        <Btn onClick={() => farmActions.toggleWin('contact')}>CONTACT</Btn>
      </div>
    </div>
  )
}
