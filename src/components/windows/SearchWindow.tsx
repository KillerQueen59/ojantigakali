'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Icon } from '@/utils/iconMap'
import type { PortfolioData } from '@/types/portfolio'

type SearchResult = {
  windowId: string
  category: string
  title: string
  subtitle: string
  icon: string
  searchText: string
}

const CATEGORIES = ['All', 'Projects', 'Experience', 'Education', 'About', 'Contact', 'GitHub', 'Resume', 'Journal']

const QUICK_JUMPS = [
  { label: 'About Me',   id: 'about',      icon: 'User'          },
  { label: 'Projects',   id: 'projects',   icon: 'Briefcase'     },
  { label: 'Experience', id: 'experience', icon: 'Building2'     },
  { label: 'Education',  id: 'education',  icon: 'GraduationCap' },
  { label: 'Contact',    id: 'contact',    icon: 'Mail'          },
  { label: 'GitHub',     id: 'github',     icon: 'Github'        },
  { label: 'Resume',     id: 'resume',     icon: 'FileText'      },
  { label: 'Journal',    id: 'journal',    icon: 'Feather'       },
]

function getSnippet(text: string, query: string): string | null {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return null
  const start = Math.max(0, idx - 28)
  const end   = Math.min(text.length, idx + query.length + 60)
  let snippet = text.slice(start, end).replace(/\n/g, ' ')
  if (start > 0) snippet = '…' + snippet
  if (end < text.length) snippet += '…'
  return snippet
}

export default function SearchWindow({
  data,
  onOpen,
}: {
  data: PortfolioData | null
  onOpen: (id: string) => void
}) {
  const [query, setQuery]                   = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [highlighted, setHighlighted]       = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // ── Full-text index ────────────────────────────────────────────────────
  const allResults = useMemo((): SearchResult[] => {
    const items: SearchResult[] = []

    if (data?.about) {
      items.push({
        windowId: 'about', category: 'About', icon: 'User',
        title: data.about.name, subtitle: data.about.title,
        searchText: [
          data.about.name, data.about.title, data.about.bio,
          ...data.about.facts.map((f) => `${f.key} ${f.value}`),
        ].join(' '),
      })
    }

    data?.projects?.forEach((p) =>
      items.push({
        windowId: 'projects', category: 'Projects', icon: p.icon,
        title: p.name, subtitle: p.desc,
        searchText: [p.name, p.type, p.desc, ...p.stack, ...p.highlights].join(' '),
      })
    )

    data?.experiences?.forEach((e) =>
      items.push({
        windowId: 'experience', category: 'Experience', icon: 'Building2',
        title: e.role, subtitle: e.company,
        searchText: [e.role, e.company, e.period, e.location, ...e.points].join(' '),
      })
    )

    data?.education?.education?.forEach((e) =>
      items.push({
        windowId: 'education', category: 'Education', icon: 'GraduationCap',
        title: e.degree, subtitle: e.school,
        searchText: [e.degree, e.school, e.period, e.location, e.gpa ?? '', ...e.highlights].join(' '),
      })
    )

    data?.education?.achievements?.forEach((a) =>
      items.push({
        windowId: 'education', category: 'Education', icon: 'Trophy',
        title: a.name, subtitle: a.org,
        searchText: [a.name, a.org, a.year].join(' '),
      })
    )

    items.push({
      windowId: 'contact', category: 'Contact', icon: 'Mail',
      title: 'Contact Me', subtitle: data?.contact?.email ?? 'Get in touch',
      searchText: [data?.contact?.email, data?.contact?.location, data?.contact?.linkedin].filter(Boolean).join(' '),
    })

    items.push({
      windowId: 'github', category: 'GitHub', icon: 'Github',
      title: 'GitHub Profile', subtitle: data?.github?.username ?? '',
      searchText: [
        data?.github?.username, data?.github?.url,
        ...(data?.github?.pinned?.map((r) => `${r.name} ${r.desc} ${r.lang}`) ?? []),
      ].filter(Boolean).join(' '),
    })

    items.push({
      windowId: 'resume', category: 'Resume', icon: 'FileText',
      title: 'Resume / CV', subtitle: 'Download or view my latest resume',
      searchText: [
        data?.resume?.summary, data?.resume?.skills,
        ...(data?.resume?.experiences?.map((e) => `${e.role} ${e.company}`) ?? []),
      ].filter(Boolean).join(' '),
    })

    items.push({
      windowId: 'journal', category: 'Journal', icon: 'Feather',
      title: 'Journal', subtitle: 'Personal writings & thoughts',
      searchText: 'journal writing thoughts blog',
    })

    return items
  }, [data])

  // ── Filter logic ───────────────────────────────────────────────────────
  // When a query is typed → search ALL content regardless of chip.
  // When no query → chips act as a section browser.
  const results = useMemo(() => {
    const hasQuery = query.trim().length > 0

    let filtered = allResults

    if (!hasQuery && activeCategory !== 'All') {
      filtered = filtered.filter((r) => r.category === activeCategory)
    }

    if (hasQuery) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.searchText.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [allResults, query, activeCategory])

  // ── Group results by category ──────────────────────────────────────────
  const grouped = useMemo(() => {
    const map = new Map<string, SearchResult[]>()
    for (const r of results) {
      const list = map.get(r.category) ?? []
      list.push(r)
      map.set(r.category, list)
    }
    return Array.from(map.entries())
  }, [results])

  // Flat list for keyboard navigation
  const flat = useMemo(() => results, [results])

  useEffect(() => { setHighlighted(0) }, [flat.length, query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, flat.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter' && flat[highlighted]) {
      onOpen(flat[highlighted].windowId)
    }
  }

  const showResults = query.trim().length > 0 || activeCategory !== 'All'

  // Running index across all groups for keyboard highlight
  let flatIndex = 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onKeyDown={handleKeyDown}>

      {/* Search input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--window-titlebar)', borderRadius: 10, border: '1px solid var(--window-titlebar-border)' }}>
        <Search size={15} style={{ color: 'var(--window-text-muted)', flexShrink: 0 }} />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything — projects, skills, companies…"
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 14, color: 'var(--window-text)', fontFamily: 'inherit', caretColor: 'var(--icon-accent)' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--window-text-muted)', padding: 0, display: 'flex' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category chips — browse when idle, indicate active filter when no query */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat
          // Dim chips when a query is typed (they're inactive during search)
          const dimmed = query.trim().length > 0 && cat !== 'All'
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setQuery('') }}
              style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${isActive && !dimmed ? 'var(--icon-accent)' : 'var(--window-titlebar-border)'}`, background: isActive && !dimmed ? 'var(--icon-accent)' : 'var(--window-titlebar)', color: isActive && !dimmed ? '#fff' : dimmed ? 'var(--window-titlebar-border)' : 'var(--window-text-muted)', transition: 'all 0.15s', lineHeight: 1.6 }}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Results */}
      {showResults ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {grouped.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--window-text-muted)', fontSize: 13, padding: '28px 0' }}>
              No results found.
            </p>
          ) : (
            grouped.map(([category, items]) => {
              const groupStart = flatIndex
              flatIndex += items.length

              return (
                <div key={category}>
                  {/* Section header */}
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--icon-accent)', marginBottom: 6, paddingLeft: 4 }}>
                    {category}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {items.map((result, localIdx) => {
                      const globalIdx = groupStart + localIdx
                      const isHighlighted = globalIdx === highlighted
                      const q = query.trim()
                      const inTitle    = q && result.title.toLowerCase().includes(q.toLowerCase())
                      const inSubtitle = q && result.subtitle.toLowerCase().includes(q.toLowerCase())
                      const snippet    = q && !inTitle && !inSubtitle
                        ? getSnippet(result.searchText, q)
                        : null

                      return (
                        <button
                          key={`${result.windowId}-${result.title}-${globalIdx}`}
                          onClick={() => onOpen(result.windowId)}
                          onMouseEnter={() => setHighlighted(globalIdx)}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 11px', borderRadius: 8, cursor: 'pointer', background: isHighlighted ? 'var(--icon-accent)' : 'transparent', border: `1px solid ${isHighlighted ? 'var(--icon-accent)' : 'transparent'}`, textAlign: 'left', width: '100%', transition: 'background 0.1s' }}
                        >
                          <span style={{ flexShrink: 0, marginTop: 2, color: isHighlighted ? '#fff' : 'var(--icon-accent)' }}><Icon name={result.icon} size={16} /></span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: isHighlighted ? '#fff' : 'var(--window-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {result.title}
                            </p>
                            <p style={{ fontSize: 11, color: isHighlighted ? 'rgba(255,255,255,0.7)' : 'var(--window-text-muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {result.subtitle}
                            </p>
                            {snippet && (
                              <p style={{ fontSize: 11, color: isHighlighted ? 'rgba(255,255,255,0.55)' : 'var(--window-text-muted)', marginTop: 3, lineHeight: 1.5, fontStyle: 'italic', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {snippet}
                              </p>
                            )}
                          </div>
                          <span style={{ fontSize: 11, color: isHighlighted ? 'rgba(255,255,255,0.55)' : 'var(--window-text-muted)', flexShrink: 0, marginTop: 2 }}>→</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      ) : (
        /* Quick jump shortcuts when idle */
        <div>
          <p style={{ fontSize: 11, color: 'var(--window-text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
            Quick Jump
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUICK_JUMPS.map((item) => (
              <button
                key={item.id}
                onClick={() => onOpen(item.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: 'var(--window-titlebar)', border: '1px solid var(--window-titlebar-border)', color: 'var(--window-text-muted)', cursor: 'pointer', transition: 'border-color 0.15s, color 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--icon-accent)'; e.currentTarget.style.color = 'var(--icon-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--window-titlebar-border)'; e.currentTarget.style.color = 'var(--window-text-muted)' }}
              >
                <Icon name={item.icon} size={13} /> {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      {showResults && flat.length > 0 && (
        <div style={{ display: 'flex', gap: 14, paddingTop: 6, borderTop: '1px solid var(--window-titlebar-border)', color: 'var(--window-text-muted)', fontSize: 11 }}>
          {[['↑↓', 'navigate'], ['↵', 'open']].map(([key, label]) => (
            <span key={key}>
              <kbd style={{ background: 'var(--window-titlebar)', border: '1px solid var(--window-titlebar-border)', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'inherit' }}>{key}</kbd>
              {' '}{label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
