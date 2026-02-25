import { Settings, Palette, Wrench } from 'lucide-react'
import type { ReactNode } from 'react'

const SKILL_GROUPS: { category: string; icon: ReactNode; skills: { name: string; level: number }[] }[] = [
  {
    category: 'Backend',
    icon: <Settings size={14} />,
    skills: [
      { name: 'Java / Spring', level: 88 },
      { name: 'Go', level: 80 },
      { name: 'NestJS', level: 78 },
      { name: 'PostgreSQL / Redis', level: 85 },
      { name: 'REST API / GraphQL', level: 90 },
      { name: 'RabbitMQ / ElasticSearch', level: 72 },
    ],
  },
  {
    category: 'Frontend',
    icon: <Palette size={14} />,
    skills: [
      { name: 'ReactJS / Next.js', level: 85 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 85 },
      { name: 'Redux', level: 78 },
    ],
  },
  {
    category: 'Tools & Platforms',
    icon: <Wrench size={14} />,
    skills: [
      { name: 'Git / Docker', level: 88 },
      { name: 'Sentry / Kibana', level: 80 },
      { name: 'Stripe / Razorpay', level: 78 },
      { name: 'Supabase / GIS', level: 70 },
    ],
  },
]

export default function SkillsWindow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {SKILL_GROUPS.map((group) => (
        <div key={group.category}>
          <h2
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--window-text)',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ color: 'var(--icon-accent)' }}>{group.icon}</span>
            {group.category}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {group.skills.map((skill) => (
              <div key={skill.name}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 5,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: 'var(--window-text)', fontWeight: 500 }}>
                    {skill.name}
                  </span>
                  <span style={{ color: 'var(--window-text-muted)', fontSize: 12 }}>
                    {skill.level}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'var(--window-titlebar)',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${skill.level}%`,
                      background: 'var(--icon-accent)',
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
