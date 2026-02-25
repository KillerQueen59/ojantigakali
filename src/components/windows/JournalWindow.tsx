'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2 } from 'lucide-react'

type Entry = {
  id: number
  title: string
  date: string
  tags: string[]
  body: string
  published: boolean
  created_at: string
}

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? ''

export default function JournalWindow() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [selected, setSelected] = useState<Entry | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/entries`)
      .then((res) => {
        if (!res.ok) throw new Error('failed')
        return res.json()
      })
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => setError('Could not load journal entries.'))
      .finally(() => setLoading(false))
  }, [])

  // ── Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200, gap: 10, color: 'var(--window-text-muted)', fontSize: 13 }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--icon-accent)' }} />
        Loading entries…
      </div>
    )
  }

  // ── Error ─────────────────────────────────────────────────────────────
  if (error) {
    return (
      <p style={{ textAlign: 'center', color: '#ff3b30', fontSize: 13, padding: '32px 0' }}>
        {error}
      </p>
    )
  }

  // ── Detail view ───────────────────────────────────────────────────────
  if (selected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeSlideIn 0.2s ease' }}>
        <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

        <button
          onClick={() => setSelected(null)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--icon-accent)', fontSize: 13, fontWeight: 600, padding: 0, alignSelf: 'flex-start' }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to Journal
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <p style={{ fontSize: 11, color: 'var(--window-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {selected.date}
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em', lineHeight: 1.3 }}>
            {selected.title}
          </h2>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 4 }}>
            {selected.tags.map((tag) => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, padding: '2px 9px', borderRadius: 999, background: 'var(--window-titlebar)', color: 'var(--icon-accent)', border: '1px solid var(--window-titlebar-border)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: 'var(--window-titlebar-border)' }} />

        {/* Render HTML from Tiptap, or fall back to plain-text paragraphs */}
        {selected.body.trimStart().startsWith('<') ? (
          <div
            className="journal-body"
            dangerouslySetInnerHTML={{ __html: selected.body }}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selected.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 14, color: 'var(--window-text-muted)', lineHeight: 1.8 }}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── List view ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ fontSize: 13, color: 'var(--window-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
        Things I&apos;ve been thinking about lately — tech, work, and whatever&apos;s been on my mind.
      </p>

      {entries.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--window-text-muted)', fontSize: 13, padding: '32px 0' }}>
          No entries yet.
        </p>
      )}

      {entries.map((entry, i) => (
        <button
          key={entry.id}
          onClick={() => setSelected(entry)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '14px 16px', borderRadius: 10, width: '100%', borderBottom: i < entries.length - 1 ? '1px solid var(--window-titlebar-border)' : 'none', transition: 'background 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--window-titlebar)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--window-text)', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                {entry.title}
              </p>
              <div style={{ display: 'flex', gap: 5, marginTop: 6, flexWrap: 'wrap' }}>
                {entry.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 999, background: 'var(--window-bg)', color: 'var(--icon-accent)', border: '1px solid var(--window-titlebar-border)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 11, color: 'var(--window-text-muted)', fontWeight: 500 }}>{entry.date}</span>
              <span style={{ fontSize: 11, color: 'var(--icon-accent)', fontWeight: 600 }}>READ →</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
