'use client';

import { useState } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  WifiOff,
  AlertCircle,
} from 'lucide-react';

type Status = 'idle' | 'saving' | 'saved' | 'error' | 'no-backend';

export default function SaveButton({
  onSave,
}: {
  onSave?: () => Promise<void>;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handle = async () => {
    setStatus('saving');
    if (onSave) {
      try {
        await onSave();
        setStatus('saved');
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Save failed');
        setStatus('error');
      }
    } else {
      await new Promise((r) => setTimeout(r, 700));
      setStatus('no-backend');
    }
    setTimeout(() => setStatus('idle'), 3500);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={handle}
        disabled={status === 'saving'}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          padding: '9px 20px',
          borderRadius: 9,
          background: 'var(--icon-accent)',
          color: '#fff',
          border: 'none',
          fontSize: 13,
          fontWeight: 700,
          cursor: status === 'saving' ? 'not-allowed' : 'pointer',
          opacity: status === 'saving' ? 0.7 : 1,
        }}
      >
        {status === 'saving' ? (
          <>
            <Loader2
              size={14}
              style={{ animation: 'spin 0.8s linear infinite' }}
            />{' '}
            Saving…
          </>
        ) : (
          <>
            <Save size={14} /> Save changes
          </>
        )}
      </button>

      {status === 'saved' && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            color: '#30d158',
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(48,209,88,0.1)',
            border: '1px solid rgba(48,209,88,0.25)',
          }}
        >
          <CheckCircle2 size={12} /> Saved
        </span>
      )}
      {status === 'error' && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            color: '#ff3b30',
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(255,59,48,0.1)',
            border: '1px solid rgba(255,59,48,0.25)',
          }}
        >
          <AlertCircle size={12} /> {errorMsg}
        </span>
      )}
      {status === 'no-backend' && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            color: 'var(--window-text-muted)',
            padding: '6px 12px',
            borderRadius: 8,
            background: 'var(--window-titlebar)',
            border: '1px solid var(--window-titlebar-border)',
          }}
        >
          <WifiOff size={12} /> Backend not connected yet
        </span>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}
