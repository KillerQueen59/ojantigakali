'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import staticData from '@/data/portfolio'
import SaveButton from '@/components/cms/SaveButton'
import type { EducationEntry, Achievement } from '@/types/portfolio'

export default function CmsEducationPage() {
  const [edu, setEdu]   = useState<EducationEntry[]>(staticData.education.education)
  const [ach, setAch]   = useState<Achievement[]>(staticData.education.achievements)

  const updateEdu = (i: number, key: keyof EducationEntry, val: string | string[]) =>
    setEdu((prev) => { const n = [...prev]; n[i] = { ...n[i], [key]: val }; return n })

  const updateAch = (i: number, key: keyof Achievement, val: string) =>
    setAch((prev) => { const n = [...prev]; n[i] = { ...n[i], [key]: val }; return n })

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Education */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em' }}>Education</h1>
            <p style={{ fontSize: 13, color: 'var(--window-text-muted)', marginTop: 4 }}>Degrees and academic highlights.</p>
          </div>
          <AddButton onClick={() => setEdu((p) => [...p, { degree: '', school: '', period: '', location: '', gpa: '', highlights: [] }])} label="Add degree" />
        </div>

        {edu.map((e, i) => (
          <Card key={i} title={e.degree || `Degree ${i + 1}`} onRemove={() => setEdu((p) => p.filter((_, idx) => idx !== i))}>
            <Grid>
              <Field label="Degree"><Input value={e.degree} onChange={(v) => updateEdu(i, 'degree', v)} /></Field>
              <Field label="School"><Input value={e.school} onChange={(v) => updateEdu(i, 'school', v)} /></Field>
              <Field label="Period"><Input value={e.period} onChange={(v) => updateEdu(i, 'period', v)} /></Field>
              <Field label="Location"><Input value={e.location} onChange={(v) => updateEdu(i, 'location', v)} /></Field>
              <Field label="GPA"><Input value={e.gpa ?? ''} onChange={(v) => updateEdu(i, 'gpa', v)} placeholder="3.78 / 4.00" /></Field>
            </Grid>
            <Field label="Highlights (one per line)">
              <Textarea value={e.highlights.join('\n')} rows={3} onChange={(v) => updateEdu(i, 'highlights', v.split('\n'))} />
            </Field>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--window-text)' }}>Achievements</h2>
          <AddButton onClick={() => setAch((p) => [...p, { name: '', year: '', org: '' }])} label="Add" />
        </div>

        {ach.map((a, i) => (
          <Card key={i} title={a.name || `Achievement ${i + 1}`} onRemove={() => setAch((p) => p.filter((_, idx) => idx !== i))}>
            <Grid>
              <Field label="Name"><Input value={a.name} onChange={(v) => updateAch(i, 'name', v)} /></Field>
              <Field label="Year"><Input value={a.year} onChange={(v) => updateAch(i, 'year', v)} /></Field>
            </Grid>
            <Field label="Organisation / Description"><Input value={a.org} onChange={(v) => updateAch(i, 'org', v)} /></Field>
          </Card>
        ))}
      </div>

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
