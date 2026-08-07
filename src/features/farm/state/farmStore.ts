'use client'

import { useSyncExternalStore } from 'react'
import {
  rollDrop,
  filterValidInventory,
  type CardKey,
  type ZoneId,
} from '../data/cards'

export type InventoryEntry = { key: CardKey; zone: string; num: number }
export type Meters = Record<ZoneId, number>
export type SectionId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'education'
  | 'contact'
  | 'github'
  | 'resume'
export type MobileScreen = 'home' | 'farm' | 'app'

export type FarmState = {
  scaleD: number
  meters: Meters
  inventory: InventoryEntry[]
  tended: Partial<Record<ZoneId, boolean>>
  helped: number
  win: SectionId | null
  mScreen: MobileScreen
  farmPage: number
  harvest: InventoryEntry | null
  showHarvest: boolean
  showShare: boolean
  toastMsg: string
  toastOn: boolean
}

const STORAGE_KEY = 'ojan-farm-proto'
const HELPED_BASE = 137
const INITIAL_METERS: Meters = { crop: 34, barn: 42, coop: 49, orchard: 11 }

/**
 * Persistence seam. `meters` and `helped` are globally shared and server-owned in
 * production (atomic harvest, per-visitor rate-limit) — swap these two functions
 * for API calls + polling/websocket without touching the store or components.
 * `inventory` is per-visitor and may stay client-side.
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

function initialState(): FarmState {
  const saved = loadShared()
  return {
    scaleD: 0.7,
    meters: saved.meters ?? INITIAL_METERS,
    inventory: filterValidInventory(saved.inventory ?? []),
    tended: {},
    helped: HELPED_BASE,
    win: null,
    mScreen: 'home',
    farmPage: 1,
    harvest: null,
    showHarvest: false,
    showShare: false,
    toastMsg: '',
    toastOn: false,
  }
}

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

export const farmActions = {
  setScaleD: (scaleD: number) => set({ scaleD }),

  /** Water/feed a zone. Harvest at ≥50, otherwise +1 (once per session). */
  tend(zoneId: ZoneId, zoneName: string) {
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
      return
    }
    if (state.tended[zoneId]) {
      toast('ALREADY TENDED · COME BACK LATER!')
      return
    }
    const meters = { ...state.meters, [zoneId]: v + 1 }
    set({
      meters,
      tended: { ...state.tended, [zoneId]: true },
      helped: state.helped + 1,
    })
    saveShared(meters, state.inventory)
    toast('+1 · THANKS, STRANGER!')
  },

  toggleWin: (id: SectionId) => set({ win: state.win === id ? null : id }),
  openApp: (id: SectionId) => set({ win: id, mScreen: 'app' }),
  closeWin: () => set({ win: null }),
  lockedToast: () => toast('BLOG — COMING SOON!'),

  openFarm: () => set({ mScreen: 'farm' }),
  goHome: () => set({ mScreen: 'home', win: null }),
  setFarmPage: (farmPage: number) => set({ farmPage }),
  prevPlace: () => set({ farmPage: (state.farmPage + 3) % 4 }),
  nextPlace: () => set({ farmPage: (state.farmPage + 1) % 4 }),

  keepItem: () => {
    set({ showHarvest: false })
    toast('ADDED TO YOUR POCKET!')
  },
  openShare: () => set({ showHarvest: false, showShare: true }),
  closeShare: () => set({ showShare: false }),

  resetDemo: () => {
    const meters = { ...INITIAL_METERS }
    set({
      meters,
      inventory: [],
      tended: {},
      helped: HELPED_BASE,
      win: null,
      showHarvest: false,
      showShare: false,
    })
    saveShared(meters, [])
    toast('DEMO RESET')
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
