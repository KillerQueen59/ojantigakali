'use client'

import { useEffect } from 'react'
import IconSymbols from './components/art/IconSymbols'
import ContentWindow from './components/ContentWindow'
import DesktopValley from './components/desktop/DesktopValley'
import FarmhouseInterior from './components/inside/FarmhouseInterior'
import { CrittersModal, HarvestModal, ShareModal, Toast, TrophyModal } from './components/Modals'
import { farmActions, useFarm } from './state/farmStore'

/**
 * Desktop portfolio experience (this repo). Two halves of one world, both fixed
 * 1440×900 canvases scaled to fit the limiting axis: the farmhouse INSIDE (landing
 * + main menu) and the farm OUTSIDE (tend the plots). Phones route to the dedicated
 * mobile app. Section readers + harvest modals are shared across both halves.
 */
export default function FarmExperience() {
  const side = useFarm((s) => s.side)

  useEffect(() => {
    void farmActions.bootstrap()
  }, [])

  useEffect(() => {
    const onResize = () =>
      farmActions.setScaleD(Math.min(window.innerWidth / 1440, window.innerHeight / 900))
    onResize()
    window.addEventListener('resize', onResize)
    const clock = setInterval(() => onResize(), 30000)
    return () => {
      window.removeEventListener('resize', onResize)
      clearInterval(clock)
    }
  }, [])

  return (
    <div style={{ background: '#241A12', minHeight: '100vh' }}>
      <IconSymbols />
      {side === 'inside' ? <FarmhouseInterior /> : <DesktopValley />}
      <ContentWindow />
      <HarvestModal />
      <ShareModal />
      <TrophyModal />
      <CrittersModal />
      <Toast />
    </div>
  )
}
