import type { ReactNode } from 'react'
import type { SectionId } from '../state/farmStore'

const body = "var(--farm-font-body)"
const mono = "var(--farm-font-mono)"

function P({ children }: { children: ReactNode }) {
  return <p style={{ margin: '0 0 12px', fontFamily: body }}>{children}</p>
}
function H({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4, fontFamily: body }}>
      {children}
    </div>
  )
}
function M({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 12, color: '#8B5A2B', marginBottom: 10 }}>
      {children}
    </div>
  )
}
function Proj({ n, s, d }: { n: string; s: string; d: string }) {
  return (
    <div style={{ borderTop: '2px dashed #D9C49A', paddingTop: 14, marginTop: 14 }}>
      <H>{n}</H>
      <M>{s}</M>
      <P>{d}</P>
    </div>
  )
}

export type WindowContent = { title: string; body: ReactNode }

// Placeholders (earlier roles, education, contacts, GitHub username) are flagged in
// the copy — replace with real values when available.
export const WINDOW_CONTENT: Record<SectionId, WindowContent> = {
  about: {
    title: 'ABOUT',
    body: (
      <div>
        <H>Muhammad Fauzan Ramadhan</H>
        <M>SOFTWARE ENGINEER · FULL-STACK · BOGOR, ID</M>
        <P>
          I go by Ojan. For the last four years I&rsquo;ve built backend systems that move
          money &mdash; right now on the Disbursement Team at OY! Indonesia, where our
          services push high-volume fund transfers across multiple payment providers
          without losing a rupiah.
        </P>
        <P>Off the clock I ship my own projects and take freelance work as Mamen Studio.</P>
      </div>
    ),
  },
  experience: {
    title: 'EXPERIENCE',
    body: (
      <div>
        <H>OY! Indonesia &mdash; Software Engineer</H>
        <M>2022 &ndash; PRESENT · DISBURSEMENT TEAM</M>
        <P>
          High-volume fund transfer services across multiple payment providers. Java,
          Spring Boot, PostgreSQL, Redis, RabbitMQ, Elasticsearch.
        </P>
        <H>Earlier roles</H>
        <M>PLACEHOLDER &mdash; SEND DETAILS TO FILL IN</M>
        <P>Company, dates, and what was built go here.</P>
      </div>
    ),
  },
  projects: {
    title: 'PROJECTS',
    body: (
      <div>
        <H>Serat Kalam</H>
        <M>GO · SVELTEKIT · POSTGRES · VPS</M>
        <P>
          E-commerce for handwritten Quran manuscripts &mdash; single-quantity inventory,
          payments, and orders, self-hosted end to end.
        </P>
        <Proj
          n="GRIND"
          s="NEXT.JS · SUPABASE · PWA"
          d="Fitness tracker built around progressive overload — logs work offline, syncs when back."
        />
        <Proj
          n="Spurs Analytics"
          s="GO · NEXT.JS · DATA PIPELINE"
          d="Tottenham match-data pipeline with form charts, xG trends, and squad breakdowns."
        />
        <Proj
          n="Mamen Studio"
          s="FREELANCE"
          d="Client sites, dashboards, and integrations. Selected work on request."
        />
      </div>
    ),
  },
  education: {
    title: 'EDUCATION',
    body: (
      <div>
        <H>Degree &amp; certifications</H>
        <M>PLACEHOLDER &mdash; SEND DETAILS TO FILL IN</M>
        <P>Institution, degree, certifications, and competition wins go here.</P>
      </div>
    ),
  },
  contact: {
    title: 'CONTACT',
    body: (
      <div>
        <H>Say hello</H>
        <M>EMAIL · LINKEDIN · X &mdash; PLACEHOLDERS</M>
        <P>
          hello@ojantigakali.com &mdash; replace with real links. Freelance inquiries via
          Mamen Studio welcome.
        </P>
      </div>
    ),
  },
  github: {
    title: 'GITHUB',
    body: (
      <div>
        <H>@ojan &mdash; 24 public repos</H>
        <M>PLACEHOLDER USERNAME</M>
        <P>Pinned: serat-kalam, grind, spurs-analytics, dotfiles.</P>
      </div>
    ),
  },
  resume: {
    title: 'RESUME',
    body: (
      <div>
        <H>Resume</H>
        <M>PDF · 2 PAGES</M>
        <P>Inline preview + download button in the real build.</P>
      </div>
    ),
  },
}
