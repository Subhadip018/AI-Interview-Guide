import React, { useEffect, useRef } from 'react';

/**
 * BackgroundEffects
 * Renders a fixed, full-screen decorative layer behind all page content:
 *  - CSS-animated grid overlay  (.bg-grid)
 *  - Three slow-moving gradient blobs  (.bg-blob-1/2/3)
 *  - 20 floating glowing particles generated at mount
 */
const BackgroundEffects = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Remove any previously-created particles on remount (StrictMode safety)
    container.querySelectorAll('.bg-particle').forEach(p => p.remove());

    const colors = [
      'var(--primary)',
      'var(--secondary)',
      'var(--accent)',
      '#818cf8',
      '#a78bfa',
    ];

    const PARTICLE_COUNT = 20;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const particle = document.createElement('div');
      particle.className = 'bg-particle';

      const size = Math.random() * 4 + 2;           // 2 – 6 px
      const x = Math.random() * 100;                 // 0 – 100 vw
      const duration = Math.random() * 12 + 8;       // 8 – 20 s
      const delay = Math.random() * -20;             // negative = already in-flight
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.4 + 0.15;   // 0.15 – 0.55

      Object.assign(particle.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        left: `${x}%`,
        bottom: '-10px',
        opacity: String(opacity),
        animation: `particleFloat ${duration}s ${delay}s linear infinite`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });

      container.appendChild(particle);
    }

    return () => {
      container.querySelectorAll('.bg-particle').forEach(p => p.remove());
    };
  }, []);

  return (
    <>
      {/* Keyframe injection – only once, in head */}
      <style>{`
        @keyframes particleFloat {
          0%   { transform: translateY(0)   scale(1);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-105vh) scale(0.6); opacity: 0; }
        }
        @keyframes blobDrift1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(60px, -40px) scale(1.08); }
          66%       { transform: translate(-30px, 50px) scale(0.95); }
        }
        @keyframes blobDrift2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(-70px, 60px) scale(1.05); }
          66%       { transform: translate(40px, -30px) scale(0.97); }
        }
        @keyframes blobDrift3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%       { transform: translate(50px, 40px) scale(1.1); }
        }
      `}</style>

      {/* Fixed wrapper – sits behind everything via z-index: -1 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Grid overlay */}
        <div className="bg-grid" />

        {/* Gradient blobs */}
        <div className="bg-blobs">
          <div
            className="bg-blob-1"
            style={{ animation: 'blobDrift1 18s ease-in-out infinite' }}
          />
          <div
            className="bg-blob-2"
            style={{ animation: 'blobDrift2 22s ease-in-out infinite' }}
          />
          <div
            className="bg-blob-3"
            style={{ animation: 'blobDrift3 26s ease-in-out infinite' }}
          />
        </div>

        {/* Particle container – particles are imperatively appended here */}
        <div
          ref={containerRef}
          style={{
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
          }}
        />
      </div>
    </>
  );
};

export default BackgroundEffects;
