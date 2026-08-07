import type { ZoneId } from './cards'

export type Move = 'walk' | 'hop' | 'flutter'

export type Pet = {
  rows: string[]
  palette: Record<string, string>
  pixel: number
  /** distance above the scene floor, as % of the scene height */
  bottom: number
  /** seconds of travel per 1% of horizontal distance (higher = slower) */
  speed: number
  move: Move
  /** flyers roam in 2D and never flip-idle on the ground */
  flies?: boolean
  /** emoji/glyph reactions on tap */
  emotes: { ch: string; color: string }[]
}

const CHICKEN = [
  '.......R.R.R....',
  '.K.....RRRRR....',
  '.KK..KKKKKKKK...',
  '.KWKKKWWWWWWWWK.',
  '.KWWWWWWWWWWEWKO',
  '.KWWWWWWWWWWWWKR',
  '.KWWWWWWWWWWWWK.',
  '..KwWWWWWWWWwK..',
  '..KwWWWWWWWWwK..',
  '...KKKKKKKKKK...',
  '.....K....K.....',
  '.....O....O.....',
  '.....O....O.....',
  '...OOO....OOO...',
]
const CHICKEN_PAL = { '.': 'transparent', K: '#2b2028', W: '#ffffff', w: '#d6d6e0', R: '#e42217', O: '#ffa300', E: '#000000' }

const COW = [
  '.............H..H...',
  '.............H..H...',
  '............KKKKKK..',
  '...KKKKKKKKKWBBWWWK.',
  '..KWWBBWWWWKWBBWEWK.',
  '.KWBBBBWWWWWWWWWWPPK',
  '.KWBBBWWWWWWWWWWWPPK',
  '.KWWWWWWWBBWWWWWWWK.',
  '.KWWWWWWWBBBWWWWWK..',
  '.KWWPPWWWWWWWWWWK...',
  '.KWKKWKKWWKKWWKK....',
  '..KK.KK..KK.KK......',
  '..KK.KK..KK.KK......',
  '..OO.OO..OO.OO......',
]
const COW_PAL = { '.': 'transparent', K: '#2b2028', W: '#ffffff', w: '#e2e2ea', B: '#3a3a44', E: '#000000', P: '#f4a9c0', H: '#f6e7c5', O: '#5a4632' }

const RABBIT = [
  '.........K.K..',
  '.........KPK..',
  '.........KPK..',
  '........KKKK..',
  '.....KKKWWWWK.',
  '...KKWWWWWWWK.',
  '..KWwWWWWWEWK.',
  '..KWWWWWWWWPK.',
  '..KWWWWWWWWWK.',
  '..KWWWWWWWWWK.',
  '..KKKWK.KKWK..',
  '..OKKK..OKK...',
]
const RABBIT_PAL = { '.': 'transparent', K: '#2b2028', W: '#efeff4', w: '#d3d3dc', P: '#f4a9c0', E: '#000000', O: '#f4a9c0' }

const BUTTERFLY = [
  '..K......K..',
  '...K....K...',
  '..YYK..KYY..',
  '.YYPYKKYPYY.',
  '.OYYYKKYYYO.',
  '.OOOYKKYOOO.',
  '..OOYKKYOO..',
  '...WKKKKW...',
  '.....KK.....',
]
const BUTTERFLY_PAL = { '.': 'transparent', K: '#2b2028', Y: '#f2c14e', O: '#e8912a', P: '#ff77a8', W: '#fff1e8' }

const HEART = { ch: '♥', color: '#e74c3c' }

/** Which critter tends each place, and how it behaves. */
export const PETS: Record<ZoneId, Pet> = {
  coop: { rows: CHICKEN, palette: CHICKEN_PAL, pixel: 3, bottom: 7, speed: 0.06, move: 'walk', emotes: [HEART, HEART, { ch: '♪', color: '#3e6fa8' }, { ch: '✦', color: '#f2c14e' }] },
  barn: { rows: COW, palette: COW_PAL, pixel: 3, bottom: 6, speed: 0.1, move: 'walk', emotes: [HEART, HEART, { ch: '♪', color: '#8b5a2b' }, { ch: '~', color: '#6e4523' }] },
  crop: { rows: RABBIT, palette: RABBIT_PAL, pixel: 3, bottom: 8, speed: 0.05, move: 'hop', emotes: [HEART, HEART, { ch: '✦', color: '#5a9e3d' }, { ch: '♪', color: '#3e7229' }] },
  orchard: { rows: BUTTERFLY, palette: BUTTERFLY_PAL, pixel: 3, bottom: 34, speed: 0.045, move: 'flutter', flies: true, emotes: [HEART, HEART, { ch: '✦', color: '#ff77a8' }, { ch: '♪', color: '#e8912a' }] },
}
