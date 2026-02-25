import { ExternalLink } from 'lucide-react'
import { Icon } from '@/utils/iconMap'
import type { LinksData } from '@/types/portfolio'

export default function LinksWindow({ data }: { data: LinksData | null | undefined }) {
  const categories = data?.categories ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {categories.map((group) => (
        <div key={group.category}>
          <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--window-text-muted)', marginBottom: 10 }}>
            {group.category}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--window-titlebar)', border: '1px solid var(--window-titlebar-border)', textDecoration: 'none', transition: 'opacity 0.15s' }}
              >
                <span style={{ flexShrink: 0, color: 'var(--icon-accent)' }}><Icon name={item.icon} size={20} /></span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)' }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--window-text-muted)', marginTop: 1 }}>{item.desc}</p>
                </div>
                <ExternalLink size={13} style={{ color: 'var(--window-text-muted)', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
