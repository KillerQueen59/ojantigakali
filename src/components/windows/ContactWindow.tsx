'use client'

import { useState } from 'react'
import { Mail, MapPin, Linkedin, Github } from 'lucide-react'
import type { ContactData } from '@/types/portfolio'

export default function ContactWindow({ data }: { data: ContactData | null | undefined }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent]   = useState(false)

  const email    = data?.email    ?? 'fauzanramadhan59@gmail.com'
  const location = data?.location ?? 'Bogor, Indonesia'
  const github   = data?.github   ?? 'https://github.com/fauzanramadhan'
  const linkedin = data?.linkedin ?? 'https://linkedin.com/in/fauzanramadhan'

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid var(--window-titlebar-border)',
    background: 'var(--window-titlebar)', color: 'var(--window-text)',
    fontSize: 13, outline: 'none', fontFamily: 'inherit',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', form)
    setSent(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Info row */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {[
          { icon: <Mail size={14} />, label: 'Email',    value: email },
          { icon: <MapPin size={14} />, label: 'Location', value: location },
        ].map(({ icon, label, value }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--icon-accent)' }}>{icon}</span>
            <div>
              <p style={{ fontSize: 11, color: 'var(--window-text-muted)', fontWeight: 600 }}>{label}</p>
              <p style={{ fontSize: 13, color: 'var(--window-text)', fontWeight: 500 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { icon: <Github size={16} />,   label: 'GitHub',   url: github },
          { icon: <Linkedin size={16} />, label: 'LinkedIn', url: linkedin },
        ].map(({ icon, label, url }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'var(--window-titlebar)', border: '1px solid var(--window-titlebar-border)', color: 'var(--window-text)', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            {icon} {label}
          </a>
        ))}
      </div>

      <div style={{ height: 1, background: 'var(--window-titlebar-border)' }} />

      {/* Contact form */}
      {sent ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--window-text-muted)', fontSize: 14 }}>
          <div style={{ marginBottom: 12, color: 'var(--icon-accent)', display: 'flex', justifyContent: 'center' }}><Mail size={40} /></div>
          <p style={{ fontWeight: 600, color: 'var(--window-text)' }}>Message sent!</p>
          <p style={{ marginTop: 4 }}>I&apos;ll get back to you as soon as possible.</p>
          <button
            onClick={() => { setForm({ name: '', email: '', message: '' }); setSent(false) }}
            style={{ marginTop: 16, padding: '8px 16px', borderRadius: 8, background: 'var(--icon-accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <Label>Name</Label>
              <input required placeholder="Your name" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Email</Label>
              <input required type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div>
            <Label>Message</Label>
            <textarea required rows={5} placeholder="Say hello..." value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--icon-accent)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, alignSelf: 'flex-end', letterSpacing: '0.02em' }}>
            Send Message →
          </button>
        </form>
      )}
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--window-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
      {children}
    </label>
  )
}
