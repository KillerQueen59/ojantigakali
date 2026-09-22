// Single-athlete Strava stats for the "On the run" panel.
// Auth model: you authorize once (scope: read,activity:read_all) and store a
// long-lived refresh token in env. This route trades it for an access token,
// then derives this-week / YTD / last-run. Cached ~30 min to respect Strava's
// rate limits (100 req / 15 min). Never hardcode the secrets.

export const revalidate = 1800

type Activity = {
  type: string
  sport_type?: string
  name: string
  distance: number
  moving_time: number
  start_date_local: string
}

/** Distance sports get "8.1 km"; everything else gets "48 min". */
function fmtDetail(a: Activity): string {
  if (a.distance > 200) return `${Math.round((a.distance / 1000) * 10) / 10} km`
  return `${Math.max(1, Math.round(a.moving_time / 60))} min`
}

/** "Weight Training" → "GYM", "Run" → "RUN", etc. */
function labelSport(a: Activity): string {
  const raw = (a.sport_type || a.type || '').toLowerCase()
  if (raw.includes('weight') || raw.includes('workout')) return 'GYM'
  if (raw.includes('run')) return 'RUN'
  if (raw.includes('ride') || raw.includes('cycl')) return 'RIDE'
  if (raw.includes('swim')) return 'SWIM'
  if (raw.includes('tennis')) return 'TENNIS'
  if (raw.includes('padel') || raw.includes('squash') || raw.includes('racquet')) return 'PADEL'
  return (a.sport_type || a.type || 'ACTIVITY').toUpperCase()
}

function relativeDay(iso: string): string {
  const then = new Date(iso).getTime()
  const days = Math.floor((Date.now() - then) / 86_400_000)
  if (days <= 0) return 'TODAY'
  if (days === 1) return 'YESTERDAY'
  if (days < 7) return `${days} DAYS AGO`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? 'LAST WEEK' : `${weeks} WEEKS AGO`
}

function startOfWeek(): number {
  const now = new Date()
  const day = (now.getDay() + 6) % 7 // Monday = 0
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day)
  return monday.getTime()
}

async function accessToken(): Promise<string> {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`token ${res.status}`)
  const json = (await res.json()) as { access_token?: string }
  if (!json.access_token) throw new Error('no access_token')
  return json.access_token
}

export async function GET() {
  if (!process.env.STRAVA_CLIENT_ID || !process.env.STRAVA_CLIENT_SECRET || !process.env.STRAVA_REFRESH_TOKEN) {
    return Response.json({ error: 'not_configured' }, { status: 501 })
  }

  try {
    const token = await accessToken()
    const auth = { Authorization: `Bearer ${token}` }

    const activities = (await (
      await fetch('https://www.strava.com/api/v3/athlete/activities?per_page=50', { headers: auth, cache: 'no-store' })
    ).json()) as Activity[]

    const all = Array.isArray(activities) ? activities : []
    const weekStart = startOfWeek()
    const week = all.filter((a) => new Date(a.start_date_local).getTime() >= weekStart)
    const weekSeconds = week.reduce((sum, a) => sum + (a.moving_time || 0), 0)
    const sports = new Set(week.map((a) => labelSport(a)))
    const last = all[0]

    return Response.json({
      connected: true,
      weekSessions: week.length,
      weekHours: Math.round((weekSeconds / 3600) * 10) / 10,
      weekSports: sports.size,
      last: last
        ? { name: last.name, sport: labelSport(last), detail: fmtDetail(last), when: relativeDay(last.start_date_local) }
        : null,
    })
  } catch {
    return Response.json({ error: 'upstream' }, { status: 502 })
  }
}
