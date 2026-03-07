'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import TiptapEditor from '@/components/cms/TiptapEditor';
import SaveButton from '@/components/cms/SaveButton';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

export default function CmsJournalNewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);

  const handleSave = async () => {
    const payload = {
      title,
      date,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      body,
      published,
    };
    await apiRequest(user!.apiKey, '/entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    router.push('/cms/journals');
  };

  return (
    <div
      style={{
        maxWidth: 760,
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={() => router.push('/cms/journals')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--icon-accent)',
            fontSize: 13,
            fontWeight: 600,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ color: 'var(--window-text-muted)' }}>·</span>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: 'var(--window-text)',
            letterSpacing: '-0.03em',
          }}
        >
          New entry
        </h1>
      </div>

      <JournalForm
        title={title}
        setTitle={setTitle}
        date={date}
        setDate={setDate}
        tags={tags}
        setTags={setTags}
        body={body}
        setBody={setBody}
        published={published}
        setPublished={setPublished}
      />

      <SaveButton onSave={handleSave} />
    </div>
  );
}

export function JournalForm({
  title,
  setTitle,
  date,
  setDate,
  tags,
  setTags,
  body,
  setBody,
  published,
  setPublished,
}: {
  title: string;
  setTitle: (v: string) => void;
  date: string;
  setDate: (v: string) => void;
  tags: string;
  setTags: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  published: boolean;
  setPublished: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <Field label="Title">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title…"
          style={{
            ...inputStyle,
            fontSize: 18,
            fontWeight: 700,
            padding: '10px 14px',
          }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
        <Field label="Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Tags (comma-separated)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tech, life, coding"
            style={inputStyle}
          />
        </Field>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          role="switch"
          aria-checked={published}
          onClick={() => setPublished(!published)}
          style={{
            width: 36,
            height: 20,
            borderRadius: 999,
            background: published ? '#30d158' : 'rgba(0,0,0,0.18)',
            border: 'none',
            cursor: 'pointer',
            position: 'relative',
            padding: 0,
            transition: 'background 0.22s',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: published ? 18 : 3,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.22s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }}
          />
        </button>
        <span
          style={{ fontSize: 13, fontWeight: 600, color: 'var(--window-text)' }}
        >
          {published ? 'Published' : 'Draft'}
        </span>
      </div>

      <Field label="Body">
        <TiptapEditor content={body} onChange={setBody} />
      </Field>
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

const inputStyle: React.CSSProperties = {
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
