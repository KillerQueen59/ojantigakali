'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Maximize2, Minimize2 } from 'lucide-react'

interface WindowModalProps {
  id: string
  title: string
  icon: ReactNode
  position: { x: number; y: number }
  zIndex: number
  children: ReactNode
  originRect?: { x: number; y: number; width: number; height: number }
  forceClose?: boolean
  forceCloseDelay?: number
  onClose: () => void
  onFocus: () => void
  onMove: (pos: { x: number; y: number }) => void
}

const WINDOW_W = 760
const WINDOW_H = 560
const DRAG_TRANSITION = 'width 0.25s ease, height 0.25s ease, border-radius 0.25s ease'
const FULL_TRANSITION  = 'left 0.25s ease, top 0.25s ease, width 0.25s ease, height 0.25s ease, border-radius 0.25s ease'

// ── Spark helpers ─────────────────────────────────────────────────────
type Spark = { tx: number; ty: number; color: string }
type BtnEffect = { id: number; x: number; y: number; sparks: Spark[]; label: string; labelColor: string; flashColor: string }

function makeSparks(colors: string[], count = 8): Spark[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i * (360 / count) + Math.random() * 22 - 11) * (Math.PI / 180)
    const dist  = 28 + Math.random() * 32
    return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, color: colors[i % colors.length] }
  })
}

export default function WindowModal({
  title, icon, position, zIndex, children, originRect, forceClose, forceCloseDelay = 0, onClose, onFocus, onMove,
}: WindowModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isClosing, setIsClosing]       = useState(false)
  const [closePressed, setClosePressed] = useState(false)
  const [fsPressed, setFsPressed]       = useState(false)
  const [btnEffects, setBtnEffects]     = useState<BtnEffect[]>([])
  const [mounted, setMounted]           = useState(false)

  const windowRef = useRef<HTMLDivElement>(null)
  const posRef    = useRef(position)
  const effectId  = useRef(0)
  posRef.current  = position

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!forceClose || isClosing) return
    const t = setTimeout(() => setIsClosing(true), forceCloseDelay)
    return () => clearTimeout(t)
  }, [forceClose])

  // Compute transform-origin pointing at the icon that was clicked
  const transformOrigin = (() => {
    if (!originRect) return 'center center'
    const iconCx = originRect.x + originRect.width  / 2
    const iconCy = originRect.y + originRect.height / 2
    return `${Math.round(iconCx - position.x)}px ${Math.round(iconCy - position.y)}px`
  })()

  // Set transition on mount; drag handlers will remove/restore it directly
  useEffect(() => {
    if (windowRef.current) windowRef.current.style.transition = FULL_TRANSITION
  }, [])

  // ── Drag — direct DOM, no React re-renders during move ───────────────
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return
    if (e.button !== 0) return
    e.preventDefault()
    onFocus()

    const el     = windowRef.current
    const startX = e.clientX - posRef.current.x
    const startY = e.clientY - posRef.current.y

    // Disable position transition while dragging
    if (el) el.style.transition = DRAG_TRANSITION

    const onMove_ = (ev: MouseEvent) => {
      const x = Math.max(0, ev.clientX - startX)
      const y = Math.max(0, ev.clientY - startY)
      posRef.current = { x, y }
      if (el) { el.style.left = `${x}px`; el.style.top = `${y}px` }
    }

    const onUp = () => {
      // Restore full transition, then sync final position to React state
      if (el) el.style.transition = FULL_TRANSITION
      onMove(posRef.current)
      document.removeEventListener('mousemove', onMove_)
      document.removeEventListener('mouseup', onUp)
      document.body.classList.remove('dragging')
    }

    document.body.classList.add('dragging')
    document.addEventListener('mousemove', onMove_)
    document.addEventListener('mouseup', onUp)
  }

  // ── Effect spawner ────────────────────────────────────────────────────
  function spawnEffect(e: React.MouseEvent, opts: Omit<BtnEffect, 'id' | 'x' | 'y'>) {
    const id = ++effectId.current
    setBtnEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY, ...opts }])
    setTimeout(() => setBtnEffects((prev) => prev.filter((ef) => ef.id !== id)), 750)
  }

  // ── Button handlers ───────────────────────────────────────────────────
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    spawnEffect(e, {
      sparks:     makeSparks(['#ff4444', '#ff8800', '#ffee00']),
      label:      'GAME OVER',
      labelColor: '#ff4444',
      flashColor: 'rgba(255,60,30,0.85)',
    })
    setIsClosing(true)
    setTimeout(onClose, 380)
  }

  const handleFullscreenToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const next = !isFullscreen
    spawnEffect(e, {
      sparks:     makeSparks(['#ffcc00', '#ff8800', '#00dfff']),
      label:      next ? 'MAX' : 'EXIT',
      labelColor: '#ffee00',
      flashColor: 'rgba(255,200,0,0.8)',
    })
    setIsFullscreen(next)
  }

  // ── Portal: viewport-level effects (no clipping) ─────────────────────
  const portalContent = (
    <>
      <style>{`
        @keyframes modalOpen {
          0%   { opacity: 0; transform: scale(0.04); }
          55%  { opacity: 1; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1);    }
        }
        @keyframes modalClose {
          0%   { opacity: 1; transform: scale(1);    }
          20%  { transform: scale(1.03); }
          100% { opacity: 0; transform: scale(0.04); }
        }
        @keyframes titleGlow {
          0%,100% { text-shadow: 0 0 4px rgba(0,220,255,0.7), 0 0 10px rgba(0,200,255,0.3); }
          50%     { text-shadow: 0 0 8px rgba(0,220,255,1),   0 0 20px rgba(0,200,255,0.6); }
        }
        @keyframes topLineShimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes btnSpark {
          0%   { opacity: 1; transform: translate(0,0) scale(1.3); }
          70%  { opacity: 0.6; }
          100% { opacity: 0; transform: translate(var(--tx),var(--ty)) scale(0); }
        }
        @keyframes btnLabel {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.6); }
          15%  { transform: translate(-50%,-80%) scale(1.15); }
          100% { opacity: 0; transform: translate(-50%,-200%) scale(0.9); }
        }
        @keyframes btnFlash {
          0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.2); }
          50%  { opacity: 0.7; }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1); }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99999 }}>
        {btnEffects.map((ef) => (
          <div key={ef.id} style={{ position: 'absolute', left: ef.x, top: ef.y }}>
            <div style={{
              position: 'absolute', width: 90, height: 90, borderRadius: '50%',
              background: `radial-gradient(circle, ${ef.flashColor} 0%, transparent 70%)`,
              mixBlendMode: 'screen',
              animation: 'btnFlash 0.4s ease-out forwards',
            }} />
            <div style={{
              position: 'absolute',
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 8, color: ef.labelColor, whiteSpace: 'nowrap',
              textShadow: `0 0 6px ${ef.labelColor}, 0 0 14px ${ef.labelColor}`,
              animation: 'btnLabel 0.75s ease-out forwards',
            }}>
              {ef.label}
            </div>
            {ef.sparks.map((s, i) => (
              <div key={i} style={{
                position: 'absolute', width: 5, height: 5, left: -2, top: -2,
                backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}`,
                animation: `btnSpark 0.55s ease-out ${i * 18}ms forwards`,
                '--tx': `${Math.round(s.tx)}px`,
                '--ty': `${Math.round(s.ty)}px`,
              } as React.CSSProperties} />
            ))}
          </div>
        ))}
      </div>
    </>
  )

  return (
    <>
      {mounted && createPortal(portalContent, document.body)}

      <div
        ref={windowRef}
        onMouseDown={onFocus}
        style={{
          position: 'fixed',
          left:   isFullscreen ? 0 : position.x,
          top:    isFullscreen ? 0 : position.y,
          width:  isFullscreen ? '100vw' : WINDOW_W,
          height: isFullscreen ? '100vh' : WINDOW_H,
          zIndex: isFullscreen ? 9999 : zIndex,
          borderRadius: isFullscreen ? 0 : 10,
          overflow: 'hidden',
          border: '1px solid rgba(0,210,255,0.2)',
          boxShadow: isFullscreen
            ? 'none'
            : '0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(0,210,255,0.07), 0 0 40px rgba(0,150,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--window-bg)',
          color: 'var(--window-text)',
          // Open/close animation (transform+opacity only — left/top handled by transition above)
          transformOrigin,
          animation: isClosing
            ? 'modalClose 0.35s ease-in forwards'
            : 'modalOpen 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}
      >
        {/* ── Arcade title bar ── */}
        <div
          onMouseDown={handleTitleBarMouseDown}
          style={{
            height: 48, minHeight: 48, position: 'relative',
            background: [
              'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 3px)',
              'linear-gradient(180deg, #1c1434 0%, #110a20 100%)',
            ].join(', '),
            borderBottom: '1px solid rgba(0,210,255,0.12)',
            display: 'flex', alignItems: 'center', padding: '0 12px', gap: 10,
            cursor: isFullscreen ? 'default' : 'grab',
            userSelect: 'none',
          }}
        >
          {/* Neon shimmer line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,220,255,0.9) 25%, rgba(200,80,255,0.9) 75%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'topLineShimmer 3s linear infinite',
            boxShadow: '0 0 8px rgba(0,220,255,0.5)',
          }} />

          {/* Corner brackets */}
          <div style={{ position:'absolute', top:6,    left:6,  width:8, height:8, borderTop:'1.5px solid rgba(0,220,255,0.45)',    borderLeft:'1.5px solid rgba(0,220,255,0.45)'  }} />
          <div style={{ position:'absolute', top:6,    right:6, width:8, height:8, borderTop:'1.5px solid rgba(0,220,255,0.45)',    borderRight:'1.5px solid rgba(0,220,255,0.45)' }} />
          <div style={{ position:'absolute', bottom:6, left:6,  width:8, height:8, borderBottom:'1.5px solid rgba(0,220,255,0.45)', borderLeft:'1.5px solid rgba(0,220,255,0.45)'  }} />
          <div style={{ position:'absolute', bottom:6, right:6, width:8, height:8, borderBottom:'1.5px solid rgba(0,220,255,0.45)', borderRight:'1.5px solid rgba(0,220,255,0.45)' }} />

          {/* Close — red arcade button */}
          <button
            onMouseDown={(e) => { e.stopPropagation(); setClosePressed(true) }}
            onMouseUp={() => setClosePressed(false)}
            onMouseLeave={() => setClosePressed(false)}
            onClick={handleClose}
            title="GAME OVER"
            style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              border: '2px solid rgba(255,50,50,0.45)',
              background: 'radial-gradient(circle at 36% 30%, #ff7070, #cc0022)',
              boxShadow: closePressed
                ? '0 1px 0 #660011, 0 0 14px rgba(255,20,50,1),   inset 0 2px 4px rgba(0,0,0,0.5)'
                : '0 4px 0 #660011, 0 0 8px  rgba(255,20,50,0.55), inset 0 1px 3px rgba(255,255,255,0.25)',
              transform: closePressed ? 'translateY(3px)' : 'translateY(0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.95)',
              transition: 'transform 0.07s, box-shadow 0.07s',
            }}
          >
            <X size={12} strokeWidth={3} />
          </button>

          {/* Icon + title */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', minWidth: 0 }}>
            <span style={{ opacity: 0.55, flexShrink: 0, display: 'flex', color: '#00dfff' }}>{icon}</span>
            <span style={{
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 9, color: '#b8e8ff', letterSpacing: '0.06em',
              animation: 'titleGlow 2.5s ease-in-out infinite',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {title.toUpperCase()}
            </span>
          </div>

          {/* Fullscreen — yellow arcade button */}
          <button
            onMouseDown={(e) => { e.stopPropagation(); setFsPressed(true) }}
            onMouseUp={() => setFsPressed(false)}
            onMouseLeave={() => setFsPressed(false)}
            onClick={handleFullscreenToggle}
            title={isFullscreen ? 'EXIT' : 'MAX'}
            style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
              border: '2px solid rgba(255,220,0,0.4)',
              background: 'radial-gradient(circle at 36% 30%, #ffe066, #bb7700)',
              boxShadow: fsPressed
                ? '0 1px 0 #553300, 0 0 14px rgba(255,200,0,1),   inset 0 2px 4px rgba(0,0,0,0.5)'
                : '0 4px 0 #553300, 0 0 8px  rgba(255,200,0,0.5),  inset 0 1px 3px rgba(255,255,255,0.25)',
              transform: fsPressed ? 'translateY(3px)' : 'translateY(0)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(60,30,0,0.9)',
              transition: 'transform 0.07s, box-shadow 0.07s',
            }}
          >
            {isFullscreen ? <Minimize2 size={12} strokeWidth={3} /> : <Maximize2 size={12} strokeWidth={3} />}
          </button>
        </div>

        {/* ── Content ── */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '28px 32px', color: 'var(--window-text)' }}>
          {children}
        </div>
      </div>
    </>
  )
}
