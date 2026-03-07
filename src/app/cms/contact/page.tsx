'use client';

import { useEffect, useState } from 'react';
import staticData from '@/data/portfolio';
import SaveButton from '@/components/cms/SaveButton';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? '';

export default function CmsContactPage() {
  const { user } = useAuth();
  const [data, setData] = useState(staticData.contact);
  const set = (key: keyof typeof data, val: string) =>
    setData((d) => ({ ...d, [key]: val }));

  useEffect(() => {
    if (!API_URL) return;
    fetch(`${API_URL}/sections/contact`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setData(d);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    await apiRequest(user!.apiKey, '/sections/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  };

  return (
    <div
      style={{
        maxWidth: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
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
          Contact
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--window-text-muted)',
            marginTop: 4,
          }}
        >
          Email, location, and social links.
        </p>
      </div>

      <Field label="Email">
        <Input
          value={data.email}
          onChange={(v) => set('email', v)}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Location">
        <Input
          value={data.location}
          onChange={(v) => set('location', v)}
          placeholder="City, Country"
        />
      </Field>
      <Field label="GitHub URL">
        <Input
          value={data.github}
          onChange={(v) => set('github', v)}
          placeholder="https://github.com/..."
        />
      </Field>
      <Field label="LinkedIn URL">
        <Input
          value={data.linkedin}
          onChange={(v) => set('linkedin', v)}
          placeholder="https://linkedin.com/in/..."
        />
      </Field>

      <SaveButton onSave={handleSave} />
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: 11,
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
      style={{
        width: '100%',
        padding: '9px 12px',
        borderRadius: 8,
        border: '1px solid var(--window-titlebar-border)',
        background: 'var(--window-bg)',
        color: 'var(--window-text)',
        fontSize: 13,
        fontFamily: 'inherit',
        outline: 'none',
      }}
    />
  );
}
