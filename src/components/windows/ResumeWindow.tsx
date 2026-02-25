import type { ResumeData } from '@/types/portfolio'

export default function ResumeWindow({ data }: { data: ResumeData | null | undefined }) {
  const name        = data?.name        ?? 'Muhammad Fauzan Ramadhan'
  const subtitle    = data?.subtitle    ?? ''
  const summary     = data?.summary     ?? ''
  const experiences = data?.experiences ?? []
  const skills      = data?.skills      ?? ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <p style={{ fontSize: 13, color: 'var(--window-text-muted)', lineHeight: 1.7 }}>
        Download my latest resume or view it inline below.
      </p>

      <a
        href="/files/10282025 CV_Muhammad Fauzan Ramadhan.pdf"
        download="CV_Muhammad Fauzan Ramadhan.pdf"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, background: 'var(--icon-accent)', color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none', alignSelf: 'flex-start', letterSpacing: '0.02em' }}
      >
        ⬇ &nbsp;Download PDF
      </a>

      {/* Preview card */}
      <div style={{ background: 'var(--window-titlebar)', borderRadius: 10, padding: '24px', border: '1px solid var(--window-titlebar-border)', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--window-text)', letterSpacing: '-0.03em' }}>{name}</h2>
          <p style={{ fontSize: 12, color: 'var(--window-text-muted)', marginTop: 2 }}>{subtitle}</p>
        </div>

        <Divider />

        <ResumeSection title="Summary">
          <p style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.7 }}>{summary}</p>
        </ResumeSection>

        <Divider />

        <ResumeSection title="Experience">
          {experiences.map((e) => (
            <div key={e.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--window-text)' }}>{e.role}</p>
                <p style={{ fontSize: 11, color: 'var(--window-text-muted)' }}>{e.company}</p>
              </div>
              <span style={{ fontSize: 11, color: 'var(--window-text-muted)', flexShrink: 0 }}>{e.period}</span>
            </div>
          ))}
        </ResumeSection>

        <Divider />

        <ResumeSection title="Skills">
          <p style={{ fontSize: 12, color: 'var(--window-text-muted)', lineHeight: 1.8 }}>{skills}</p>
        </ResumeSection>
      </div>
    </div>
  )
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--icon-accent)', marginBottom: 8 }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--window-titlebar-border)' }} />
}
