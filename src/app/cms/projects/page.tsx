'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import staticData from '@/data/portfolio';
import SaveButton from '@/components/cms/SaveButton';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';
import type { Project } from '@/types/portfolio';

type Proj = Project & { _id?: number };

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? '';

export default function CmsProjectsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Proj[]>(staticData.projects);
  const deletedIds = useRef<number[]>([]);

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/projects`)
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          list: Array<Project & { id: number; country_code?: string }> | null
        ) => {
          if (!list) return;
          setItems(
            list.map(({ id, country_code, ...rest }) => ({
              ...rest,
              countryCode: country_code ?? rest.countryCode ?? '',
              _id: id,
            }))
          );
          deletedIds.current = [];
        }
      )
      .catch(() => {});
  }, []);

  const update = (i: number, key: keyof Proj, val: string | string[]) =>
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        name: '',
        type: '',
        icon: '📦',
        url: '',
        desc: '',
        stack: [],
        highlights: [],
      },
    ]);

  const removeItem = (i: number) => {
    const id = items[i]._id;
    if (id) deletedIds.current.push(id);
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSave = async () => {
    for (const id of deletedIds.current) {
      await apiRequest(user!.apiKey, `/projects/${id}`, { method: 'DELETE' });
    }
    deletedIds.current = [];

    for (let i = 0; i < items.length; i++) {
      const { _id, countryCode, ...rest } = items[i];
      const body = JSON.stringify({
        ...rest,
        country_code: countryCode ?? '',
        sort_order: i,
        stack: rest.stack.filter(Boolean),
        highlights: rest.highlights.filter(Boolean),
        images: rest.images ?? [],
      });
      if (_id) {
        await apiRequest(user!.apiKey, `/projects/${_id}`, {
          method: 'PUT',
          body,
        });
      } else {
        const created = await apiRequest(user!.apiKey, '/projects', {
          method: 'POST',
          body,
        });
        setItems((prev) =>
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
        gap: 28,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
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
            Projects
          </h1>
          <p
            style={{
              fontSize: 13,
              color: 'var(--window-text-muted)',
              marginTop: 4,
            }}
          >
            Showcase projects and side work.
          </p>
        </div>
        <AddButton onClick={addItem} label="Add project" />
      </div>

      {items.map((proj, i) => (
        <Card
          key={i}
          title={proj.name || `Project ${i + 1}`}
          onRemove={() => removeItem(i)}
        >
          <Grid>
            <Field label="Icon">
              <Input
                value={proj.icon}
                onChange={(v) => update(i, 'icon', v)}
                placeholder="📦 or /path/to/logo.webp"
              />
            </Field>
            <Field label="URL">
              <Input
                value={proj.url}
                onChange={(v) => update(i, 'url', v)}
                placeholder="https://..."
              />
            </Field>
            <Field label="Name">
              <Input value={proj.name} onChange={(v) => update(i, 'name', v)} />
            </Field>
            <Field label="Type / Category">
              <Input
                value={proj.type}
                onChange={(v) => update(i, 'type', v)}
                placeholder="e.g. Full-stack"
              />
            </Field>
            <Field label="Location">
              <Input
                value={proj.location ?? ''}
                onChange={(v) => update(i, 'location', v)}
                placeholder="e.g. Indonesia"
              />
            </Field>
            <Field label="Country Code">
              <Input
                value={proj.countryCode ?? ''}
                onChange={(v) => update(i, 'countryCode', v)}
                placeholder="e.g. ID"
              />
            </Field>
          </Grid>
          <Field label="Description">
            <Textarea
              value={proj.desc}
              rows={3}
              onChange={(v) => update(i, 'desc', v)}
            />
          </Field>
          <Field label="Stack (comma-separated)">
            <Input
              value={proj.stack.join(', ')}
              onChange={(v) =>
                update(
                  i,
                  'stack',
                  v
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
          <Field label="Highlights (one per line)">
            <Textarea
              value={proj.highlights.join('\n')}
              rows={4}
              onChange={(v) => update(i, 'highlights', v.split('\n'))}
            />
          </Field>
        </Card>
      ))}

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
