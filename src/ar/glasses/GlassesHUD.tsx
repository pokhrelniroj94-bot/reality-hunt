import React, { useState, useEffect } from 'react';
import { glassesSimulator } from './GlassesSimulator';
import { VoiceCommand } from './IARGlassesAdapter';
import { Mic, MicOff, X, Eye } from 'lucide-react';

interface GlassesHUDProps {
  currentObjective: string;
  fearLevel: number;
  entityDistance: number;
  onVoiceCommand: (cmd: VoiceCommand) => void;
  onExitGlasses: () => void;
}

export const GlassesHUD: React.FC<GlassesHUDProps> = ({
  currentObjective,
  fearLevel,
  entityDistance,
  onVoiceCommand,
  onExitGlasses,
}) => {
  const [lastVoicePhrase, setLastVoicePhrase] = useState<string>('Listening for voice directives...');
  const [isListening, setIsListening] = useState<boolean>(true);

  useEffect(() => {
    glassesSimulator.connect();
    glassesSimulator.startVoiceListening((cmd) => {
      setLastVoicePhrase(`"${cmd.phrase}" -> ${cmd.action}`);
      onVoiceCommand(cmd);
    });

    return () => {
      glassesSimulator.disconnect();
    };
  }, []);

  const fearPercent = Math.round(fearLevel * 100);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      border: '2px dashed rgba(255,255,255,0.15)', // Optical FOV boundary box
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      fontFamily: 'JetBrains Mono, monospace',
      color: '#ffffff',
      zIndex: 60
    }}>
      {/* Top Peripheral Zone */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Left: Glanceable Objective */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: '4px',
          borderLeft: '3px solid #22c55e',
          maxWidth: '320px'
        }}>
          <div style={{ fontSize: '0.65rem', opacity: 0.7, textTransform: 'uppercase' }}>
            SPECTRALENS HUD v1.2
          </div>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            {currentObjective}
          </div>
        </div>

        {/* Right: Telemetry Bar */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: '4px',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>
            RANGE: {entityDistance < 12 ? `${entityDistance.toFixed(1)}m` : 'SEARCHING'}
          </div>
          <div style={{ fontSize: '0.7rem', color: fearPercent > 60 ? '#ef4444' : '#22c55e' }}>
            FEAR INDEX: {fearPercent}%
          </div>
        </div>
      </div>

      {/* Center Field of View is deliberately kept 100% UNCLUTTERED for optical safety! */}
      <div style={{ alignSelf: 'center', opacity: 0.25, fontSize: '0.65rem' }}>
        + OPTICAL RETICLE CENTER +
      </div>

      {/* Bottom Peripheral Zone */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pointerEvents: 'auto' }}>
        {/* Left: Voice Interface Status */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '6px 12px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Mic size={14} color="#22c55e" />
          <span style={{ fontSize: '0.75rem' }}>{lastVoicePhrase}</span>
        </div>

        {/* Right: Exit Glasses Mode */}
        <button
          onClick={onExitGlasses}
          style={{
            background: 'rgba(239, 68, 68, 0.4)',
            border: '1px solid #ef4444',
            color: '#ffffff',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <X size={14} />
          <span>Exit Glasses Mode</span>
        </button>
      </div>
    </div>
  );
};
