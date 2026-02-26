'use client'

import { useState, useMemo, useEffect } from 'react'
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import ReactCountryFlag from 'react-country-flag'
import NextImage from 'next/image'
import { Icon } from '@/utils/iconMap'
import ImagePreview from '@/components/ui/ImagePreview'
import type { Project } from '@/types/portfolio'

// Techs that get collapsed into a group chip in the filter bar only
const FILTER_GROUPS: { label: string; techs: string[] }[] = [
  { label: 'Payment Integration', techs: ['Doku', 'Razorpay', 'Stripe', 'Biteship'] },
  { label: 'Map Integration',     techs: ['Map GIS Integration', 'Leaflet', 'Google Maps API'] },
]

function resolveGroup(tech: string) {
  return FILTER_GROUPS.find((g) => g.techs.includes(tech))
}

export default function ProjectsWindow({ data }: { data: Project[] | null | undefined }) {
  const projects     = data ?? []
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [selected, setSelected]         = useState<Project | null>(null)
  const [imgIndex, setImgIndex]         = useState(0)
  const [previewOpen, setPreviewOpen]   = useState(false)
  const [imgLoaded, setImgLoaded]       = useState(false)

  useEffect(() => { setImgLoaded(false) }, [selected, imgIndex])

  const allSkills = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.stack))),
    [projects]
  )

  // Build deduplicated filter chips: grouped or individual
  const filterChips = useMemo(() => {
    const chips: { label: string; techs: string[] }[] = []
    const seenGroups = new Set<string>()
    for (const tech of allSkills) {
      const group = resolveGroup(tech)
      if (group) {
        if (!seenGroups.has(group.label)) {
          seenGroups.add(group.label)
          chips.push(group)
        }
      } else {
        chips.push({ label: tech, techs: [tech] })
      }
    }
    return chips
  }, [allSkills])

  const activeChip  = filterChips.find((c) => c.label === activeFilter)
  const activeTechs = activeChip?.techs ?? []

  const filtered = activeFilter
    ? projects.filter((p) => p.stack.some((t) => activeTechs.includes(t)))
    : projects

  const toggle = (label: string) =>
    setActiveFilter((prev) => (prev === label ? null : label))

  // ── Detail view ──────────────────────────────────────────────────────
  if (selected) {
    const images = selected.images ?? []
    const hasMany = images.length > 1

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeSlideIn 0.2s ease' }}>
        <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>

        {previewOpen && images.length > 0 && (
          <ImagePreview
            images={images}
            initialIndex={imgIndex}
            alt={selected.name}
            onClose={() => setPreviewOpen(false)}
          />
        )}

        <button onClick={() => { setSelected(null); setImgIndex(0) }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--icon-accent)', fontSize: 13, fontWeight: 600, padding: 0, alignSelf: 'flex-start' }}>
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to Projects
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ color: 'var(--icon-accent)' }}><Icon name={selected.icon} size={36} /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>{selected.name}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <p style={{ fontSize: 12, color: 'var(--icon-accent)', fontWeight: 600 }}>{selected.type}</p>
            {selected.countryCode && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--window-text-muted)', fontWeight: 500 }}>
                <ReactCountryFlag countryCode={selected.countryCode} svg style={{ width: 16, height: 12, borderRadius: 2 }} />
                {selected.location}
              </span>
            )}
          </div>
        </div>

        <p style={{ fontSize: 14, color: 'var(--window-text-muted)', lineHeight: 1.75 }}>{selected.desc}</p>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--window-text-muted)', marginBottom: 8 }}>Tech Stack</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selected.stack.map((tech) => (
              <span key={tech} style={{ fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 999, background: 'var(--icon-accent)', color: '#fff' }}>{tech}</span>
            ))}
          </div>
        </div>

        {images.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--window-text-muted)', marginBottom: 10 }}>Screenshots</p>
            <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', background: 'var(--window-titlebar)', border: '1px solid var(--window-titlebar-border)', cursor: 'zoom-in', minHeight: 160 }}
              onClick={() => setPreviewOpen(true)}>
              {!imgLoaded && (
                <div className="img-skeleton" style={{ position: 'absolute', inset: 0, zIndex: 1 }} />
              )}
              <NextImage
                src={images[imgIndex]}
                alt={`${selected.name} screenshot ${imgIndex + 1}`}
                width={800}
                height={500}
                quality={85}
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', maxHeight: 280, opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
                onLoad={() => setImgLoaded(true)}
              />
              {/* Zoom hint */}
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, color: '#b8e8ff', fontSize: 11, pointerEvents: 'none' }}>
                <ZoomIn size={12} /> Zoom
              </div>
              {hasMany && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + images.length) % images.length) }}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % images.length) }}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <ChevronRight size={16} />
                  </button>
                  <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
                    {images.map((_, i) => (
                      <button key={i} onClick={(e) => { e.stopPropagation(); setImgIndex(i) }}
                        style={{ width: i === imgIndex ? 18 : 6, height: 6, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0, background: i === imgIndex ? 'rgba(0,210,255,0.9)' : 'rgba(255,255,255,0.4)', transition: 'width 0.2s' }} />
                    ))}
                  </div>
                  <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.55)', borderRadius: 6, padding: '3px 8px', color: '#b8e8ff', fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}>
                    {imgIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--window-text-muted)', marginBottom: 10 }}>Key Highlights</p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {selected.highlights.map((point, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--window-text-muted)', lineHeight: 1.65, paddingLeft: 16, position: 'relative' }}>
                <span style={{ position: 'absolute', left: 2, top: '0.55em', width: 5, height: 5, borderRadius: '50%', background: 'var(--icon-accent)' }} />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {selected.url !== '#' && (
          <a href={selected.url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: 'var(--icon-accent)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', alignSelf: 'flex-start' }}>
            <ExternalLink size={14} /> Visit Site
          </a>
        )}
      </div>
    )
  }

  // ── List view ────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <Chip active={!activeFilter} onClick={() => setActiveFilter(null)}>All</Chip>
        {filterChips.map((chip) => (
          <Chip key={chip.label} active={activeFilter === chip.label} onClick={() => toggle(chip.label)}>{chip.label}</Chip>
        ))}
      </div>

      {/* Count */}
      <p style={{ fontSize: 12, color: 'var(--window-text-muted)', marginTop: -6 }}>
        {filtered.length} project{filtered.length !== 1 ? 's' : ''}
        {activeFilter && <span> with <span style={{ color: 'var(--icon-accent)', fontWeight: 600 }}>{activeFilter}</span></span>}
      </p>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((project) => (
          <button key={project.name} onClick={() => setSelected(project)}
            style={{ background: 'var(--window-titlebar)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--window-titlebar-border)', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--icon-accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--icon-accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--window-titlebar-border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--window-text)', display: 'flex', alignItems: 'center', gap: 7, letterSpacing: '-0.02em' }}>
                <span style={{ color: 'var(--icon-accent)', flexShrink: 0 }}><Icon name={project.icon} size={48} /></span>{project.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {project.countryCode && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--window-text-muted)' }}>
                    <ReactCountryFlag countryCode={project.countryCode} svg style={{ width: 14, height: 10, borderRadius: 2 }} />
                    {project.location}
                  </span>
                )}
                <span style={{ fontSize: 11, color: 'var(--icon-accent)', fontWeight: 600 }}>OPEN →</span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--window-text-muted)', marginTop: 6, lineHeight: 1.6 }}>{project.desc}</p>
            <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
              {project.stack.map((tech) => (
                <span key={tech} style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: tech === activeFilter ? 'var(--icon-accent)' : 'var(--window-bg)', color: tech === activeFilter ? '#fff' : 'var(--window-text-muted)', border: `1px solid ${tech === activeFilter ? 'var(--icon-accent)' : 'var(--window-titlebar-border)'}`, transition: 'background 0.15s, color 0.15s' }}>
                  {tech}
                </span>
              ))}
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--window-text-muted)', fontSize: 13, padding: '32px 0' }}>No projects found for this skill.</p>
        )}
      </div>
    </div>
  )
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? 'var(--icon-accent)' : 'var(--window-titlebar-border)'}`, background: active ? 'var(--icon-accent)' : 'var(--window-titlebar)', color: active ? '#fff' : 'var(--window-text-muted)', transition: 'background 0.15s, color 0.15s, border-color 0.15s', lineHeight: 1.6 }}>
      {children}
    </button>
  )
}
