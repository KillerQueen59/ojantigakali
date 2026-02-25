'use client';

import { ReactNode, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: ReactNode;
  accentColor?: string;
  isActive: boolean;
  onClick: () => void;
}

export default function DesktopIcon({
  id,
  label,
  icon,
  accentColor,
  isActive,
  onClick,
}: DesktopIconProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const lit = isActive || isHovered;

  const bg = lit ? '#00ccff' : (accentColor ?? 'var(--icon-bg)');

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .to(boxRef.current, { y: -7, scale: 1.1, duration: 0.28 }, 0)
      .to(glowRef.current, { opacity: 1, scale: 1.15, duration: 0.3 }, 0)
      .to(labelRef.current, { y: -3, opacity: 1, duration: 0.22 }, 0);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    gsap
      .timeline({ defaults: { ease: 'elastic.out(1, 0.45)' } })
      .to(boxRef.current, { y: 0, scale: 1, duration: 0.55 }, 0)
      .to(
        glowRef.current,
        { opacity: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
        0
      )
      .to(
        labelRef.current,
        { y: 0, opacity: 0.85, duration: 0.35, ease: 'power2.out' },
        0
      );
  }, []);

  const handleClick = useCallback(() => {
    gsap
      .timeline()
      .to(boxRef.current, { scale: 0.84, duration: 0.1, ease: 'power2.in' })
      .to(boxRef.current, { scale: 1.14, duration: 0.14, ease: 'power2.out' })
      .to(boxRef.current, {
        scale: 1.06,
        y: -5,
        duration: 0.2,
        ease: 'power2.out',
      })
      .to(boxRef.current, {
        scale: 1,
        y: 0,
        duration: 0.45,
        ease: 'elastic.out(1, 0.4)',
      });
    onClick();
  }, [onClick]);

  const iconColor = lit
    ? 'var(--icon-text-active)'
    : accentColor
      ? '#ffffff'
      : 'var(--icon-text)';

  const glowColor =
    accentColor ?? (lit ? 'rgba(0,200,255,0.45)' : 'rgba(0,180,255,0.25)');

  return (
    <button
      data-icon-id={id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {/* Wrapper holds box + glow together so glow stays centred */}
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        {/* Glow halo */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: -6,
            borderRadius: 20,
            background: glowColor,
            filter: 'blur(10px)',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />

        {/* Icon box */}
        <div
          ref={boxRef}
          style={{
            width: 56,
            height: 56,
            background: bg,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            boxShadow: lit
              ? '0 0 0 1.5px rgba(0,210,255,0.85), 0 0 14px rgba(0,200,255,0.4), 0 6px 20px rgba(0,0,0,0.4)'
              : '0 0 0 1.5px rgba(0,180,255,0.35), 0 2px 10px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {icon}
        </div>
      </div>

      {/* Label */}
      <span
        ref={labelRef}
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: lit ? 'var(--icon-text-active)' : 'var(--icon-text)',
          opacity: 0.85,
          letterSpacing: '0.01em',
          textShadow: lit
            ? '0 0 8px rgba(0,200,255,0.6), 0 1px 3px rgba(0,0,0,0.3)'
            : '0 1px 3px rgba(0,0,0,0.25)',
          maxWidth: 70,
          textAlign: 'center',
          lineHeight: 1.3,
          pointerEvents: 'none',
        }}
      >
        {label}
      </span>
    </button>
  );
}
