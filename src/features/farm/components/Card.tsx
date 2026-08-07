import {
  RARITY_STYLE,
  collectorNumber,
  type CardItem,
  type CardKey,
} from '../data/cards'
import CardArt from './CardArt'

const title = 'var(--farm-font-title)'
const mono = 'var(--farm-font-mono)'
const body = 'var(--farm-font-body)'

/**
 * The collectible harvest card — shared markup for the harvest and share modals,
 * and the visual reference for the 1080² canvas export.
 */
export default function Card({
  itemKey,
  item,
  num,
  artSize = 104,
}: {
  itemKey: CardKey
  item: CardItem
  num: number
  artSize?: number
}) {
  const rs = RARITY_STYLE[item.rarity]
  const stars = '★'.repeat(rs.stars) + '☆'.repeat(4 - rs.stars)

  return (
    <div style={{ background: '#F6E7C5', boxShadow: 'inset 0 0 0 2px #D9C49A' }}>
      <div style={{ background: rs.band, padding: 4, boxShadow: '2px 2px 0 rgba(0,0,0,.25)' }}>
        {/* title row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '5px 8px 7px' }}>
          <span style={{ fontFamily: title, fontSize: 20, color: rs.text, lineHeight: 1 }}>
            {item.name}
          </span>
          <span style={{ background: rs.gem, padding: '3px 7px', fontFamily: mono, fontSize: 9, fontWeight: 600, color: '#3B2A1A', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>
            {item.rarity}
          </span>
        </div>

        {/* art window */}
        <div style={{ position: 'relative', background: rs.art, padding: '8px 0', display: 'grid', placeItems: 'center', boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.12)' }}>
          <span style={{ position: 'absolute', top: 6, left: 8, fontFamily: mono, fontSize: 11, color: rs.band, letterSpacing: '.1em' }}>
            {stars}
          </span>
          <CardArt art={item.art} size={artSize} />
        </div>

        {/* info panel */}
        <div style={{ background: '#F6E7C5', padding: '9px 10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontFamily: mono, fontSize: 9, color: '#8B5A2B', letterSpacing: '.1em' }}>
            {item.type} · HARVEST #{String(num).padStart(4, '0')}
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[0, 1].map((i) => (
              <div key={i} style={{ flex: 1, background: '#EDD9AC', padding: '5px 7px' }}>
                <div style={{ fontFamily: mono, fontSize: 8, color: '#8B5A2B', letterSpacing: '.05em' }}>
                  {item.stats[i][0]}
                </div>
                <div style={{ fontFamily: title, fontSize: 15, color: '#3B2A1A', lineHeight: 1.1 }}>
                  {item.stats[i][1]}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: body, fontStyle: 'italic', fontSize: 12, lineHeight: 1.45, color: '#5A4632' }}>
            {item.flavor}
          </div>
          <div style={{ borderTop: '2px dashed #D9C49A', paddingTop: 6, textAlign: 'right', fontFamily: mono, fontSize: 8, color: '#A9713C' }}>
            OJAN FARM · SET 1 · {collectorNumber(itemKey)}
          </div>
        </div>
      </div>
    </div>
  )
}
