'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2, FileText, Circle } from 'lucide-react'

type Entry = {
  id: number
  title: string
  date: string
  tags: string[]
  published: boolean
  created_at: string
}

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? ''

export default function CmsJournalsPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!API_URL) { setLoading(false); return }
    fetch(`${API_URL}/entries`)
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setEntries(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em' }}>
            Journals
          </h1>
          <p style={{ fontSize: 13, color: 'var(--window-text-muted)', marginTop: 4 }}>
            Write and manage your journal entries. Tiptap-powered rich text editor.
          </p>
        </div>
        <button
          onClick={() => router.push('/cms/journals/new')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 9,
            background: 'var(--icon-accent)', color: '#fff',
            border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={14} /> New entry
        </button>
      </div>

      {/* Table */}
      <div style={{
        borderRadius: 12, border: '1px solid var(--window-titlebar-border)',
        background: 'var(--window-bg)', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px',
          padding: '10px 16px',
          background: 'var(--window-titlebar)',
          borderBottom: '1px solid var(--window-titlebar-border)',
        }}>
          {['Title', 'Date', 'Tags', 'Status'].map((h) => (
            <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--window-text-muted)' }}>{h}</span>
          ))}
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40, color: 'var(--window-text-muted)', fontSize: 13 }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
            Loading entries…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '48px 24px', color: 'var(--window-text-muted)' }}>
            <FileText size={32} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: 13, fontWeight: 600 }}>No entries yet.</p>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              {!API_URL ? 'Backend not connected — entries will appear here once the API is set up.' : 'Click "New entry" to write your first post.'}
            </p>
          </div>
        )}

        {entries.map((e, i) => (
          <button
            key={e.id}
            onClick={() => router.push(`/cms/journals/${e.id}`)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 120px 100px 80px',
              padding: '12px 16px', width: '100%',
              background: 'none', border: 'none', cursor: 'pointer',
              borderTop: i > 0 ? '1px solid var(--window-titlebar-border)' : 'none',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--window-titlebar)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none' }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--window-text)' }}>{e.title}</span>
            <span style={{ fontSize: 12, color: 'var(--window-text-muted)' }}>{e.date}</span>
            <span style={{ fontSize: 11, color: 'var(--window-text-muted)' }}>{e.tags.slice(0, 2).join(', ')}</span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontWeight: 600,
              color: e.published ? '#30d158' : 'var(--window-text-muted)',
            }}>
              <Circle size={6} fill={e.published ? '#30d158' : 'currentColor'} />
              {e.published ? 'Live' : 'Draft'}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
