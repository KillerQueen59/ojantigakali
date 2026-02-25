'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface MobileSheetProps {
  title: string
  icon: ReactNode
  onClose: () => void
  children: ReactNode
}

export default function MobileSheet({ title, icon, onClose, children }: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll while sheet is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  return (
    <>
      <style>{`
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); opacity: 0.6; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Sheet panel */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: '6%',
          zIndex: 201,
          background: 'var(--window-bg)',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sheetSlideUp 0.3s cubic-bezier(0.34,1.3,0.64,1)',
          overflow: 'hidden',
        }}
      >
        {/* Handle bar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            background: 'var(--scrollbar-thumb)',
          }} />
        </div>

        {/* Title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 20px 14px',
          gap: 10,
          borderBottom: '1px solid var(--window-titlebar-border)',
        }}>
          <span style={{ opacity: 0.7, display: 'flex', color: 'var(--window-text)' }}>{icon}</span>
          <span style={{
            flex: 1,
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--window-text)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: 'rgba(255,59,48,0.12)',
              border: '1px solid rgba(255,59,48,0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff3b30',
              flexShrink: 0,
            }}
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '24px 20px',
          color: 'var(--window-text)',
        }}>
          {children}
        </div>
      </div>
    </>
  )
}
