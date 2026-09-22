import type { CSSProperties } from 'react'
import type { SectionId } from '../../../state/farmStore'

export const TITLE = 'var(--farm-font-title)'
export const MONO = 'var(--farm-font-mono)'
export const BODY = 'var(--farm-font-body)'

export const SCENE_W = 1440
export const SCENE_H = 900

export const cardBox: CSSProperties = {
  background: '#6E4523',
  boxShadow: '6px 6px 0 rgba(0,0,0,.34), inset 2px 2px 0 #8B5A2B, inset -2px -2px 0 #4A2F18',
}

export type TipKey =
  | 'about'
  | 'projects'
  | 'experience'
  | 'education'
  | 'resume'
  | 'contact'
  | 'farm'
  | 'desk'
  | 'trophy'
  | 'critter'

export const TIPS: Record<TipKey, string> = {
  about: 'OFF THE CLOCK — running, kicks & the personal stuff',
  projects: 'NOTICE BOARD — things I built and shipped',
  experience: 'ON THE TV — four years of work history',
  education: 'BOOKSHELF — degree and certifications',
  resume: 'TOP DRAWER — read or download the resume',
  contact: 'THE DRAWER — email, GitHub, LinkedIn',
  farm: 'THE WINDOW — step outside and tend the farm',
  desk: 'THE SOFA — sit down and get to know me',
  trophy: 'TROPHY SHELF — the harvest cards you have collected',
  critter: 'YOUR CRITTER — pick who keeps you company',
}

export type Interactive = {
  className: string
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  style: CSSProperties
}

/** Builds the interactive furniture wrapper: fires an action, lifts on hover, sets the caption. */
export type HitFn = (key: TipKey, onClick: () => void, extra?: CSSProperties) => Interactive

/** Opens a section reader window by id. */
export type OpenWin = (id: SectionId) => () => void
