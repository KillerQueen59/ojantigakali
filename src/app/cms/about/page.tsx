'use client';

import { useState } from 'react';
import staticData from '@/data/portfolio';
import SaveButton from '@/components/cms/SaveButton';

export default function CmsAboutPage() {
  const [data, setData] = useState(staticData.about);

  const setFact = (i: number, key: keyof (typeof data.facts)[0], val: string) =>
    setData((d) => {
      const facts = [...d.facts];
      facts[i] = { ...facts[i], [key]: val };
      return { ...d, facts };
    });

  return (
    <div
      style={{
        maxWidth: 680,
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
          About
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--window-text-muted)',
            marginTop: 4,
          }}
        >
          Your name, title, bio and quick-facts card.
        </p>
      </div>

      <Section label="Name">
        <Input
          value={data.name}
          onChange={(v) => setData((d) => ({ ...d, name: v }))}
        />
      </Section>

      <Section label="Title / Tagline">
        <Input
          value={data.title}
          onChange={(v) => setData((d) => ({ ...d, title: v }))}
        />
      </Section>

      <Section label="Bio">
        <Textarea
          value={data.bio}
          rows={6}
          onChange={(v) => setData((d) => ({ ...d, bio: v }))}
        />
      </Section>

      <Section label="Facts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.facts.map((fact, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 2fr',
                gap: 8,
              }}
            >
              <Input
                value={fact.emoji ?? ''}
                onChange={(v) => setFact(i, 'emoji', v)}
                placeholder="emoji"
              />
              <Input
                value={fact.key}
                onChange={(v) => setFact(i, 'key', v)}
                placeholder="Label"
              />
              <Input
                value={fact.value}
                onChange={(v) => setFact(i, 'value', v)}
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      </Section>

      <SaveButton />
    </div>
  );
}

// ── Tiny shared UI ─────────────────────────────────────────────────────────
function Section({
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
  background: 'var(--window-bg)',
  color: 'var(--window-text)',
  fontSize: 13,
  fontFamily: 'inherit',
  outline: 'none',
};
