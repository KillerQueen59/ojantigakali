// OJAN FARM — SET 1. Ported verbatim from the design prototype.
// Item art is a rect list [x, y, w, h, color] on a 24×24 grid so the same data
// drives both DOM SVG and the 1080² canvas share-card export. Do not substitute
// raster images — the pixel aesthetic depends on integer-coordinate rects.

export type Rarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY'
export type ZoneId = 'crop' | 'barn' | 'coop' | 'orchard'

/** [x, y, w, h, color] on a 24×24 grid. */
export type ArtRect = [number, number, number, number, string]

export type CardItem = {
  name: string
  rarity: Rarity
  type: string
  flavor: string
  stats: [string, string][]
  art: ArtRect[]
}

export type RarityStyle = {
  band: string
  gem: string
  art: string
  text: string
  stars: number
}

export const RARITY_STYLE: Record<Rarity, RarityStyle> = {
  COMMON: { band: '#6E4523', gem: '#A9713C', art: '#DCCDA4', text: '#F6E7C5', stars: 1 },
  UNCOMMON: { band: '#3E7229', gem: '#74B854', art: '#CFE3B7', text: '#F6E7C5', stars: 2 },
  RARE: { band: '#3E6FA8', gem: '#7FB2E0', art: '#BFD8F0', text: '#F6E7C5', stars: 3 },
  LEGENDARY: { band: '#B8802F', gem: '#F2C14E', art: '#F6E2A6', text: '#3B2A1A', stars: 4 },
}

/** Insertion order defines the collector number (1-based index → `000/017`). */
export const CATALOG = {
  parsnip: { name: 'PARSNIP', rarity: 'COMMON', type: 'CROP', flavor: 'The first thing anyone learns to grow. Humble, reliable, faintly proud of itself.', stats: [['VALUE', '35g'], ['GROW TIME', '4 DAYS']], art: [[10, 2, 2, 4, '#4E8A38'], [13, 2, 2, 4, '#4E8A38'], [11, 4, 3, 3, '#3E7229'], [8, 7, 8, 6, '#F3E9C7'], [9, 13, 6, 5, '#EDD9AC'], [11, 18, 2, 4, '#E5D3A8'], [9, 8, 2, 4, '#FBF3D9']] },
  strawberry: { name: 'STRAWBERRY', rarity: 'COMMON', type: 'CROP', flavor: 'Sweet, seedy, and gone before it reaches the kitchen.', stats: [['VALUE', '120g'], ['SUGAR', '★★★☆']], art: [[10, 3, 4, 3, '#3E7229'], [7, 5, 10, 3, '#C0392B'], [6, 8, 12, 6, '#E74C3C'], [8, 14, 8, 4, '#C0392B'], [10, 18, 4, 2, '#A93226'], [9, 9, 2, 2, '#F6E7C5'], [13, 11, 2, 2, '#F6E7C5'], [7, 6, 2, 2, '#F1948A']] },
  sunflower: { name: 'SUNFLOWER', rarity: 'UNCOMMON', type: 'CROP', flavor: 'Grown for the seeds. Kept for the way it follows you around the field.', stats: [['VALUE', '180g'], ['HEIGHT', '2.1 M']], art: [[7, 4, 10, 2, '#F2C14E'], [9, 2, 6, 6, '#F2C14E'], [10, 4, 4, 3, '#8B5A2B'], [11, 8, 2, 10, '#4E8A38'], [8, 11, 3, 2, '#4E8A38'], [13, 13, 3, 2, '#4E8A38'], [9, 18, 6, 2, '#3E7229'], [10, 5, 2, 2, '#6E4523']] },
  pumpkin: { name: 'GOLDEN PUMPKIN', rarity: 'RARE', type: 'CROP', flavor: 'One in every few hundred comes up gold. Nobody has worked out why.', stats: [['VALUE', '740g'], ['WEIGHT', '18 KG']], art: [[10, 2, 4, 3, '#5A3A1A'], [6, 5, 12, 3, '#E8912A'], [4, 8, 16, 10, '#E8912A'], [6, 18, 12, 2, '#C96F1D'], [8, 8, 2, 10, '#C96F1D'], [14, 8, 2, 10, '#C96F1D'], [6, 9, 2, 6, '#F5B26B'], [14, 5, 4, 3, '#4E8A38'], [17, 3, 3, 3, '#3E7229']] },
  rainbowcorn: { name: 'RAINBOW CORN', rarity: 'LEGENDARY', type: 'CROP', flavor: 'Planted by accident, harvested in disbelief. The whole valley came to look.', stats: [['VALUE', '2,400g'], ['KERNELS', '512']], art: [[11, 1, 2, 4, '#4E8A38'], [8, 4, 8, 3, '#E74C3C'], [8, 7, 8, 3, '#E8912A'], [8, 10, 8, 3, '#F2C14E'], [8, 13, 8, 3, '#4E8A38'], [8, 16, 8, 3, '#3E6FA8'], [6, 5, 2, 13, '#3E7229'], [16, 5, 2, 13, '#3E7229'], [9, 5, 1, 13, '#FFFFFF55']] },
  milk: { name: 'DAISY’S MILK', rarity: 'COMMON', type: 'BARN', flavor: 'Still warm. Daisy watched you carry the whole pail back.', stats: [['VALUE', '125g'], ['YIELD', '4.2 L']], art: [[9, 3, 6, 2, '#9AA3AD'], [8, 5, 8, 3, '#E6EDF3'], [6, 8, 12, 12, '#FFF'], [6, 14, 12, 6, '#BFD7E8'], [10, 10, 4, 2, '#3E6FA8'], [16, 9, 2, 10, '#D8E4EE']] },
  butter: { name: 'CHURNED BUTTER', rarity: 'UNCOMMON', type: 'BARN', flavor: 'Forty minutes of churning for one small gold brick. Worth it.', stats: [['VALUE', '310g'], ['CHURN', '40 MIN']], art: [[5, 7, 14, 4, '#F8D77E'], [5, 11, 14, 7, '#F2C14E'], [5, 18, 14, 2, '#D9A83A'], [7, 8, 10, 2, '#FBEBB8'], [8, 13, 3, 3, '#E8B93F']] },
  cheese: { name: 'GOLD CHEESE WHEEL', rarity: 'RARE', type: 'BARN', flavor: 'Aged in the cellar for a season. Pip guarded it the entire time.', stats: [['VALUE', '860g'], ['AGED', '1 SEASON']], art: [[4, 6, 16, 4, '#F8D77E'], [4, 10, 16, 8, '#F2C14E'], [4, 18, 16, 2, '#C99A2E'], [7, 12, 3, 3, '#D9A83A'], [13, 11, 3, 3, '#D9A83A'], [10, 15, 2, 2, '#D9A83A'], [6, 7, 12, 2, '#FBEBB8']] },
  moonmilk: { name: 'MOONLIT CREAM', rarity: 'LEGENDARY', type: 'BARN', flavor: 'Only ever appears after a full-moon milking. Tastes faintly of cold air.', stats: [['VALUE', '3,100g'], ['GLOW', 'FAINT']], art: [[9, 3, 6, 2, '#9AA3AD'], [8, 5, 8, 3, '#D9E6F5'], [6, 8, 12, 12, '#EAF2FB'], [6, 14, 12, 6, '#B9CFEA'], [9, 10, 6, 3, '#F6E7C5'], [16, 9, 2, 10, '#CBDDF2'], [3, 4, 2, 2, '#FFF'], [19, 12, 2, 2, '#FFF'], [4, 17, 2, 2, '#FFF']] },
  egg: { name: 'CHICKEN EGG', rarity: 'COMMON', type: 'COOP', flavor: 'A perfectly ordinary egg, laid by a hen with strong opinions.', stats: [['VALUE', '50g'], ['SIZE', 'MEDIUM']], art: [[9, 4, 6, 3, '#FFF'], [7, 7, 10, 3, '#FFF'], [6, 10, 12, 8, '#FFF'], [8, 18, 8, 2, '#E9E2D0'], [7, 7, 3, 11, '#E9E2D0'], [9, 8, 2, 5, '#FFFDF4']] },
  speckled: { name: 'SPECKLED EGG', rarity: 'UNCOMMON', type: 'COOP', flavor: 'The speckles are different on every one. The hens seem pleased about it.', stats: [['VALUE', '190g'], ['SPECKLES', '31']], art: [[9, 4, 6, 3, '#F6EFDF'], [7, 7, 10, 3, '#F6EFDF'], [6, 10, 12, 8, '#F6EFDF'], [8, 18, 8, 2, '#E0D6C0'], [7, 7, 3, 11, '#E9E2D0'], [9, 9, 2, 2, '#B08D5A'], [13, 12, 2, 2, '#B08D5A'], [10, 15, 2, 2, '#B08D5A'], [8, 12, 1, 1, '#B08D5A']] },
  goldegg: { name: 'GOLDEN EGG', rarity: 'RARE', type: 'COOP', flavor: 'The hen responsible has been insufferable ever since.', stats: [['VALUE', '1,050g'], ['SHINE', '★★★★']], art: [[9, 4, 6, 3, '#F8D77E'], [7, 7, 10, 3, '#F8D77E'], [6, 10, 12, 8, '#F2C14E'], [8, 18, 8, 2, '#C99A2E'], [7, 7, 3, 11, '#E0AE3C'], [9, 9, 2, 4, '#FBEBB8'], [14, 13, 2, 2, '#FFF6D8']] },
  midnightegg: { name: 'MIDNIGHT EGG', rarity: 'LEGENDARY', type: 'COOP', flavor: 'Found in the coop at dawn. No hen will admit to it.', stats: [['VALUE', '4,000g'], ['TEMP', 'COLD']], art: [[9, 4, 6, 3, '#3B3A5A'], [7, 7, 10, 3, '#3B3A5A'], [6, 10, 12, 8, '#2C2B45'], [8, 18, 8, 2, '#1E1D33'], [9, 9, 2, 2, '#B9A7F5'], [13, 13, 2, 2, '#8E7BE0'], [11, 16, 2, 2, '#B9A7F5'], [7, 12, 1, 1, '#8E7BE0']] },
  apple: { name: 'CRISP APPLE', rarity: 'COMMON', type: 'ORCHARD', flavor: 'Picked from the low branch, which is the honest way to do it.', stats: [['VALUE', '95g'], ['CRUNCH', '★★★☆']], art: [[11, 3, 2, 3, '#5A3A1A'], [13, 4, 3, 2, '#4E8A38'], [7, 6, 10, 3, '#C0392B'], [6, 9, 12, 7, '#E74C3C'], [8, 16, 8, 3, '#C0392B'], [8, 10, 2, 3, '#F1948A']] },
  peach: { name: 'SOFT PEACH', rarity: 'UNCOMMON', type: 'ORCHARD', flavor: 'Ripe for about six hours a year. You caught it.', stats: [['VALUE', '240g'], ['RIPENESS', 'PERFECT']], art: [[11, 3, 2, 3, '#5A3A1A'], [7, 6, 10, 3, '#F4A9C0'], [6, 9, 12, 7, '#F58EB0'], [8, 16, 8, 3, '#D97A9A'], [8, 10, 2, 3, '#FBC4D4']] },
  goldapple: { name: 'GOLDEN APPLE', rarity: 'RARE', type: 'ORCHARD', flavor: 'The oldest tree drops one a year. Traditionally, it goes to a visitor.', stats: [['VALUE', '980g'], ['SHINE', '★★★★']], art: [[11, 3, 2, 3, '#5A3A1A'], [13, 4, 3, 2, '#4E8A38'], [7, 6, 10, 3, '#B8802F'], [6, 9, 12, 7, '#F2C14E'], [8, 16, 8, 3, '#B8802F'], [8, 10, 2, 3, '#F8D77E']] },
  starfruit: { name: 'FALLEN STARFRUIT', rarity: 'LEGENDARY', type: 'ORCHARD', flavor: 'It was in the top branches by morning. Nobody saw it land.', stats: [['VALUE', '3,600g'], ['GLOW', 'BRIGHT']], art: [[10, 1, 4, 4, '#FFF6D8'], [7, 5, 10, 4, '#F2C14E'], [4, 9, 16, 5, '#F8D77E'], [7, 14, 10, 4, '#F2C14E'], [10, 18, 4, 4, '#E0AE3C'], [10, 8, 4, 4, '#FFF6D8'], [2, 10, 2, 2, '#FFF'], [20, 10, 2, 2, '#FFF']] },
} as const satisfies Record<string, CardItem>

export type CardKey = keyof typeof CATALOG

export const CATALOG_KEYS = Object.keys(CATALOG) as CardKey[]

export const DROP_TABLE: Record<ZoneId, CardKey[]> = {
  crop: ['parsnip', 'strawberry', 'sunflower', 'pumpkin', 'rainbowcorn'],
  barn: ['milk', 'butter', 'cheese', 'moonmilk'],
  coop: ['egg', 'speckled', 'goldegg', 'midnightegg'],
  orchard: ['apple', 'peach', 'goldapple', 'starfruit'],
}

const DROP_WEIGHT: Record<Rarity, number> = { COMMON: 55, UNCOMMON: 27, RARE: 14, LEGENDARY: 4 }

/**
 * Weighted random draw from a zone's pool. In production this MUST run
 * server-side inside the atomic harvest transaction — never trust a client roll.
 */
export function rollDrop(zoneId: ZoneId, rng: () => number = Math.random): CardKey {
  const pool = DROP_TABLE[zoneId]
  const total = pool.reduce((a, k) => a + DROP_WEIGHT[CATALOG[k].rarity], 0)
  let r = rng() * total
  for (const k of pool) {
    r -= DROP_WEIGHT[CATALOG[k].rarity]
    if (r <= 0) return k
  }
  return pool[0]
}

/** 1-based catalog index, formatted `000/017`. */
export function collectorNumber(key: CardKey): string {
  const idx = CATALOG_KEYS.indexOf(key) + 1
  return `${String(idx).padStart(3, '0')}/${String(CATALOG_KEYS.length).padStart(3, '0')}`
}

export function isValidCardKey(key: string): key is CardKey {
  return key in CATALOG
}

/** Drop persisted entries whose key is no longer in the catalog (stale-key guard). */
export function filterValidInventory<T extends { key: string }>(items: T[]): T[] {
  return items.filter((i) => i && isValidCardKey(i.key))
}
