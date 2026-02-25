import type { EducationData } from '@/types/portfolio'

export default function EducationWindow({ data }: { data: EducationData | null | undefined }) {
  const education    = data?.education    ?? []
  const achievements = data?.achievements ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Education */}
      <div>
        <SectionTitle>🎓 Education</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {education.map((edu, i) => (
            <div key={i} style={{ background: 'var(--window-titlebar)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--window-titlebar-border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--window-text)', letterSpacing: '-0.02em' }}>
                {edu.degree}
              </h3>
              <div style={{ fontSize: 12, color: 'var(--window-text-muted)', marginTop: 3, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 600, color: 'var(--icon-accent)' }}>{edu.school}</span>
                <span>· {edu.period}</span>
                <span>· {edu.location}</span>
                {edu.gpa && <span>· GPA {edu.gpa}</span>}
              </div>
              <ul style={{ marginTop: 8 }}>
                {edu.highlights.map((h, j) => (
                  <li key={j} style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.7, paddingLeft: 14, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 2, top: '0.55em', width: 4, height: 4, borderRadius: '50%', background: 'var(--window-text-muted)' }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <SectionTitle>🏆 Achievements</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {achievements.map((ach, i) => (
              <div key={i} style={{ background: 'var(--window-titlebar)', borderRadius: 10, border: '1px solid var(--window-titlebar-border)', overflow: 'hidden' }}>
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 14px', borderBottom: ach.desc ? '1px solid var(--window-titlebar-border)' : 'none' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)' }}>{ach.name}</p>
                    <p style={{ fontSize: 11, color: 'var(--icon-accent)', fontWeight: 600, marginTop: 3 }}>{ach.org}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--icon-accent)', letterSpacing: '0.02em', flexShrink: 0, marginLeft: 12 }}>
                    {ach.year}
                  </span>
                </div>

                {/* Expanded detail */}
                {ach.desc && (
                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.7 }}>{ach.desc}</p>

                    {ach.stack && ach.stack.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {ach.stack.map((tech) => (
                          <span key={tech} style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: 'var(--icon-accent)', color: '#fff' }}>{tech}</span>
                        ))}
                      </div>
                    )}

                    {ach.highlights && ach.highlights.length > 0 && (
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {ach.highlights.map((h, j) => (
                          <li key={j} style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.65, paddingLeft: 14, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 2, top: '0.55em', width: 4, height: 4, borderRadius: '50%', background: 'var(--icon-accent)' }} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--window-text)', marginBottom: 12 }}>
      {children}
    </h2>
  )
}
