'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  User, Briefcase, Building2, GraduationCap,
  Mail, Feather, LogOut, Home, ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const NAV = [
  { href: '/cms/about',      label: 'About',      icon: User },
  { href: '/cms/experience', label: 'Experience',  icon: Building2 },
  { href: '/cms/projects',   label: 'Projects',    icon: Briefcase },
  { href: '/cms/education',  label: 'Education',   icon: GraduationCap },
  { href: '/cms/contact',    label: 'Contact',     icon: Mail },
  { href: '/cms/journals',   label: 'Journals',    icon: Feather },
]

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Auth guard
  useEffect(() => {
    if (mounted && !user) router.replace('/')
  }, [mounted, user, router])

  // Sync theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) document.documentElement.setAttribute('data-theme', saved)
  }, [])

  if (!mounted || !user) return null

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--desktop-bg)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 48,
        background: 'var(--menubar-bg)',
        borderBottom: '1px solid var(--window-titlebar-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🗺️</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--window-text)', letterSpacing: '-0.02em' }}>
            Portfolio CMS
          </span>
          <span style={{ color: 'var(--window-text-muted)', fontSize: 13 }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--window-text-muted)' }}>
            {pathname.replace('/cms', '').replace('/', '') || 'dashboard'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 12px', borderRadius: 8,
            background: 'var(--window-bg)',
            border: '1px solid var(--window-titlebar-border)',
            color: 'var(--window-text)', fontSize: 12, fontWeight: 600,
            textDecoration: 'none',
          }}>
            <Home size={12} /> Portfolio
          </Link>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 8,
            background: 'var(--window-bg)',
            border: '1px solid var(--window-titlebar-border)',
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%',
              background: 'var(--icon-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 800, color: '#fff',
            }}>
              {user.username.slice(0, 2).toUpperCase()}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--window-text)' }}>
              {user.username}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 8,
              background: 'none',
              border: '1px solid var(--window-titlebar-border)',
              color: '#ff3b30', fontSize: 12, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogOut size={12} /> Sign out
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        <aside style={{
          width: 200,
          background: 'var(--window-bg)',
          borderRight: '1px solid var(--window-titlebar-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 10px',
          gap: 4,
          flexShrink: 0,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--window-text-muted)',
            padding: '0 8px', marginBottom: 6,
          }}>
            Content
          </p>

          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 10px', borderRadius: 8,
                  background: active ? 'var(--window-titlebar)' : 'none',
                  color: active ? 'var(--icon-accent)' : 'var(--window-text)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                  borderLeft: active ? '2px solid var(--icon-accent)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.background = 'var(--window-titlebar)'
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.background = 'none'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} />
                  {label}
                </span>
                {active && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
              </Link>
            )
          })}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
