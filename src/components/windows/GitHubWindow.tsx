import { Github, Star, GitFork, Code } from 'lucide-react'
import type { GitHubData } from '@/types/portfolio'

export default function GitHubWindow({ data }: { data: GitHubData | null | undefined }) {
  const username  = data?.username  ?? '@fauzanramadhan'
  const url       = data?.url       ?? 'https://github.com/fauzanramadhan'
  const repos     = data?.repos     ?? 0
  const stars     = data?.stars     ?? 0
  const followers = data?.followers ?? 0
  const pinned    = data?.pinned    ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--window-titlebar)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--window-titlebar-border)' }}>
          <Github size={28} style={{ color: 'var(--window-text)' }} />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--window-text)' }}>{username}</p>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--icon-accent)', textDecoration: 'none', fontWeight: 500 }}>
            {url.replace('https://', '')} →
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, marginLeft: 'auto' }}>
          {[
            { label: 'Repos',     value: String(repos) },
            { label: 'Stars',     value: String(stars) },
            { label: 'Followers', value: String(followers) },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--window-text)' }}>{value}</p>
              <p style={{ fontSize: 11, color: 'var(--window-text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--window-titlebar-border)' }} />

      <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--window-text-muted)' }}>
        Pinned Repositories
      </p>

      {/* Repo grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {pinned.map((repo) => (
          <div key={repo.name} style={{ background: 'var(--window-titlebar)', borderRadius: 10, padding: '14px', border: '1px solid var(--window-titlebar-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Code size={12} style={{ color: 'var(--window-text-muted)', flexShrink: 0 }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {repo.name}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.5, flex: 1 }}>
              {repo.desc}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: repo.color, display: 'inline-block' }} />
                <span style={{ color: 'var(--window-text-muted)' }}>{repo.lang}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--window-text-muted)' }}>
                <Star size={11} />{repo.stars}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--window-text-muted)' }}>
                <GitFork size={11} />{repo.forks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
