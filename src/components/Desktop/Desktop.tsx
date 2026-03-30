'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  Building2,
  GraduationCap,
  Mail,
  Github,
  FileText,
  Search,
} from 'lucide-react';

import Menubar from '../Menubar/Menubar';
import DesktopIcon from '../DesktopIcon';
import WindowModal from '../WindowModal';
import ShowcaseFrame from '../ShowcaseFrame/ShowcaseFrame';
import AboutWindow from '../windows/AboutWindow';
import ProjectsWindow from '../windows/ProjectsWindow';
import ExperienceWindow from '../windows/ExperienceWindow';
import EducationWindow from '../windows/EducationWindow';
import ContactWindow from '../windows/ContactWindow';
import GitHubWindow from '../windows/GitHubWindow';
import ResumeWindow from '../windows/ResumeWindow';
import SearchWindow from '../windows/SearchWindow';
import type { PortfolioData } from '@/types/portfolio';
import { BRICK_BG, ICON_SIZE } from './constants';
import { useDesktop } from './useDesktop';
import ArcadeHitEffect from './ArcadeHitEffect';
import NeonAmbiance from './NeonAmbiance';
import ArcadeLogo from './ArcadeLogo';
import './Desktop.css';

function DesktopStats({ portfolioData }: { portfolioData: PortfolioData }) {
  const experienceStart = new Date('2021-11-01');
  const yearsExp = Math.floor(
    (Date.now() - experienceStart.getTime()) / (1000 * 60 * 60 * 24 * 365)
  );

  const totalProjects = portfolioData.projects.length;

  const totalTechs = new Set(portfolioData.projects.flatMap((p) => p.stack))
    .size;

  const stats = [
    { value: `${yearsExp}+`, label: 'Years Exp.' },
    { value: totalProjects, label: 'Projects' },
    { value: `${totalTechs}+`, label: 'Tech Stacks' },
  ];

  return (
    <div
      className="absolute top-3 left-1/2 -translate-x-1/2 z-[1] flex flex-row gap-3 select-none"
      style={{ pointerEvents: 'none' }}
    >
      {stats.map(({ value, label }, i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: i < stats.length - 1 ? 0 : undefined,
          }}
        >
          <div
            className="flex flex-col items-center justify-center"
            style={{
              background: 'rgba(6,4,18,0.55)',
              border: '1px solid rgba(0,210,255,0.18)',
              borderRadius: 10,
              padding: '8px 20px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 16px rgba(0,180,255,0.08)',
              minWidth: 80,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-press-start), monospace',
                fontSize: 'clamp(11px, 1.2vw, 16px)',
                color: '#00d2ff',
                textShadow: '0 0 10px rgba(0,210,255,0.7)',
                lineHeight: 1.3,
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: 9,
                color: 'rgba(176,234,255,0.6)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: 3,
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

type IconDef = {
  id: string;
  label: string;
  icon: React.ReactNode;
  accentColor?: string;
  content: React.ReactNode;
  title: string;
};

export default function Desktop({
  portfolioData,
}: {
  portfolioData: PortfolioData | null;
}) {
  const {
    state: { hits, litCabinet, hoveredCabinet, hoveredTitle, clickedTitle },
    setters: {
      setMobileOpen,
      setLitCabinet,
      setHoveredCabinet,
      setHoveredTitle,
      setClickedTitle,
    },
    refs: { leftColRef, rightColRef, bottomIconRef },
    handlers: { handleBgClick },
    isMobile,
    isSmallMobile,
    windowManager: {
      windows,
      openWindow,
      closeWindow,
      closeAll,
      bringToFront,
      updatePosition,
      isOpen,
    },
  } = useDesktop();

  const [closingAll, setClosingAll] = useState(false);
  const [frameState, setFrameState] = useState<
    'idle' | 'knocked' | 'resetting'
  >('idle');
  const [showShowcaseFrame, setShowShowcaseFrame] = useState(false);

  // Redirect to mobile site on small screens
  useEffect(() => {
    const MOBILE_URL = 'https://m.ojantigakali.com';
    const mq = window.matchMedia('(max-width: 455px)');
    if (mq.matches) {
      window.location.replace(MOBILE_URL);
      return;
    }
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) window.location.replace(MOBILE_URL);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleCloseAll = () => {
    if (windows.length === 0 || closingAll) return;
    setClosingAll(true);
    const duration = 380 + (windows.length - 1) * 55;
    setTimeout(() => {
      closeAll();
      setClosingAll(false);
    }, duration);
  };

  const p = portfolioData;

  const LEFT_ICONS: IconDef[] = [
    {
      id: 'about',
      label: 'About Me',
      icon: <User size={ICON_SIZE} />,
      content: <AboutWindow data={p?.about} />,
      title: 'About Me',
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: <Building2 size={ICON_SIZE} />,
      content: <ExperienceWindow data={p?.experiences} />,
      title: 'Experience',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Briefcase size={ICON_SIZE} />,
      content: <ProjectsWindow data={p?.projects} />,
      title: 'Projects & Skills',
    },
    {
      id: 'education',
      label: 'Education',
      icon: <GraduationCap size={ICON_SIZE} />,
      content: <EducationWindow data={p?.education} />,
      title: 'Education',
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: <Mail size={ICON_SIZE} />,
      content: <ContactWindow data={p?.contact} />,
      title: 'Contact',
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: <Github size={ICON_SIZE} />,
      content: <GitHubWindow data={p?.github} />,
      title: 'GitHub',
    },
    {
      id: 'resume',
      label: 'Resume',
      icon: <FileText size={ICON_SIZE} />,
      content: <ResumeWindow data={p?.resume} />,
      title: 'Resume / CV',
    },
  ];

  const RIGHT_ICONS: IconDef[] = [
    {
      id: 'search',
      label: 'Search',
      icon: <Search size={ICON_SIZE} />,
      content: (
        <SearchWindow data={p} onOpen={isMobile ? setMobileOpen : openWindow} />
      ),
      title: 'Spotlight',
    },
  ];

  const allIcons = [...LEFT_ICONS, ...RIGHT_ICONS];

  const openIcon = (id: string) => {
    const el = document.querySelector(`[data-icon-id="${id}"]`);
    const r = el?.getBoundingClientRect();
    openWindow(
      id,
      r ? { x: r.left, y: r.top, width: r.width, height: r.height } : undefined
    );
  };

  return (
    <div
      className="w-screen h-screen flex flex-col relative overflow-hidden bg-[#060412]"
      style={{ backgroundImage: BRICK_BG, backgroundSize: '120px 60px' }}
    >
      {/* Mobile redirect overlay — shown on screens < 456px */}
      <div
        className="mobile-block"
        style={{
          backgroundImage: BRICK_BG,
          backgroundSize: '120px 60px',
          backgroundColor: '#060412',
        }}
      >
        <img
          src="/led-mobile-not-provided-transparent.png"
          alt="Mobile version"
          style={{ width: 'min(90vw, 280px)', pointerEvents: 'none' }}
        />
        <a
          href="https://m.ojantigakali.com"
          style={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: 'clamp(8px, 2.5vw, 11px)',
            color: '#00d2ff',
            textDecoration: 'none',
            border: '2px solid #00d2ff',
            borderRadius: 8,
            padding: '12px 20px',
            letterSpacing: '0.08em',
            textShadow: '0 0 10px rgba(0,210,255,0.8)',
            boxShadow: '0 0 16px rgba(0,210,255,0.3)',
            animation: 'neonTitle 2s ease-in-out infinite',
          }}
        >
          PLAY MOBILE VERSION
        </a>
        <span
          style={{
            fontFamily: 'var(--font-press-start), monospace',
            fontSize: 9,
            color: 'rgba(176,234,255,0.35)',
            letterSpacing: '0.06em',
          }}
        >
          m.ojantigakali.com
        </span>
      </div>
      <div className="desktop-content contents">
        <Menubar openCount={windows.length} onCloseAll={handleCloseAll} />

        <div className="flex-1 relative">
          <div className="absolute inset-0 z-0" onClick={handleBgClick} />

          {hits.map((h) => (
            <ArcadeHitEffect key={h.id} h={h} />
          ))}

          <NeonAmbiance />

          <div
            ref={leftColRef}
            className="absolute top-3 left-4 flex flex-col gap-4 z-[1]"
          >
            {LEFT_ICONS.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={icon.icon}
                accentColor={icon.accentColor}
                isActive={isOpen(icon.id)}
                onClick={() => openIcon(icon.id)}
              />
            ))}
          </div>

          {/* Right icon column */}
          <div
            ref={rightColRef}
            className="absolute top-3 right-4 flex flex-col gap-4 items-center z-[1]"
          >
            {RIGHT_ICONS.map((icon) => (
              <DesktopIcon
                key={icon.id}
                id={icon.id}
                label={icon.label}
                icon={icon.icon}
                accentColor={icon.accentColor}
                isActive={isOpen(icon.id)}
                onClick={() => openIcon(icon.id)}
              />
            ))}
          </div>

          {/* Stats widget */}
          {p && <DesktopStats portfolioData={p} />}

          {/* Arcade group */}
          <div
            ref={bottomIconRef}
            className={`absolute bottom-0 right-4 z-[1] flex-col items-center ${isSmallMobile ? 'hidden' : 'flex'}`}
          >
            {/* Showcase photo frame — hangs on the wall above the arcade logo */}
            {showShowcaseFrame && (
              <ShowcaseFrame
                frameState={frameState}
                setFrameState={setFrameState}
              />
            )}

            <ArcadeLogo />

            {/* Neon title */}
            <div
              className="text-center select-none cursor-pointer mb-2"
              onClick={() => {
                setClickedTitle(true);
                setTimeout(() => setClickedTitle(false), 700);
              }}
              onMouseEnter={() => setHoveredTitle(true)}
              onMouseLeave={() => setHoveredTitle(false)}
            >
              <div
                className="text-[#b0eaff] leading-[1.8] tracking-[0.05em]"
                style={{
                  fontFamily: 'var(--font-press-start), monospace',
                  fontSize: 'clamp(9px, 1.2vw, 16px)',
                  animation: clickedTitle
                    ? 'neonTitleClick 0.7s ease-out forwards'
                    : hoveredTitle
                      ? 'neonTitleHover 1.2s ease-in-out infinite'
                      : 'neonTitle 3s ease-in-out infinite, neonTitleFlicker 8s step-end infinite 4s',
                }}
              >
                Ojantigakali&apos;s
              </div>
              <div
                className="text-[#c8f0ff] tracking-[0.1em]"
                style={{
                  fontFamily: 'var(--font-press-start), monospace',
                  fontSize: 'clamp(13px, 1.8vw, 24px)',
                  animation: clickedTitle
                    ? 'neonTitleClick 0.7s ease-out forwards'
                    : hoveredTitle
                      ? 'neonTitleHover 1.2s ease-in-out infinite 0.1s'
                      : 'neonTitle 3s ease-in-out infinite 0.5s, neonTitleFlicker 8s step-end infinite 4.2s',
                }}
              >
                ARCADE
              </div>
            </div>

            {/* Cabinet row */}
            <div className="flex items-end">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="relative cursor-pointer"
                  style={{
                    marginLeft: idx === 0 ? 0 : 'clamp(-100px, -7.5vw, -200px)',
                    zIndex: idx + 1,
                    transition: 'transform 0.2s ease',
                    transform:
                      hoveredCabinet === idx && litCabinet !== idx
                        ? 'scale(1.06) translateY(-8px)'
                        : 'scale(1) translateY(0)',
                  }}
                  onClick={() => {
                    setLitCabinet(idx);
                    setTimeout(() => setLitCabinet(null), 700);
                  }}
                  onMouseEnter={() => setHoveredCabinet(idx)}
                  onMouseLeave={() => setHoveredCabinet(null)}
                >
                  <img
                    src="/arcade.svg"
                    alt="Arcade"
                    className="block"
                    style={{
                      width: 'clamp(180px, 20vw, 280px)',
                      animation:
                        litCabinet === idx
                          ? 'arcadeHit 0.7s ease-out forwards'
                          : hoveredCabinet === idx
                            ? 'arcadeHover 1.4s ease-in-out infinite'
                            : undefined,
                      filter:
                        litCabinet === idx || hoveredCabinet === idx
                          ? undefined
                          : 'drop-shadow(0 0 6px rgba(0,200,255,0.2))',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Open windows */}
          {windows
            .filter((win) => win.id !== 'search')
            .map((win, idx) => {
              const def = allIcons.find((ic) => ic.id === win.id);
              if (!def) return null;
              return (
                <WindowModal
                  key={win.id}
                  id={win.id}
                  title={def.title}
                  icon={def.icon}
                  position={win.position}
                  zIndex={win.zIndex}
                  originRect={win.originRect}
                  forceClose={closingAll}
                  forceCloseDelay={idx * 55}
                  onClose={() => closeWindow(win.id)}
                  onFocus={() => bringToFront(win.id)}
                  onMove={(pos) => updatePosition(win.id, pos)}
                >
                  {def.content}
                </WindowModal>
              );
            })}

          {/* Spotlight search */}
          {(() => {
            const win = windows.find((w) => w.id === 'search');
            const def = allIcons.find((ic) => ic.id === 'search');
            if (!win || !def) return null;
            return (
              <>
                <div
                  className="fixed inset-0"
                  style={{ zIndex: win.zIndex - 1 }}
                  onClick={() => closeWindow('search')}
                />
                <div
                  className="fixed top-[14%] left-1/2 -translate-x-1/2 w-[540px] max-w-[calc(100vw-32px)] rounded-[14px] p-5 bg-[var(--window-bg)] border border-[var(--window-titlebar-border)] shadow-[0_24px_80px_rgba(0,0,0,0.22),0_2px_8px_rgba(0,0,0,0.1)]"
                  style={{
                    zIndex: win.zIndex,
                    animation:
                      'spotlightIn 0.18s cubic-bezier(0.34,1.56,0.64,1)',
                  }}
                >
                  {def.content}
                </div>
              </>
            );
          })()}

          {/* Mobile version toggle */}
          <a
            href="https://m.ojantigakali.com"
            className="mobile-toggle-btn"
            style={{
              position: 'fixed',
              bottom: 16,
              left: 16,
              zIndex: 9999,
              fontFamily: 'var(--font-press-start), monospace',
              fontSize: 8,
              color: '#00d2ff',
              background: 'rgba(6,4,18,0.9)',
              border: '1px solid rgba(0,210,255,0.4)',
              borderRadius: 6,
              padding: '10px 14px',
              textDecoration: 'none',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 0 12px rgba(0,210,255,0.2)',
              transition: 'box-shadow 0.2s, transform 0.2s, border-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,210,255,0.5)';
              e.currentTarget.style.borderColor = 'rgba(0,210,255,0.8)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 12px rgba(0,210,255,0.2)';
              e.currentTarget.style.borderColor = 'rgba(0,210,255,0.4)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: 12 }}>📱</span>
            MOBILE VERSION
          </a>
        </div>
      </div>
    </div>
  );
}
