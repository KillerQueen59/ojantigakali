import type { Pet } from './pets'

export type CritterId = 'hamster' | 'parrot' | 'cat' | 'rabbit' | 'dog'

/** Palette for the critters themselves (side-view animals). */
export const CRITTER_PAL: Record<string, string> = {
  '.': 'transparent', K: '#2b2028',
  o: '#E0A24A', O: '#B87A2E', C: '#F6E7C5', P: '#F4A9C0', E: '#000000',
  g: '#4E9A3E', G: '#74B85A', r: '#C8483A', b: '#3E6FA8', y: '#F2C14E',
  c: '#E8912A', m: '#B5623A', w: '#F6E7C5',
  W: '#EFEFF4', H: '#D3D3DC', s: '#9AA0A8', p: '#F2A0B8',
  d: '#C89B4E', D: '#6E4523', t: '#C68B54',
}

/** Palette for the nests / habitats (separate keys from the animals). */
export const NEST_PAL: Record<string, string> = {
  '.': 'transparent', K: '#2b2028',
  e: '#BFE6F5', E: '#8FCBEE', W: '#EFEFF4',
  g: '#4E9A3E', G: '#74B85A',
  D: '#6E4523', n: '#8B5A2B', L: '#A9713C', l: '#C68B54',
  y: '#F2C14E', Y: '#F8D77E', u: '#B8802F', o: '#E0A24A',
  P: '#F4A9C0', p: '#E884A6',
  s: '#9AA0A8', S: '#C6CCD4', b: '#3E6FA8', B: '#6E9BD0',
  r: '#C8483A', R: '#A03D2B', c: '#E8912A', m: '#B5623A', f: '#8A3324',
}

// ── Animal sprites (side view, facing right) ──
const HAMSTER = ['....KK.......', '...KooK......', '..KoooooK....', '.KooooooooK..', '.KoPEoooooK..', 'KoCCoooooOK..', 'KoCooooooOK..', 'KooooooooOK..', '.KKoKKKoKK...', '..KK...KK....']
const PARROT = ['...KKK.....', '..KrrrK....', '.KrrEyyK...', '.KrrgggK...', 'KggbbggK...', 'KgbbbbgK...', 'KgbbbggK...', 'KgggggK....', '.KgggK.....', '..KyK......', '..KyK......']
const CAT = ['KKK..................', 'KWK.........KKK.KKK..', 'WWK.........KWK.KWK..', 'WWK........KKWpKpWKK.', 'WWKK.......KWWWWWWWK.', 'WWWK.......KWWEWEWWK.', 'WWWKKKKKKKKKWpWpWpWK.', 'KWWWWWWWWWWWWWKKKWWK.', 'KKWWWWWWWWWWWWWWWWWK.', '.KWWWWWWWWWWWWWWWWWK.', '.KWWWWWWWWWWWWKKKKKK.', '.KWWWWWWWWWWWWK......', '.KKWWKWWKWWKWWK......', '..KWWKWWKWWKWWK......', '..KKKKKKKKKKKKK......']
const RABBIT = ['...KK...KK...', '...Kp...pK...', '...Kp...pK...', '...KW...WK...', '.KWWWWWWWWWK.', 'KWWWWWWWWWWWK', 'KWWEWWWWWEWWK', 'KWWWWWWWWWWWK', 'KWWWWWWWWWWWK', 'KWWWWWWWWWWWK', 'KWWWWWWWWWWKW', '.KWWWWWWWWWWW', '.KWWWWWWWWWK.', '..KKWWWWWKK..']
const DOG = ['dd...........d.d...', 'dd..........dd.dd..', 'ddd.........dd.dd..', '.dd.........dddKdd.', '.ddd.......ddddddd.', '..ddddddddddddddddK', '..ddddddddddddddddK', '..dddddddddddddddr.', '..dddddddddddddddd.', '..dddddddddddd.dd..', '...dd.dd...dd..dd..', '...dd.dd...dd..dd..', '...dd.dd...dd..dd..', '...dd.dd...dd..dd..', '...dd.dd...dd..dd..']

// ── Nests / habitats (detailed, one per animal) ──
const HAMSTER_NEST = ['..........gggg..........', '...KKKKKKKKKKKKKKKKKK...', '...KGGGGGGGGGGGGGGGGK...', '...KggggggggggggggggK...', '...KKssKKKKKKKKKKKKKK...', '...eWSs.......yyyyy.e...', '...e.bb......yYYYYYye...', '...e.bb.....yyY.o.YYy...', '...e.bb.....yY..o..Yy...', '...e.ss.....yYoouooYy...', '...e.Ss.....yY..o..Yy...', '...e........yYY.o.YYy...', '...e.........yyYYYYye...', '...e..........ysssy.e...', '...ePPyPPyPPyPPsssPPe...', '...ePYPPYRyRRPYPPPPPe...', '...eppppprrrrpppppppe...', '...eeeeeeeeeeeeeeeeee...']
const PARROT_NEST = ['........yy........', '........Yy........', '..................', '...yyyyyyyyyyyy...', '...y..........y...', '...y..........y...', '...KyyyyyyyyyyK...', '...y.Y.Y.Y.Y.Yy...', '...y.Y.Y.Y.Y.Yy...', '...y.Y.Y.Y.uuuu...', '...y.Y.Y.Y.u.Yu...', '...y.Y.Y.Y.u.Yu...', '...y.Y.Y.Y.u.Yuu..', '...y.DDDDDDuDYu...', '...y.Y.YDD.u.Yu...', '...y.Y.YDD.uuuu...', '...y.Y.YDD.Y.Yy...', '...y.Y.YDD.Y.Yy...', '...y.Y.Y.Y.Y.Yy...', '..YYYYYYYYYYYYYY..', '..yuuuuuuuuuuuuy..', '..yyyyyyyyyyyyyy..']
const RABBIT_NEST = ['..DDDDDDDDDDDDDDDDDDDD..', '..DLllllllllllllllllDD..', '..DLyYyyYyyYyyYyyYyyDD..', '..DLyyyyyyyyyyyyyyyyDD..', '..DLyyYyyYyyYyyYyyYyDD..', '..DLyyyyyyyyyyyyyyyyDD..', '..DLyYyyYyyYyyYyyYyyDD..', '..DLuuuuuuuuuuuuuuuuDD..', '..DllllyyyyyyyyyyllllD..', '..DLLLDLyyyDyyyDLLDLLD..', '..DLLLDLLyyDyyyDLLDLLD..', '..DDDDDDDDDDDDDDDDDDDD..']
const CAT_NEST = ['...KKKKKKKKKKKKKKKK...', '..KKccccccccccccccKK..', '..mKmWeeeeeeeeeeWmKm..', '..mKmWWWWWmmWWWWWmKm..', '..mKmWWWWWmmWWWWWmKm..', '..mKmWWWWWWWWWWWWmKm..', '...KKKKKKKKKKKKKKKK...']
const DOG_NEST = ['.........fRRf.........', '........fRRRRf........', '.......fRRRRRRf.......', '......fRRRRRRRRf......', '.....fRRRRRRRRRRf.....', '....fRRRRRRRRRRRRf....', '...fRRRRRRRRRRRRRRf...', '..fRRRRRRRRRRRRRRRRf..', '.ffffffffffffffffffff.', '..ffffffffffffffffff..', '....KKKKKKKKKKKKKK....', '....KnnnnllllnnnnK....', '....KnnnnKKKKnnnnK....', '....Knnn.KKKK.nnnK....', '....KnnnKKKKKKnnnK....', '....KnnnKKKKKKnnnK....', '....KnnnKKKKKKnnnK....', '....KnnnKKKKKKnnnK....', '....KnnnKKKKKKnnnK....', '....KKKKKKKKKKKKKK....']

const HEART = { ch: '♥', color: '#e74c3c' }
const pet = (rows: string[], move: Pet['move'], extra: Partial<Pet> = {}): Pet => ({
  rows, palette: CRITTER_PAL, pixel: 4, bottom: 8, speed: 0.05, move,
  emotes: [HEART, HEART, { ch: '♪', color: '#8b5a2b' }, { ch: '✦', color: '#f2c14e' }],
  ...extra,
})

export type Critter = { id: CritterId; label: string; pet: Pet; nest: string[] }

export const CRITTER_ORDER: CritterId[] = ['hamster', 'parrot', 'cat', 'rabbit', 'dog']

/**
 * Which critters a fresh visitor starts with. The rest are locked (coming soon).
 * Set NEXT_PUBLIC_FARM_UNLOCK_CRITTERS=true (build-time) to unlock all of them,
 * e.g. for local dev or a preview deploy.
 */
const UNLOCK_ALL =
  process.env.NEXT_PUBLIC_FARM_UNLOCK_CRITTERS === 'true' ||
  process.env.NEXT_PUBLIC_FARM_UNLOCK_CRITTERS === '1'
export const DEFAULT_UNLOCKED: CritterId[] = UNLOCK_ALL ? [...CRITTER_ORDER] : ['hamster']

// `pixel` scales each critter to a believable relative size (a dog dwarfs a hamster).
export const CRITTERS: Record<CritterId, Critter> = {
  hamster: { id: 'hamster', label: 'HAMMY THE HAMSTER', pet: pet(HAMSTER, 'walk', { speed: 0.04, pixel: 4 }), nest: HAMSTER_NEST },
  parrot: { id: 'parrot', label: 'POLLY THE PARROT', pet: pet(PARROT, 'flutter', { flies: true, speed: 0.045, pixel: 5 }), nest: PARROT_NEST },
  cat: { id: 'cat', label: 'THE CAT', pet: pet(CAT, 'walk', { speed: 0.08, pixel: 4 }), nest: CAT_NEST },
  rabbit: { id: 'rabbit', label: 'THE RABBIT', pet: pet(RABBIT, 'hop', { speed: 0.05, pixel: 5 }), nest: RABBIT_NEST },
  dog: { id: 'dog', label: 'THE DOG', pet: pet(DOG, 'walk', { speed: 0.09, pixel: 4 }), nest: DOG_NEST },
}
