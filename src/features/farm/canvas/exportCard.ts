import {
  RARITY_STYLE,
  CATALOG_KEYS,
  type CardItem,
  type CardKey,
} from '../data/cards'

/**
 * Render the collectible card to a 1080×1080 PNG and trigger a download.
 * imageSmoothingEnabled is off so the pixel art scales as crisp blocks. Fonts are
 * awaited before drawing so the first export isn't measured against a fallback face.
 */
export async function exportCard(itemKey: CardKey, item: CardItem, num: number) {
  const rs = RARITY_STYLE[item.rarity]
  const idx = CATALOG_KEYS.indexOf(itemKey)

  try {
    await document.fonts.load('700 60px "Pixelify Sans"')
    await document.fonts.load('600 26px "IBM Plex Mono"')
    await document.fonts.load('italic 26px "Nunito"')
  } catch {
    /* fall through with fallback fonts */
  }

  const c = document.createElement('canvas')
  c.width = 1080
  c.height = 1080
  const x = c.getContext('2d')
  if (!x) return
  x.imageSmoothingEnabled = false
  const R = (fill: string, a: number, b: number, w: number, h: number) => {
    x.fillStyle = fill
    x.fillRect(a, b, w, h)
  }

  R('#8B5A2B', 0, 0, 1080, 1080)
  R('#F6E7C5', 34, 34, 1012, 1012)

  x.textAlign = 'center'
  x.fillStyle = '#8B5A2B'
  x.font = '600 26px "IBM Plex Mono", monospace'
  x.fillText('I  H E L P E D   O J A N   H A R V E S T', 540, 108)

  const cx = 108
  const cy = 150
  const cw = 864
  const ch = 796
  R(rs.band, cx, cy, cw, ch)

  // title row
  x.textAlign = 'left'
  x.fillStyle = rs.text
  x.font = '700 62px "Pixelify Sans", cursive'
  x.fillText(item.name, cx + 28, cy + 76)
  const gw = 172
  const gh = 40
  R(rs.gem, cx + cw - gw - 24, cy + 30, gw, gh)
  x.fillStyle = '#3B2A1A'
  x.font = '600 20px "IBM Plex Mono", monospace'
  x.textAlign = 'center'
  x.fillText(item.rarity, cx + cw - gw / 2 - 24, cy + 57)

  // art window
  const aw = cw - 40
  const ay = cy + 104
  const ah = 330
  R(rs.art, cx + 20, ay, aw, ah)
  x.textAlign = 'left'
  x.fillStyle = rs.band
  x.font = '600 24px "IBM Plex Mono", monospace'
  x.fillText('★'.repeat(rs.stars) + '☆'.repeat(4 - rs.stars), cx + 36, ay + 36)
  const sc = 12
  const ox = 540 - 12 * sc
  const oy = ay + (ah - 24 * sc) / 2
  item.art.forEach((r) => {
    x.fillStyle = '#4A2F18'
    x.fillRect(ox + (r[0] - 1) * sc, oy + (r[1] - 1) * sc, (r[2] + 2) * sc, (r[3] + 2) * sc)
  })
  item.art.forEach((r) => {
    x.fillStyle = r[4]
    x.fillRect(ox + r[0] * sc, oy + r[1] * sc, r[2] * sc, r[3] * sc)
  })

  // info panel
  const iy = ay + ah + 16
  const ih = ch - (ay - cy) - ah - 36
  R('#F6E7C5', cx + 20, iy, aw, ih)
  x.fillStyle = '#8B5A2B'
  x.font = '600 22px "IBM Plex Mono", monospace'
  x.fillText(`${item.type}  ·  HARVEST #${String(num).padStart(4, '0')}`, cx + 44, iy + 42)
  const bw = (aw - 68) / 2
  ;[0, 1].forEach((i) => {
    const bx = cx + 44 + i * (bw + 20)
    R('#EDD9AC', bx, iy + 62, bw, 84)
    x.fillStyle = '#8B5A2B'
    x.font = '600 19px "IBM Plex Mono", monospace'
    x.fillText(item.stats[i][0], bx + 16, iy + 92)
    x.fillStyle = '#3B2A1A'
    x.font = '700 40px "Pixelify Sans", cursive'
    x.fillText(item.stats[i][1], bx + 16, iy + 134)
  })
  x.strokeStyle = '#D9C49A'
  x.lineWidth = 3
  x.setLineDash([10, 8])
  x.beginPath()
  x.moveTo(cx + 44, iy + 168)
  x.lineTo(cx + aw - 4, iy + 168)
  x.stroke()
  x.setLineDash([])

  x.fillStyle = '#5A4632'
  x.font = 'italic 26px "Nunito", sans-serif'
  const words = item.flavor.split(' ')
  let line = ''
  let ly = iy + 202
  words.forEach((w) => {
    const t = line ? `${line} ${w}` : w
    if (x.measureText(t).width > aw - 88) {
      x.fillText(line, cx + 44, ly)
      line = w
      ly += 34
    } else {
      line = t
    }
  })
  if (line) x.fillText(line, cx + 44, ly)

  x.textAlign = 'right'
  x.fillStyle = '#A9713C'
  x.font = '600 18px "IBM Plex Mono", monospace'
  x.fillText(
    `OJAN FARM · SET 1 · ${String(idx + 1).padStart(3, '0')}/${String(CATALOG_KEYS.length).padStart(3, '0')}`,
    cx + aw + 4,
    iy + ih - 18,
  )
  x.textAlign = 'center'
  x.fillStyle = '#4A2F18'
  x.font = '700 40px "Pixelify Sans", cursive'
  x.fillText('ojantigakali.com → help the farm', 540, 1012)

  const a = document.createElement('a')
  a.download = `ojan-farm-${itemKey}.png`
  a.href = c.toDataURL('image/png')
  a.click()
}
