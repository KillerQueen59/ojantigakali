import type { ArcadeHit } from './constants';

export default function ArcadeHitEffect({ h }: { h: ArcadeHit }) {
  return (
    <div
      className="absolute pointer-events-none z-[99]"
      style={{ left: h.x, top: h.y }}
    >
      {/* Glow blob */}
      <div
        className="absolute w-[280px] h-[280px] rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(200,140,255,0.95) 0%, rgba(0,200,255,0.5) 40%, transparent 70%)',
          animation: 'brickHit 0.7s ease-out forwards',
        }}
      />

      {/* Score popup */}
      <div
        className="absolute text-[13px] text-[#ffe600] whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-press-start), monospace',
          textShadow: '0 0 6px #ff8800, 0 0 14px #ff4400',
          animation: 'scoreFloat 0.9s ease-out forwards',
        }}
      >
        +{h.pts}
      </div>

      {/* Sparks */}
      {h.sparks.map((s, i) => (
        <div
          key={i}
          className="absolute w-[5px] h-[5px] -left-0.5 -top-0.5"
          style={{
            backgroundColor: s.color,
            boxShadow: `0 0 6px ${s.color}`,
            animation: `sparkFly 0.6s ease-out ${i * 15}ms forwards`,
            '--tx': `${Math.round(s.tx)}px`,
            '--ty': `${Math.round(s.ty)}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
