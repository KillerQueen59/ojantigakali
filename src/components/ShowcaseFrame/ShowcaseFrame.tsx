'use client';

type ShowcaseFrameProps = {
  frameState: 'idle' | 'knocked' | 'resetting';
  setFrameState: (state: 'idle' | 'knocked' | 'resetting') => void;
};

export default function ShowcaseFrame({
  frameState,
  setFrameState,
}: ShowcaseFrameProps) {
  return (
    <div
      className="select-none mb-3"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Nail */}
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #e8c97a, #8a6020)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.3)',
          marginBottom: 2,
          flexShrink: 0,
          zIndex: 1,
        }}
      />

      {/* Frame */}
      <a
        href="https://showcase.ojantigakali.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`showcase-frame-${frameState}`}
        style={{
          display: 'flex',
          textDecoration: 'none',
          transformOrigin: 'top center',
          cursor: 'pointer',
          // Outer golden trim
          border: '3px solid #c9a84c',
          outline: '1px solid rgba(80,50,10,0.6)',
          outlineOffset: 2,
          // Wood frame body
          padding: 7,
          background:
            'linear-gradient(145deg, #a87832 0%, #6b3d1e 35%, #7d4a22 65%, #4e2a0e 100%)',
          borderRadius: 4,
          // Hanging shadow depth
          boxShadow:
            '2px 3px 0 rgba(0,0,0,0.5), 4px 8px 18px rgba(0,0,0,0.65), 0 20px 40px rgba(0,0,0,0.35)',
        }}
        onMouseEnter={() => setFrameState('knocked')}
        onMouseLeave={() => setFrameState('resetting')}
        onAnimationEnd={() => {
          if (frameState === 'resetting') setFrameState('idle');
        }}
      >
        {/* Cream mat */}
        <div
          style={{
            padding: 7,
            background: '#f0ead8',
            borderRadius: 2,
            boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.25)',
          }}
        >
          {/* White photo */}
          <div
            style={{
              background: '#ffffff',
              width: 88,
              height: 88,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              borderRadius: 1,
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                backgroundColor: 'rgb(255,120,30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="4" height="4" rx="1" fill="white" />
                <rect
                  x="7"
                  y="1"
                  width="4"
                  height="4"
                  rx="1"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="1"
                  y="7"
                  width="4"
                  height="4"
                  rx="1"
                  fill="white"
                  opacity="0.6"
                />
                <rect
                  x="7"
                  y="7"
                  width="4"
                  height="4"
                  rx="1"
                  fill="white"
                  opacity="0.3"
                />
              </svg>
            </span>
            <span
              style={{
                fontFamily: 'var(--font-press-start), monospace',
                fontSize: 'clamp(6px, 0.75vw, 9px)',
                color: '#1a1a1a',
                letterSpacing: '0.04em',
              }}
            >
              Showcase
            </span>
          </div>
        </div>
      </a>
    </div>
  );
}
