import React, { useState } from 'react';
import { PlayerSettings } from '../../types/game';
import { storage } from '../../core/StorageManager';
import { audio } from '../../audio/HorrorAudioEngine';
import { ArrowLeft, Volume2, ShieldCheck, Eye, Trash2, Check, Sliders } from 'lucide-react';

interface SettingsViewProps {
  currentSettings: PlayerSettings;
  onSave: (settings: PlayerSettings) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentSettings,
  onSave,
  onBack,
}) => {
  const [settings, setSettings] = useState<PlayerSettings>({ ...currentSettings });
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleSave = () => {
    storage.saveSettings(settings);
    audio.updateSettings(settings);
    onSave(settings);
    onBack();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to reset all game progress, scores, and cached clues?')) {
      storage.clearAllData();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#07080d',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '28px 20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Headquarters</span>
        </button>

        <h1 style={{
          fontSize: '1.8rem',
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          color: '#f8fafc',
          margin: 0
        }}>
          SYSTEM SETTINGS & ACCESSIBILITY
        </h1>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
          Calibrate audio, horror intensity, safe play modes, and privacy.
        </div>
      </div>

      {/* Main Settings Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
        {/* Horror Intensity Level */}
        <div style={{ backgroundColor: '#0e111a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            HORROR INTENSITY LEVEL
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {(['MILD', 'STANDARD', 'NIGHTMARE'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSettings((prev) => ({ ...prev, intensity: lvl }))}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  backgroundColor: settings.intensity === lvl ? '#ef4444' : '#141824',
                  color: '#ffffff',
                  border: `1px solid ${settings.intensity === lvl ? '#ef4444' : '#232b3f'}`,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility & Safety Toggles */}
        <div style={{ backgroundColor: '#0e111a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            ACCESSIBILITY & SAFE PLAY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Seated Mode */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Seated & Indoor Mode</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Touch/mouse navigation without walking or turning around</div>
              </div>
              <input
                type="checkbox"
                checked={settings.seatedMode}
                onChange={(e) => setSettings((prev) => ({ ...prev, seatedMode: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
              />
            </label>

            {/* Camera-Off Simulated Mode */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Camera-Off Mode (Full 3D Simulated Room)</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Disables device camera and renders high-fidelity 3D chamber</div>
              </div>
              <input
                type="checkbox"
                checked={settings.cameraOffMode}
                onChange={(e) => setSettings((prev) => ({ ...prev, cameraOffMode: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
              />
            </label>

            {/* Subtitles */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Captions & Subtitles</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Full text display for all radio broadcasts and entity whispers</div>
              </div>
              <input
                type="checkbox"
                checked={settings.subtitles}
                onChange={(e) => setSettings((prev) => ({ ...prev, subtitles: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
              />
            </label>

            {/* Reduced Motion */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#f8fafc' }}>Reduced Motion</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Disables screen shake, severe glitch jitter, and strobe effects</div>
              </div>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => setSettings((prev) => ({ ...prev, reducedMotion: e.target.checked }))}
                style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
              />
            </label>
          </div>
        </div>

        {/* Audio Volume Controls */}
        <div style={{ backgroundColor: '#0e111a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '12px' }}>
            AUDIO MIXER
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span>Master Volume</span>
                <span>{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => setSettings((prev) => ({ ...prev, masterVolume: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span>Heartbeat & Pulse Volume</span>
                <span>{Math.round(settings.heartbeatVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.heartbeatVolume}
                onChange={(e) => setSettings((prev) => ({ ...prev, heartbeatVolume: parseFloat(e.target.value) }))}
                style={{ width: '100%', accentColor: '#ef4444' }}
              />
            </div>
          </div>
        </div>

        {/* Data & Privacy */}
        <div style={{ backgroundColor: '#0e111a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            DATA PERSISTENCE & PRIVACY
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 12px 0' }}>
            REALITY HUNT does not upload or retain your camera footage or microphone audio. All progress is saved locally with optional Supabase encryption.
          </p>

          <button
            onClick={handleClearData}
            style={{
              padding: '8px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #ef4444',
              borderRadius: '6px',
              color: '#f87171',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Trash2 size={14} />
            <span>Clear Local Save Data & Reset Progress</span>
          </button>
          {clearedNotice && (
            <span style={{ fontSize: '0.7rem', color: '#22c55e', display: 'block', marginTop: '6px' }}>
              ✓ Local data cleared successfully.
            </span>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Check size={18} />
          <span>Save Preferences & Return</span>
        </button>
      </div>
    </div>
  );
};
