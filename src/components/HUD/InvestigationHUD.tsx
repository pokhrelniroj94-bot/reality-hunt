import React from 'react';
import { FearRadar } from './FearRadar';
import { BatterySanityGauge } from './BatterySanityGauge';
import {
  FolderOpen,
  Backpack,
  Radio,
  Eye,
  Camera,
  AlertOctagon,
  Glasses,
  CheckCircle2,
} from 'lucide-react';
import { ARDisplayMode } from '../../types/ar';

interface InvestigationHUDProps {
  currentObjective: string;
  foundCluesCount: number;
  totalCluesCount: number;
  fearLevel: number;
  entityDistance: number;
  batteryPercent: number;
  flashlightOn: boolean;
  displayMode: ARDisplayMode;
  glassesMode: boolean;
  activeSubtitle: string | null;
  onToggleFlashlight: () => void;
  onOpenEvidenceBoard: () => void;
  onOpenInventory: () => void;
  onOpenDialogue: () => void;
  onToggleDisplayMode: () => void;
  onToggleGlassesMode: () => void;
  onEmergencyStop: () => void;
}

export const InvestigationHUD: React.FC<InvestigationHUDProps> = ({
  currentObjective,
  foundCluesCount,
  totalCluesCount,
  fearLevel,
  entityDistance,
  batteryPercent,
  flashlightOn,
  displayMode,
  glassesMode,
  activeSubtitle,
  onToggleFlashlight,
  onOpenEvidenceBoard,
  onOpenInventory,
  onOpenDialogue,
  onToggleDisplayMode,
  onToggleGlassesMode,
  onEmergencyStop,
}) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '16px',
      zIndex: 20
    }}>
      {/* Top Header Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px',
        pointerEvents: 'auto'
      }}>
        {/* Left: Objective pill */}
        <div style={{
          background: 'rgba(15, 17, 26, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '8px 16px',
          maxWidth: '340px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ef4444', fontWeight: 700 }}>
              CURRENT DIRECTIVE
            </span>
            <span style={{ fontSize: '0.65rem', color: '#64748b' }}>
              ({foundCluesCount}/{totalCluesCount} Clues)
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 500, lineHeight: 1.3 }}>
            {currentObjective}
          </div>
        </div>

        {/* Right: Controls & Emergency Stop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BatterySanityGauge
            batteryPercent={batteryPercent}
            fearLevel={fearLevel}
            flashlightOn={flashlightOn}
            onToggleFlashlight={onToggleFlashlight}
          />

          {/* AR Display Mode Toggle (Simulated Room vs Camera Feed) */}
          <button
            onClick={onToggleDisplayMode}
            title="Switch AR Display Mode"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(15, 17, 26, 0.85)',
              border: '1px solid #334155',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {displayMode === 'CAMERA_FEED' ? <Camera size={18} /> : <Eye size={18} />}
          </button>

          {/* AR Glasses Mode Toggle */}
          <button
            onClick={onToggleGlassesMode}
            title="Toggle Lightweight AR Glasses HUD"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: glassesMode ? '#ef4444' : 'rgba(15, 17, 26, 0.85)',
              border: `1px solid ${glassesMode ? '#ef4444' : '#334155'}`,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Glasses size={18} />
          </button>

          {/* Emergency Safety STOP Button */}
          <button
            onClick={onEmergencyStop}
            title="Emergency Stop Investigation"
            style={{
              height: '40px',
              padding: '0 12px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            <AlertOctagon size={16} />
            <span>STOP</span>
          </button>
        </div>
      </div>

      {/* Subtitles Overlay */}
      {activeSubtitle && (
        <div style={{
          alignSelf: 'center',
          background: 'rgba(8, 8, 12, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '8px 16px',
          maxWidth: '560px',
          textAlign: 'center',
          color: '#e2e8f0',
          fontSize: '0.85rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.8)'
        }}>
          {activeSubtitle}
        </div>
      )}

      {/* Bottom Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        pointerEvents: 'auto'
      }}>
        {/* Left: Fear Radar */}
        <FearRadar
          fearLevel={fearLevel}
          entityDistance={entityDistance}
          glitchIntensity={fearLevel > 0.6 ? 0.8 : 0.2}
          isLookedAt={entityDistance < 4}
        />

        {/* Right: Action Buttons Drawer */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Radio Comms Button */}
          <button
            onClick={onOpenDialogue}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 17, 26, 0.9)',
              border: '1px solid #1e293b',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Radio size={18} color="#ef4444" />
            <span>COMMS</span>
          </button>

          {/* Evidence Board Button */}
          <button
            onClick={onOpenEvidenceBoard}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 17, 26, 0.9)',
              border: '1px solid #1e293b',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <FolderOpen size={18} color="#38bdf8" />
            <span>EVIDENCE</span>
          </button>

          {/* Inventory Button */}
          <button
            onClick={onOpenInventory}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 17, 26, 0.9)',
              border: '1px solid #1e293b',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
            }}
          >
            <Backpack size={18} color="#10b981" />
            <span>GEAR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
