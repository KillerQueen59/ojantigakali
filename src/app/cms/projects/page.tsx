'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import staticData from '@/data/portfolio'
import SaveButton from '@/components/cms/SaveButton'
import type { Project } from '@/types/portfolio'

export default function CmsProjectsPage() {
  const [items, setItems] = useState<Project[]>(staticData.projects)

  const update = (i: number, key: keyof Project, val: string | string[]) =>
    setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [key]: val }
      return next
    })

  const addItem = () =>
    setItems((prev) => [...prev, { name: '', type: '', icon: '📦', url: '', desc: '', stack: [], highlights: [] }])

  const removeItem = (i: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em' }}>Projects</h1>
          <p style={{ fontSize: 13, color: 'var(--window-text-muted)', marginTop: 4 }}>Showcase projects and side work.</p>
        </div>
        <AddButton onClick={addItem} label="Add project" />
      </div>

      {items.map((proj, i) => (
        <Card key={i} title={proj.name || `Project ${i + 1}`} onRemove={() => removeItem(i)}>
          <Grid>
            <Field label="Icon">
              <Input value={proj.icon} onChange={(v) => update(i, 'icon', v)} placeholder="📦" />
            </Field>
            <Field label="URL">
              <Input value={proj.url} onChange={(v) => update(i, 'url', v)} placeholder="https://..." />
            </Field>
            <Field label="Name">
              <Input value={proj.name} onChange={(v) => update(i, 'name', v)} />
            </Field>
            <Field label="Type / Category">
              <Input value={proj.type} onChange={(v) => update(i, 'type', v)} placeholder="e.g. Freelance · Full-stack" />
            </Field>
          </Grid>
          <Field label="Description">
            <Textarea value={proj.desc} rows={3} onChange={(v) => update(i, 'desc', v)} />
          </Field>
          <Field label="Stack (comma-separated)">
            <Input value={proj.stack.join(', ')} onChange={(v) => update(i, 'stack', v.split(',').map((s) => s.trim()).filter(Boolean))} />
          </Field>
          <Field label="Highlights (one per line)">
            <Textarea value={proj.highlights.join('\n')} rows={4} onChange={(v) => update(i, 'highlights', v.split('\n'))} />
          </Field>
        </Card>
      ))}

      <SaveButton />
    </div>
  )
}

function Card({ children, title, onRemove }: { children: React.ReactNode; title: string; onRemove: () => void }) {
  return (
    <div style={{ borderRadius: 12, border: '1px solid var(--window-titlebar-border)', background: 'var(--window-bg)', overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: 'var(--window-titlebar)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)' }}>{title}</span>
        <button onClick={onRemove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff3b30', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}>
          <Trash2 size={12} /> Remove
        </button>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--window-text-muted)' }}>{label}</label>
      {children}
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--window-titlebar-border)', background: 'var(--window-bg)', color: 'var(--window-text)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
      <Plus size={13} /> {label}
    </button>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={fieldStyle} />
}

function Textarea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} />
}

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid var(--window-titlebar-border)',
  background: 'var(--window-titlebar)', color: 'var(--window-text)',
  fontSize: 13, fontFamily: 'inherit', outline: 'none',
}
