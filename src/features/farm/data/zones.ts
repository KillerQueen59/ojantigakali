import type { SectionId } from '../state/farmStore'
import type { ArtRect, ZoneId } from './cards'

export type Section = {
  id: SectionId | null // null = locked (BLOG)
  label: string
  icon: string // <use href> target in the symbol sheet
}

/** The 8 hotbar / app-grid slots, in order. Slot 8 (BLOG) is locked. */
export const SECTIONS: Section[] = [
  { id: 'about', label: 'ABOUT', icon: '#p-portrait' },
  { id: 'experience', label: 'EXPERIENCE', icon: '#p-pickaxe' },
  { id: 'projects', label: 'PROJECTS', icon: '#p-chest' },
  { id: 'education', label: 'EDUCATION', icon: '#p-book' },
  { id: 'contact', label: 'CONTACT', icon: '#p-mailbox' },
  { id: 'github', label: 'GITHUB', icon: '#p-signpost' },
  { id: 'resume', label: 'RESUME', icon: '#p-scroll' },
  { id: null, label: 'BLOG', icon: '#p-lock' },
]

/** POI marker positions on the 1440×900 desktop scene: [top, left].
 *  Partial: some sections (e.g. `profile`) open from furniture, not a map marker. */
export const POI_POS: Partial<Record<SectionId, [number, number]>> = {
  about: [118, 130],
  contact: [186, 300],
  experience: [428, 344],
  projects: [706, 596],
  education: [552, 100],
  github: [664, 860],
  resume: [330, 1128],
}

/** Interactive region over a section's art on the 1440×900 desktop scene. */
export type ZoneHit = { top: number; left: number; w: number; h: number }

/** A permanent pixel-art fence enclosure on the grass. `openTop` drops the back
 *  rail so the fence never crosses a structure sitting behind it. */
export type ZoneFence = { top: number; left: number; w: number; h: number; openTop?: boolean }

export type Zone = {
  id: ZoneId
  name: string
  sub: string
  action: string
  chip: string
  /** Hover/click hit area drawn over the section's prop art. */
  hit: ZoneHit
  /** Permanent fence enclosure for this section. */
  fence: ZoneFence
  /** Scene-space point the camera centers on when this section is focused. */
  focus: [number, number]
  /** Camera scale applied while this section is focused. */
  zoom: number
}

/** Farm zones, in swipe order (mobile farmPage indexes this array). */
export const ZONES: Zone[] = [
  { id: 'crop', name: 'CROP FIELD', sub: 'PARSNIPS, BERRIES & MYSTERY SEEDS', action: '💧 POUR WATER', chip: '#3E6FA8', hit: { top: 356, left: 164, w: 320, h: 128 }, fence: { top: 366, left: 160, w: 320, h: 110, openTop: false }, focus: [326, 420], zoom: 1.7 },
  { id: 'barn', name: 'BARN · DAISY & PIP', sub: 'DAISY THE COW & PIP THE PIG', action: '🌾 FEED HAY', chip: '#B8802F', hit: { top: 458, left: 466, w: 314, h: 250 }, fence: { top: 700, left: 456, w: 340, h: 52, openTop: false }, focus: [624, 588], zoom: 1.5 },
  { id: 'coop', name: 'COOP · HENS', sub: 'THREE VERY BUSY HENS', action: '🌾 FEED GRAIN', chip: '#B8802F', hit: { top: 500, left: 1032, w: 224, h: 196 }, fence: { top: 628, left: 1058, w: 204, h: 54, openTop: false }, focus: [1148, 578], zoom: 1.7 },
  { id: 'orchard', name: 'ORCHARD', sub: 'APPLES & PEACHES', action: '💧 POUR WATER', chip: '#3E6FA8', hit: { top: 296, left: 758, w: 240, h: 200 }, fence: { top: 430, left: 786, w: 184, h: 56, openTop: false }, focus: [876, 344], zoom: 1.7 },
]

export const ZONE_ORDER = ['CROP FIELD', 'BARN', 'COOP', 'ORCHARD']

/** Per-place pixel-art rects drawn inside the 390×220 mobile farm scene. */
export const MOBILE_SCENES: Record<ZoneId, ArtRect[]> = {
  crop: [[64, 128, 8, 20, '#8B5A2B'], [196, 128, 8, 20, '#8B5A2B'], [322, 128, 8, 20, '#8B5A2B'], [60, 132, 270, 5, '#A9713C'], [60, 142, 270, 5, '#A9713C'], [70, 150, 250, 40, '#7A4A22'], [70, 162, 250, 5, '#5E3717'], [70, 176, 250, 5, '#5E3717'], [84, 152, 10, 12, '#4E8A38'], [130, 152, 10, 12, '#4E8A38'], [176, 148, 16, 14, '#E8912A'], [181, 144, 5, 5, '#3E7229'], [230, 152, 10, 12, '#4E8A38'], [276, 148, 16, 14, '#E8912A'], [281, 144, 5, 5, '#3E7229']],
  barn: [[100, 68, 190, 14, '#6E2318'], [126, 54, 138, 16, '#8A3324'], [110, 80, 170, 100, '#A03D2B'], [110, 164, 170, 16, '#7E2E20'], [112, 82, 8, 98, '#E9E2D0'], [270, 82, 8, 98, '#E9E2D0'], [168, 118, 56, 62, '#7A4A22'], [164, 114, 64, 6, '#E9E2D0'], [130, 96, 30, 26, '#F8D77E'], [300, 148, 36, 22, '#F6F1E6'], [306, 152, 10, 8, '#3B2A1A'], [330, 140, 14, 14, '#F6F1E6'], [304, 170, 5, 10, '#D9CFC0'], [326, 170, 5, 10, '#D9CFC0']],
  coop: [[112, 88, 166, 14, '#8A3324'], [120, 100, 150, 70, '#A9713C'], [120, 100, 150, 8, '#8B5A2B'], [168, 124, 30, 36, '#4A2F18'], [132, 122, 24, 18, '#F8D77E'], [176, 158, 20, 8, '#8B5A2B'], [184, 166, 20, 8, '#8B5A2B'], [128, 150, 10, 26, '#6E4523'], [252, 150, 10, 26, '#6E4523'], [86, 152, 24, 16, '#FFF'], [104, 146, 10, 10, '#FFF'], [106, 142, 7, 4, '#C0392B'], [114, 150, 5, 4, '#E8912A'], [288, 164, 12, 9, '#F2C14E'], [297, 160, 7, 7, '#F2C14E']],
  orchard: [[112, 122, 18, 58, '#6E4523'], [112, 122, 6, 58, '#5A3A17'], [70, 64, 100, 66, '#2F6B22'], [84, 48, 72, 42, '#3E7229'], [96, 36, 44, 26, '#4E8A38'], [92, 84, 10, 10, '#E74C3C'], [130, 98, 10, 10, '#E74C3C'], [110, 66, 10, 10, '#E74C3C'], [248, 118, 16, 62, '#6E4523'], [214, 62, 88, 64, '#2F6B22'], [228, 46, 60, 36, '#3E7229'], [234, 84, 10, 10, '#F4A9C0'], [272, 98, 10, 10, '#F4A9C0'], [252, 60, 10, 10, '#F4A9C0']],
}
