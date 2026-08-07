'use client'

import { useEffect } from 'react'
import IconSymbols from './components/art/IconSymbols'
import DesktopValley from './components/desktop/DesktopValley'
import { HarvestModal, ShareModal, Toast } from './components/Modals'
import { farmActions } from './state/farmStore'

/**
 * Desktop farm valley experience (this repo). Phones are routed to the dedicated
 * mobile app (ojantigakali-mobile). The scene is a fixed 1440×900 canvas scaled to
 * fit both axes so the page never scrolls.
 */
export default function FarmExperience() {
  useEffect(() => {
    // Contain-fit the fixed 1440×900 canvas to the limiting axis (fills that axis
    // edge-to-edge at any browser zoom). The other axis's leftover is filled by the
    // sky→grass gradient behind the scene, so there's no empty gap.
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
    <div style={{ background: '#2A2118', minHeight: '100vh' }}>
      <IconSymbols />
      <DesktopValley />
      <HarvestModal />
      <ShareModal />
      <Toast />
    </div>
  )
}
