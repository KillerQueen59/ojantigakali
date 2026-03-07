'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import staticData from '@/data/portfolio';
import SaveButton from '@/components/cms/SaveButton';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import type { EducationEntry, Achievement } from '@/types/portfolio';

type Edu = EducationEntry & { _id?: number };
type Ach = Achievement & { _id?: number };

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? '';

export default function CmsEducationPage() {
  const { user } = useAuth();
  const [edu, setEdu] = useState<Edu[]>(staticData.education.education);
  const [ach, setAch] = useState<Ach[]>(staticData.education.achievements);
  const deletedEduIds = useRef<number[]>([]);
  const deletedAchIds = useRef<number[]>([]);

  useEffect(() => {
    if (!API_URL) return;
    Promise.all([
      fetch(`${API_URL}/education`).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_URL}/achievements`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([eduList, achList]) => {
        if (eduList) {
          setEdu(
            eduList.map(({ id, ...rest }: EducationEntry & { id: number }) => ({
              ...rest,
              _id: id,
            }))
          );
          deletedEduIds.current = [];
        }
        if (achList) {
          setAch(
            achList.map(({ id, ...rest }: Achievement & { id: number }) => ({
              ...rest,
              _id: id,
            }))
          );
          deletedAchIds.current = [];
        }
      })
      .catch(() => {});
  }, []);

  const updateEdu = (i: number, key: keyof Edu, val: string | string[]) =>
    setEdu((prev) => {
      const n = [...prev];
      n[i] = { ...n[i], [key]: val };
      return n;
    });

  const updateAch = (i: number, key: keyof Ach, val: string) =>
    setAch((prev) => {
      const n = [...prev];
      n[i] = { ...n[i], [key]: val };
      return n;
    });

  const removeEdu = (i: number) => {
    const id = edu[i]._id;
    if (id) deletedEduIds.current.push(id);
    setEdu((p) => p.filter((_, idx) => idx !== i));
  };

  const removeAch = (i: number) => {
    const id = ach[i]._id;
    if (id) deletedAchIds.current.push(id);
    setAch((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    for (const id of deletedEduIds.current) {
      await apiRequest(user!.apiKey, `/education/${id}`, { method: 'DELETE' });
    }
    deletedEduIds.current = [];

    for (let i = 0; i < edu.length; i++) {
      const { _id, ...payload } = edu[i];
      const body = JSON.stringify({
        ...payload,
        sort_order: i,
        highlights: payload.highlights.filter(Boolean),
      });
      if (_id) {
        await apiRequest(user!.apiKey, `/education/${_id}`, {
          method: 'PUT',
          body,
        });
      } else {
        const created = await apiRequest(user!.apiKey, '/education', {
          method: 'POST',
          body,
        });
        setEdu((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, _id: created.id } : it))
        );
      }
    }

    for (const id of deletedAchIds.current) {
      await apiRequest(user!.apiKey, `/achievements/${id}`, {
        method: 'DELETE',
      });
    }
    deletedAchIds.current = [];

    for (let i = 0; i < ach.length; i++) {
      const { _id, ...payload } = ach[i];
      const body = JSON.stringify({ ...payload, sort_order: i });
      if (_id) {
        await apiRequest(user!.apiKey, `/achievements/${_id}`, {
          method: 'PUT',
          body,
        });
      } else {
        const created = await apiRequest(user!.apiKey, '/achievements', {
          method: 'POST',
          body,
        });
        setAch((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, _id: created.id } : it))
        );
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 720,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {/* Education */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--window-text)',
                letterSpacing: '-0.03em',
              }}
            >
              Education
            </h1>
            <p
              style={{
                fontSize: 13,
                color: 'var(--window-text-muted)',
                marginTop: 4,
              }}
            >
              Degrees and academic highlights.
            </p>
          </div>
          <AddButton
            onClick={() =>
              setEdu((p) => [
                ...p,
                {
                  degree: '',
                  school: '',
                  period: '',
                  location: '',
                  gpa: '',
                  highlights: [],
                },
              ])
            }
            label="Add degree"
          />
        </div>

        {edu.map((e, i) => (
          <Card
            key={i}
            title={e.degree || `Degree ${i + 1}`}
            onRemove={() => removeEdu(i)}
          >
            <Grid>
              <Field label="Degree">
                <Input
                  value={e.degree}
                  onChange={(v) => updateEdu(i, 'degree', v)}
                />
              </Field>
              <Field label="School">
                <Input
                  value={e.school}
                  onChange={(v) => updateEdu(i, 'school', v)}
                />
              </Field>
              <Field label="Period">
                <Input
                  value={e.period}
                  onChange={(v) => updateEdu(i, 'period', v)}
                />
              </Field>
              <Field label="Location">
                <Input
                  value={e.location}
                  onChange={(v) => updateEdu(i, 'location', v)}
                />
              </Field>
              <Field label="GPA">
                <Input
                  value={e.gpa ?? ''}
                  onChange={(v) => updateEdu(i, 'gpa', v)}
                  placeholder="3.78 / 4.00"
                />
              </Field>
            </Grid>
            <Field label="Highlights (one per line)">
              <Textarea
                value={e.highlights.join('\n')}
                rows={3}
                onChange={(v) => updateEdu(i, 'highlights', v.split('\n'))}
              />
            </Field>
          </Card>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--window-text)',
            }}
          >
            Achievements
          </h2>
          <AddButton
            onClick={() =>
              setAch((p) => [...p, { name: '', year: '', org: '' }])
            }
            label="Add"
          />
        </div>

        {ach.map((a, i) => (
          <Card
            key={i}
            title={a.name || `Achievement ${i + 1}`}
            onRemove={() => removeAch(i)}
          >
            <Grid>
              <Field label="Name">
                <Input
                  value={a.name}
                  onChange={(v) => updateAch(i, 'name', v)}
                />
              </Field>
              <Field label="Year">
                <Input
                  value={a.year}
                  onChange={(v) => updateAch(i, 'year', v)}
                />
              </Field>
            </Grid>
            <Field label="Organisation / Description">
              <Input value={a.org} onChange={(v) => updateAch(i, 'org', v)} />
            </Field>
          </Card>
        ))}
      </div>

      <SaveButton onSave={handleSave} />
    </div>
  );
}

function Card({
  children,
  title,
  onRemove,
}: {
  children: React.ReactNode;
  title: string;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid var(--window-titlebar-border)',
        background: 'var(--window-bg)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          background: 'var(--window-titlebar)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)' }}
        >
          {title}
        </span>
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ff3b30',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Trash2 size={12} /> Remove
        </button>
      </div>
      <div
        style={{
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--window-text-muted)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 14px',
        borderRadius: 8,
        border: '1px solid var(--window-titlebar-border)',
        background: 'var(--window-bg)',
        color: 'var(--window-text)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      <Plus size={13} /> {label}
    </button>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={fieldStyle}
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }}
    />
  );
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 8,
  border: '1px solid var(--window-titlebar-border)',
  background: 'var(--window-titlebar)',
  color: 'var(--window-text)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};
