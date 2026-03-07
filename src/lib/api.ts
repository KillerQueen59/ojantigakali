const BASE = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? '';

export function apiRequest(
  apiKey: string,
  path: string,
  options: RequestInit = {}
) {
  return fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(options.headers ?? {}),
    },
  }).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
    return r.status === 204 ? null : r.json();
  });
}
