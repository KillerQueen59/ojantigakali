import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMobile } from '@/hooks/useMobile';
import { useWindowManager } from '@/hooks/useWindowManager';
import { ArcadeHit, SCORE_CYCLE, SPARK_COLORS } from './constants';

export function useDesktop() {
  const [hits, setHits] = useState<ArcadeHit[]>([]);
  const [mobileOpen, setMobileOpen] = useState<string | null>(null);
  const [litCabinet, setLitCabinet] = useState<number | null>(null);
  const [hoveredCabinet, setHoveredCabinet] = useState<number | null>(null);
  const [hoveredTitle, setHoveredTitle] = useState(false);
  const [clickedTitle, setClickedTitle] = useState(false);

  const hitCounter = useRef(0);
  const scoreIdx = useRef(0);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const bottomIconRef = useRef<HTMLDivElement>(null);
  const mobileGridRef = useRef<HTMLDivElement>(null);

  const isMobile = useMobile();
  const isSmallMobile = useMobile(426);
  const windowManager = useWindowManager();

  // Entrance animation — desktop
  useEffect(() => {
    if (isMobile) return;
    const leftIcons = leftColRef.current ? Array.from(leftColRef.current.children) : [];
    const rightIcons = rightColRef.current ? Array.from(rightColRef.current.children) : [];
    const bottomIcon = bottomIconRef.current ? [bottomIconRef.current] : [];

    gsap.fromTo(leftIcons,  { x: -48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'power3.out', delay: 0.1 });
    gsap.fromTo(rightIcons, { x:  48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, stagger: 0.09, ease: 'power3.out', delay: 0.1 });
    gsap.fromTo(bottomIcon, { y:  32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.45 });
  }, [isMobile]);

  // Entrance animation — mobile grid
  useEffect(() => {
    if (!isMobile) return;
    const cells = mobileGridRef.current ? Array.from(mobileGridRef.current.children) : [];
    gsap.fromTo(cells, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: 'power3.out', delay: 0.1 });
  }, [isMobile]);

  const handleBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++hitCounter.current;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pts = SCORE_CYCLE[scoreIdx.current % SCORE_CYCLE.length];
    scoreIdx.current++;
    const sparks = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * 45 + Math.random() * 18 - 9) * (Math.PI / 180);
      const dist = 55 + Math.random() * 45;
      return {
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        color: SPARK_COLORS[i % SPARK_COLORS.length],
      };
    });
    setHits((prev) => [...prev, { id, x, y, pts, sparks }]);
    setTimeout(() => setHits((prev) => prev.filter((h) => h.id !== id)), 900);
  };

  return {
    state: { hits, mobileOpen, litCabinet, hoveredCabinet, hoveredTitle, clickedTitle },
    setters: { setMobileOpen, setLitCabinet, setHoveredCabinet, setHoveredTitle, setClickedTitle },
    refs: { leftColRef, rightColRef, bottomIconRef, mobileGridRef },
    handlers: { handleBgClick },
    isMobile,
    isSmallMobile,
    windowManager,
  };
}
