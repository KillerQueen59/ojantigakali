export default function NeonAmbiance() {
  return (
    <>
      {/* Static multi-layer ambient glow */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 55% 45% at 12% 20%, rgba(0,220,255,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 35% at 88% 75%, rgba(255,0,220,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 50% 40% at 65% 10%, rgba(130,0,255,0.04) 0%, transparent 70%)',
            'radial-gradient(ellipse 35% 30% at 25% 85%, rgba(0,255,160,0.03) 0%, transparent 70%)',
            'radial-gradient(ellipse 30% 25% at 75% 45%, rgba(255,80,0,0.03)  0%, transparent 70%)',
          ].join(','),
        }}
      />

      {/* Cyan spot */}
      <div
        className="absolute w-[340px] h-[260px] top-[8%] left-[6%] z-0 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,230,255,0.07) 0%, transparent 70%)',
          animation: 'neonCyan 4s ease-in-out infinite',
        }}
      />

      {/* Magenta spot */}
      <div
        className="absolute w-[300px] h-[220px] bottom-[10%] right-[8%] z-0 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,0,200,0.06) 0%, transparent 70%)',
          animation: 'neonMagenta 5s ease-in-out infinite 1.2s',
        }}
      />

      {/* Purple spot */}
      <div
        className="absolute w-[280px] h-[200px] top-[5%] right-[12%] z-0 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(150,0,255,0.05) 0%, transparent 70%)',
          animation: 'neonPurple 6s ease-in-out infinite 0.5s',
        }}
      />

      {/* Green spot */}
      <div
        className="absolute w-[240px] h-[180px] bottom-[15%] left-[10%] z-0 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,255,150,0.05) 0%, transparent 70%)',
          animation: 'neonGreen 7s ease-in-out infinite 2s',
        }}
      />
    </>
  );
}
