'use client'

import { Mail, MapPin, Linkedin, Github } from 'lucide-react'
import type { ContactData } from '@/types/portfolio'

export default function ContactWindow({ data }: { data: ContactData | null | undefined }) {
  const email    = data?.email    ?? 'fauzanramadhan59@gmail.com'
  const location = data?.location ?? 'Bogor, Indonesia'
  const github   = data?.github   ?? 'https://github.com/fauzanramadhan'
  const linkedin = data?.linkedin ?? 'https://linkedin.com/in/fauzanramadhan'

  const subject = encodeURIComponent("Hi Fauzan — Let's Connect!")
  const body = encodeURIComponent(
`Hi Fauzan,

I came across your portfolio and would love to connect.

[Your message here]

Best regards,
[Your Name]`
  )
  const mailtoHref = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${subject}&body=${body}`

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

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
        <p style={{ fontSize: 13, color: 'var(--window-text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
          Have a project in mind or just want to say hi?<br />Click below and your email app will open with a template ready to go.
        </p>
        <a
          href={mailtoHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 8, background: 'var(--icon-accent)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}
        >
          <Mail size={15} /> Contact Me!
        </a>
      </div>
    </div>
  )
}
