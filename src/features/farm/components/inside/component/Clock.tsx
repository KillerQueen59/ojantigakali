'use client'

import { useEffect, useState } from 'react'
import { MONO } from './shared'

/** Wall clock on Jakarta time (WIB, UTC+7, no DST). Hands tick every 20s. */
export default function WallClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    const tick = () => setNow(new Date())
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  // Until mounted, keep hands at 12:00 so SSR and first client paint match.
  let hourAngle = 0
  let minAngle = 0
  if (now) {
    const jak = new Date(now.getTime() + (now.getTimezoneOffset() + 420) * 60000)
    const h = jak.getHours() % 12
    const m = jak.getMinutes()
    hourAngle = h * 30 + m * 0.5
    minAngle = m * 6
  }
  return (
    <div style={{ position: 'absolute', left: 818, top: 96, width: 104, height: 104, background: '#E5D3A8', boxShadow: '0 0 0 9px #6E4523, 5px 5px 0 rgba(0,0,0,.3)' }}>
      {/* hour markers */}
      {[0, 3, 6, 9].map((mk) => (
        <div key={mk} style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, background: '#8B5A2B', transform: `translate(-50%,-50%) rotate(${mk * 30}deg) translateY(-40px)` }} />
      ))}
      {/* hour hand */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 30, background: '#3B2A1A', transformOrigin: '50% 100%', transform: `translate(-50%,-100%) rotate(${hourAngle}deg)`, transition: 'transform .5s ease' }} />
      {/* minute hand */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 42, background: '#8B5A2B', transformOrigin: '50% 100%', transform: `translate(-50%,-100%) rotate(${minAngle}deg)`, transition: 'transform .5s ease' }} />
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 9, height: 9, background: '#3B2A1A', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 9, textAlign: 'center', fontFamily: MONO, fontWeight: 500, fontSize: 10, color: '#8B5A2B' }}>WIB</div>
    </div>
  )
}
