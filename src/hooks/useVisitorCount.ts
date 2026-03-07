'use client';

import { useEffect, useState } from 'react';

export function useVisitorCount(): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_JOURNAL_API_URL;
    if (!apiUrl || typeof EventSource === 'undefined') return;

    const sse = new EventSource(`${apiUrl}/visitors/live`);

    sse.onmessage = (e) => {
      const n = parseInt(e.data, 10);
      if (!isNaN(n)) setCount(n);
    };

    sse.onerror = () => {
      sse.close();
    };

    return () => sse.close();
  }, []);

  return count;
}
