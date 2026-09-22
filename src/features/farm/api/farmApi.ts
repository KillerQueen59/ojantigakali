'use client'

import type { CardKey, CatalogPayload } from '../data/cards'

const BASE = process.env.NEXT_PUBLIC_JOURNAL_API_URL ?? ''
const TOKEN_KEY = 'ojan-farm-token'

export type Account = {
  kind: 'guest' | 'user'
  displayName: string | null
  avatarUrl: string | null
}

export type ServerCard = { key: CardKey; zone: string; num: number }

function getToken(): string {
  if (typeof window === 'undefined') return ''
  try {
    return window.localStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function setToken(tok: string) {
  try {
    window.localStorage.setItem(TOKEN_KEY, tok)
  } catch {
    /* ignore */
  }
}

function authHeaders(): HeadersInit {
  const tok = getToken()
  return tok ? { Authorization: `Bearer ${tok}` } : {}
}

/** Reads a `farm_token` handed back by the OAuth callback, stores it, strips the URL. */
export function captureTokenFromUrl() {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const tok = url.searchParams.get('farm_token')
  if (!tok) return
  setToken(tok)
  url.searchParams.delete('farm_token')
  window.history.replaceState({}, '', url.pathname + url.search + url.hash)
}

/** Fetches the shared card catalog (public, no auth). Null on failure → keep fallback. */
export async function fetchCatalog(): Promise<CatalogPayload | null> {
  try {
    const res = await fetch(`${BASE}/api/farm/catalog`)
    if (!res.ok) return null
    return (await res.json()) as CatalogPayload
  } catch {
    return null
  }
}

/** Ensures a session exists, minting a guest account on first visit. */
export async function ensureSession(): Promise<Account | null> {
  const res = await fetch(`${BASE}/api/farm/session`, {
    method: 'POST',
    headers: authHeaders(),
  })
  if (!res.ok) return null
  const data = await res.json()
  if (data.token) setToken(data.token)
  return (data.account as Account) ?? null
}

export async function fetchCards(): Promise<{ account: Account; cards: ServerCard[] } | null> {
  const res = await fetch(`${BASE}/api/farm/cards`, { headers: authHeaders() })
  if (!res.ok) return null
  return res.json()
}

export async function addCard(card: ServerCard): Promise<void> {
  await fetch(`${BASE}/api/farm/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(card),
  })
}

export async function resetCards(): Promise<void> {
  await fetch(`${BASE}/api/farm/cards`, { method: 'DELETE', headers: authHeaders() })
}

export type TendResult =
  | { ok: true; cooldownMs: number }
  | { ok: false; remainingMs: number }

/** Asks the server for a +1 tend; the server enforces a random per-zone cooldown. */
export async function tend(zone: string): Promise<TendResult> {
  const res = await fetch(`${BASE}/api/farm/tend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ zone }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 429) return { ok: false, remainingMs: Number(data.remainingMs) || 0 }
  if (!res.ok) return { ok: false, remainingMs: 0 }
  return { ok: true, cooldownMs: Number(data.cooldownMs) || 0 }
}

/** Remaining cooldown (ms) per zone, so timers survive a reload. */
export async function fetchCooldowns(): Promise<Record<string, number>> {
  const res = await fetch(`${BASE}/api/farm/cooldowns`, { headers: authHeaders() })
  if (!res.ok) return {}
  const data = await res.json().catch(() => ({}))
  return (data.cooldowns as Record<string, number>) ?? {}
}

export async function logout(): Promise<void> {
  await fetch(`${BASE}/api/farm/auth/logout`, { method: 'POST', headers: authHeaders() })
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

/** Top-level navigation to begin GitHub OAuth; carries the guest token to merge progress. */
export function githubLogin() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams({
    token: getToken(),
    return: window.location.origin,
  })
  window.location.href = `${BASE}/api/farm/auth/github?${params.toString()}`
}
