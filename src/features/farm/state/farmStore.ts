'use client'

import { useSyncExternalStore } from 'react'
import {
  rollDrop,
  filterValidInventory,
  hydrateCatalog,
  type CardKey,
  type ZoneId,
} from '../data/cards'
import { type CritterId, DEFAULT_UNLOCKED } from '../data/critters'
import {
  addCard,
  captureTokenFromUrl,
  ensureSession,
  fetchCards,
  fetchCatalog,
  fetchCooldowns,
  githubLogin,
  logout,
  resetCards,
  tend as tendRequest,
  type Account,
} from '../api/farmApi'

export type InventoryEntry = { key: CardKey; zone: string; num: number }
export type Meters = Record<ZoneId, number>
export type SectionId =
  | 'about'
  | 'profile'
  | 'experience'
  | 'projects'
  | 'education'
  | 'contact'
  | 'github'
  | 'resume'
export type MobileScreen = 'home' | 'farm' | 'app'
/** Which half of the world the desktop visitor is in. Landing = inside. */
export type Side = 'inside' | 'outside'

export type FarmState = {
  /** Inside the farmhouse (landing + main menu) or outside on the farm. */
  side: Side
  scaleD: number
  meters: Meters
  inventory: InventoryEntry[]
  /** Per-zone cooldown expiry as epoch-ms; a zone is tendable once `Date.now()` passes it. */
  cooldowns: Partial<Record<ZoneId, number>>
  /** Ticks every second while a cooldown is active so consumers can render a live countdown. */
  nowMs: number
  helped: number
  win: SectionId | null
  focusZone: ZoneId | null
  /** Which critter is currently roaming the valley (only one at a time). */
  activePet: ZoneId
  /** House pet roaming the farmhouse interior (separate from the farm-zone pets). */
  activeCritter: CritterId
  /** House pets the visitor has unlocked; the rest are locked (coming soon). */
  unlockedCritters: CritterId[]
  /** Where the active critter should walk to (scene coords), set by clicking the ground. */
  petTarget: { x: number; y: number } | null
  mScreen: MobileScreen
  farmPage: number
  harvest: InventoryEntry | null
  showHarvest: boolean
  showShare: boolean
  /** Trophy shelf (collected cards) modal, opened from inside the farmhouse. */
  showTrophy: boolean
  /** "MY CRITTER" picker modal, opened by clicking the pet's nest. */
  showCritters: boolean
  /** Desk "at-a-glance" card collapsed to its nameplate. */
  deskMin: boolean
  toastMsg: string
  toastOn: boolean
  // Bumps on every successful +1 tend so pets/particles can react.
  tendTick: number
  tendZone: ZoneId | null
  tendKind: 'water' | 'feed' | null
  /** Identity for the card collection: guest until signed in. Null before bootstrap. */
  account: Account | null
}

const STORAGE_KEY = 'ojan-farm-proto'
const HELPED_BASE = 137
const INITIAL_METERS: Meters = { crop: 34, barn: 42, coop: 49, orchard: 11 }

/**
 * Local cache for instant paint + offline. The card `inventory` is now owned by
 * the backend (per-account, keyed to a guest/user identity) and hydrated in
 * `bootstrap()`; this cache just avoids an empty flash before the server responds.
 * `meters` and `helped` remain client-side demo state.
 */
function loadShared(): { meters?: Meters; inventory?: InventoryEntry[] } {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') || {}
  } catch {
    return {}
  }
}
function saveShared(meters: Meters, inventory: InventoryEntry[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ meters, inventory }))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

// Server and the first client render MUST start from the same defaults, or React
// hydration mismatches on any text derived from meters/inventory/helped. The
// localStorage cache is loaded post-mount in bootstrap(), not here.
function initialState(): FarmState {
  return {
    side: 'inside',
    scaleD: 0.7,
    meters: INITIAL_METERS,
    inventory: [],
    cooldowns: {},
    nowMs: Date.now(),
    helped: HELPED_BASE,
    win: null,
    focusZone: null,
    activePet: 'crop',
    activeCritter: 'hamster',
    unlockedCritters: DEFAULT_UNLOCKED,
    petTarget: null,
    mScreen: 'home',
    farmPage: 1,
    harvest: null,
    showHarvest: false,
    showShare: false,
    showTrophy: false,
    showCritters: false,
    deskMin: true,
    toastMsg: '',
    toastOn: false,
    tendTick: 0,
    tendZone: null,
    tendKind: null,
    account: null,
  }
}

const WATER_ZONES: ZoneId[] = ['crop', 'orchard']

let state: FarmState = initialState()
const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}
function set(patch: Partial<FarmState>) {
  state = { ...state, ...patch }
  emit()
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
function toast(msg: string) {
  clearTimeout(toastTimer)
  set({ toastMsg: msg, toastOn: true })
  toastTimer = setTimeout(() => set({ toastOn: false }), 1800)
}

let tickTimer: ReturnType<typeof setInterval> | undefined
/** Runs a 1s clock only while a cooldown is pending, then stops itself. */
function ensureTicker() {
  if (tickTimer) return
  tickTimer = setInterval(() => {
    set({ nowMs: Date.now() })
    const active = Object.values(state.cooldowns).some((t) => (t ?? 0) > Date.now())
    if (!active) {
      clearInterval(tickTimer)
      tickTimer = undefined
    }
  }, 1000)
}

/** Remaining cooldown seconds for a zone, 0 if tendable. */
export function cooldownLeft(s: FarmState, zoneId: ZoneId): number {
  const until = s.cooldowns[zoneId] ?? 0
  return Math.max(0, Math.ceil((until - s.nowMs) / 1000))
}

export const farmActions = {
  setScaleD: (scaleD: number) => set({ scaleD }),

  /** Step out of the farmhouse onto the farm (closes any open section window). */
  goOutside: () => set({ side: 'outside', win: null }),
  /** Head back into the farmhouse (drops any focused zone + open window). */
  goInside: () => set({ side: 'inside', win: null, focusZone: null }),

  /**
   * Water/feed a zone. Harvest at ≥50 (ungated), otherwise +1 gated by a random
   * per-zone cooldown the server enforces (guest identity keyed in Redis).
   */
  async tend(zoneId: ZoneId, zoneName: string) {
    const v = state.meters[zoneId]
    if (v >= 50) {
      const key = rollDrop(zoneId)
      const item: InventoryEntry = {
        key,
        zone: zoneName,
        num: HELPED_BASE + state.inventory.length + 1,
      }
      const meters = { ...state.meters, [zoneId]: 0 }
      const inventory = [...state.inventory, item]
      set({ meters, inventory, harvest: item, showHarvest: true })
      saveShared(meters, inventory)
      // Persist to the account's collection (optimistic; UI already updated).
      void addCard({ key: item.key, zone: item.zone, num: item.num })
      return
    }
    if (cooldownLeft(state, zoneId) > 0) {
      toast(`COOLDOWN · ${cooldownLeft(state, zoneId)}s LEFT`)
      return
    }

    const result = await tendRequest(zoneId)
    if (!result.ok) {
      set({ cooldowns: { ...state.cooldowns, [zoneId]: Date.now() + result.remainingMs } })
      ensureTicker()
      toast(`COOLDOWN · ${Math.ceil(result.remainingMs / 1000)}s LEFT`)
      return
    }

    const meters = { ...state.meters, [zoneId]: v + 1 }
    set({
      meters,
      cooldowns: { ...state.cooldowns, [zoneId]: Date.now() + result.cooldownMs },
      helped: state.helped + 1,
      tendTick: state.tendTick + 1,
      tendZone: zoneId,
      tendKind: WATER_ZONES.includes(zoneId) ? 'water' : 'feed',
    })
    ensureTicker()
    saveShared(meters, state.inventory)
    toast('+1 · THANKS, STRANGER!')
  },

  focusOn: (zoneId: ZoneId) => set({ focusZone: zoneId }),
  clearFocus: () => set({ focusZone: null }),
  setPet: (zoneId: ZoneId) => set({ activePet: zoneId, petTarget: null }),

  /** Choose the house critter roaming inside. Locked critters toast instead. */
  setCritter: (id: CritterId) => {
    if (!state.unlockedCritters.includes(id)) {
      toast('🔒 LOCKED · COMING SOON')
      return
    }
    set({ activeCritter: id, showCritters: false })
  },
  unlockCritter: (id: CritterId) => set({ unlockedCritters: [...new Set([...state.unlockedCritters, id])] }),
  openCritters: () => set({ showCritters: true }),
  closeCritters: () => set({ showCritters: false }),
  setPetTarget: (x: number, y: number) => set({ petTarget: { x, y } }),
  clearPetTarget: () => set({ petTarget: null }),

  toggleWin: (id: SectionId) => set({ win: state.win === id ? null : id }),
  openApp: (id: SectionId) => set({ win: id, mScreen: 'app' }),
  closeWin: () => set({ win: null }),
  lockedToast: () => toast('BLOG — COMING SOON!'),

  openFarm: () => set({ mScreen: 'farm' }),
  goHome: () => set({ mScreen: 'home', win: null, focusZone: null }),
  setFarmPage: (farmPage: number) => set({ farmPage }),
  prevPlace: () => set({ farmPage: (state.farmPage + 3) % 4 }),
  nextPlace: () => set({ farmPage: (state.farmPage + 1) % 4 }),

  keepItem: () => {
    set({ showHarvest: false })
    toast('ADDED TO YOUR POCKET!')
  },
  openShare: () => set({ showHarvest: false, showShare: true }),
  closeShare: () => set({ showShare: false }),

  openTrophy: () => set({ showTrophy: true }),
  closeTrophy: () => set({ showTrophy: false }),
  toggleDesk: () => set({ deskMin: !state.deskMin }),

  resetDemo: () => {
    const meters = { ...INITIAL_METERS }
    set({
      meters,
      inventory: [],
      cooldowns: {},
      helped: HELPED_BASE,
      win: null,
      focusZone: null,
      showHarvest: false,
      showShare: false,
    })
    saveShared(meters, [])
    void resetCards()
    toast('DEMO RESET')
  },

  /**
   * Establish identity and hydrate the collection from the server. Captures an
   * OAuth token if we just returned from GitHub, ensures a guest session
   * otherwise, then replaces the local card cache with the account's cards.
   * Safe to no-op offline — the cached inventory stays.
   */
  async bootstrap() {
    if (typeof window === 'undefined') return
    // Instant-paint cache: applied AFTER hydration so it never mismatches SSR.
    const saved = loadShared()
    if (saved.meters || saved.inventory) {
      set({
        meters: saved.meters ?? state.meters,
        inventory: filterValidInventory(saved.inventory ?? []),
      })
    }
    captureTokenFromUrl()
    try {
      // Shared card catalog first: replaces the bundled fallback so this client
      // renders the same set as every other, then re-filter cached inventory
      // against it. The set() re-renders consumers reading the live catalog.
      if (hydrateCatalog(await fetchCatalog())) {
        set({ inventory: filterValidInventory(state.inventory) })
      }
      const account = await ensureSession()
      if (account) set({ account })
      const data = await fetchCards()
      if (data) {
        const inventory = filterValidInventory(data.cards)
        set({ account: data.account, inventory })
        saveShared(state.meters, inventory)
      }
      const cd = await fetchCooldowns()
      const now = Date.now()
      const cooldowns: Partial<Record<ZoneId, number>> = {}
      for (const [zone, ms] of Object.entries(cd)) {
        if (ms > 0) cooldowns[zone as ZoneId] = now + ms
      }
      set({ cooldowns, nowMs: now })
      if (Object.keys(cooldowns).length) ensureTicker()
    } catch {
      /* offline / API down — keep cached inventory and stay anonymous */
    }
  },

  /** Redirect to GitHub to sync the collection across devices. */
  signIn: () => githubLogin(),

  /** Drop back to a fresh guest identity (cards stay attached to the account). */
  async signOut() {
    try {
      await logout()
    } catch {
      /* ignore */
    }
    const account = await ensureSession()
    const data = await fetchCards()
    const inventory = data ? filterValidInventory(data.cards) : []
    set({ account: account ?? null, inventory })
    saveShared(state.meters, inventory)
    toast('SIGNED OUT')
  },
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function useFarm<T>(selector: (s: FarmState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(state),
  )
}

/** Non-reactive read, for event handlers/canvas export. */
export const getFarmState = () => state
