'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import SaveButton from '@/components/cms/SaveButton';
import { JournalForm } from '../new/page';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? '';

export default function CmsJournalEditPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (!API_URL) {
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/entries/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((e) => {
        if (!e) return;
        setTitle(e.title ?? '');
        setDate(e.date ?? '');
        setTags((e.tags ?? []).join(', '));
        setBody(e.body ?? '');
        setPublished(e.published ?? false);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

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
    await apiRequest(user!.apiKey, `/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: 40,
          color: 'var(--window-text-muted)',
          fontSize: 13,
        }}
      >
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} />
        Loading entry…
      </div>
    );
  }

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
          Edit entry #{id}
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
