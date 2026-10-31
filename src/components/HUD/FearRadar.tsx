import React, { useEffect, useRef } from 'react';

interface FearRadarProps {
  fearLevel: number; // 0.0 to 1.0
  entityDistance: number; // in meters (0 to 12)
  glitchIntensity: number;
  isLookedAt: boolean;
}

export const FearRadar: React.FC<FearRadarProps> = ({
  fearLevel,
  entityDistance,
  glitchIntensity,
  isLookedAt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      // Faster sweep speed when fear is high
      sweepAngle += 0.04 + fearLevel * 0.06;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 8;

      ctx.clearRect(0, 0, size, size);

      // Radar outer circle
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Middle concentric ring
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Crosshairs
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
      ctx.beginPath();
      ctx.moveTo(center, 8);
      ctx.lineTo(center, size - 8);
      ctx.moveTo(8, center);
      ctx.lineTo(size - 8, center);
      ctx.stroke();

      // Rotating Radar Sweep Cone
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.25)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, sweepAngle, sweepAngle + 0.4);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Player Center Blip
      ctx.beginPath();
      ctx.arc(center, center, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      // Entity Blip (Distance 12m maps to outer edge, 1m to center)
      if (entityDistance < 11.5) {
        const normalizedDist = Math.max(0.12, entityDistance / 11.0);
        const blipRadius = normalizedDist * radius;
        // Place blip slightly north of center
        const blipAngle = -Math.PI / 2 + Math.sin(sweepAngle * 0.5) * 0.35;
        const blipX = center + Math.cos(blipAngle) * blipRadius;
        const blipY = center + Math.sin(blipAngle) * blipRadius;

        // Blip glow
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isLookedAt ? '#ffffff' : '#ef4444';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [fearLevel, entityDistance, isLookedAt]);

  const fearPercent = Math.round(fearLevel * 100);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'rgba(15, 17, 26, 0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #1e293b',
      borderRadius: '24px',
      padding: '6px 14px 6px 8px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
    }}>
      <canvas
        ref={canvasRef}
        width={76}
        height={76}
        style={{ width: '76px', height: '76px' }}
      />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
          <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8' }}>
            RADAR TELEMETRY
          </span>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: fearPercent > 65 ? '#ef4444' : '#22c55e',
            display: 'inline-block'
          }} />
        </div>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          fontFamily: 'JetBrains Mono, monospace',
          color: fearPercent > 70 ? '#ef4444' : fearPercent > 35 ? '#f59e0b' : '#38bdf8'
        }}>
          DIST: {entityDistance < 12 ? `${entityDistance.toFixed(1)}m` : 'OUT OF RANGE'}
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          FEAR INDEX: <span style={{ color: '#cbd5e1' }}>{fearPercent}%</span>
        </div>
      </div>
    </div>
  );
};
