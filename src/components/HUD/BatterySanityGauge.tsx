import React from 'react';
import { Flashlight, Heart, Battery } from 'lucide-react';

interface BatterySanityGaugeProps {
  batteryPercent: number;
  fearLevel: number;
  flashlightOn: boolean;
  onToggleFlashlight: () => void;
}

export const BatterySanityGauge: React.FC<BatterySanityGaugeProps> = ({
  batteryPercent,
  fearLevel,
  flashlightOn,
  onToggleFlashlight,
}) => {
  const bpm = Math.round(60 + fearLevel * 85);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(15, 17, 26, 0.85)',
      backdropFilter: 'blur(8px)',
      border: '1px solid #1e293b',
      borderRadius: '24px',
      padding: '6px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
    }}>
      {/* Heartbeat pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Heart
          size={18}
          color={fearLevel > 0.65 ? '#ef4444' : '#94a3b8'}
          style={{
            animation: `pulse ${60 / bpm}s infinite`,
            transform: 'scale(1)',
          }}
        />
        <div style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', color: '#f8fafc' }}>
          {bpm} <span style={{ fontSize: '0.65rem', color: '#64748b' }}>BPM</span>
        </div>
      </div>

      <div style={{ width: '1px', height: '22px', backgroundColor: '#334155' }} />

      {/* Battery */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Battery size={18} color={batteryPercent < 25 ? '#ef4444' : '#22c55e'} />
        <div style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace', color: '#f8fafc' }}>
          {batteryPercent}%
        </div>
      </div>

      <div style={{ width: '1px', height: '22px', backgroundColor: '#334155' }} />

      {/* Flashlight Button */}
      <button
        onClick={onToggleFlashlight}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: flashlightOn ? '#e2e8f0' : '#1e293b',
          color: flashlightOn ? '#0f172a' : '#94a3b8',
          border: 'none',
          borderRadius: '16px',
          padding: '4px 10px',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <Flashlight size={14} />
        {flashlightOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );
};
