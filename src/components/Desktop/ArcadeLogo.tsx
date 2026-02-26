'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';

export default function ArcadeLogo() {
  const logoRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleMouseEnter = () => {
    gsap.to(logoRef.current, {
      scale: 1.15,
      rotation: 8,
      duration: 0.3,
      ease: 'back.out(2)',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(logoRef.current, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  const handleClick = () => {
    const el = logoRef.current;
    gsap.killTweensOf(el);
    gsap
      .timeline()
      .to(el, { scale: 0.85, rotation: -15, duration: 0.08, ease: 'power2.in' })
      .to(el, { scale: 1.3, rotation: 20, duration: 0.15, ease: 'power3.out' })
      .to(el, {
        scale: 1.1,
        rotation: -10,
        duration: 0.12,
        ease: 'power2.inOut',
      })
      .to(el, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
      });
  };

  const logoSize = 'clamp(160px, 20vw, 260px)';

  return (
    <div
      style={{
        width: logoSize,
        aspectRatio: '1 / 1',
        position: 'relative',
        marginBottom: 4,
      }}
    >
      {!loaded && (
        <div
          className="img-skeleton"
          style={{ position: 'absolute', inset: 0, borderRadius: '50%' }}
        />
      )}
      <img
        ref={logoRef}
        src="/ojantigakali-animated-transparent.png"
        alt="Ojantigakali's Arcade"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          cursor: 'pointer',
          userSelect: 'none',
          transformOrigin: 'center center',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </div>
  );
}
