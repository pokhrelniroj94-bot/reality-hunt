import React, { useState } from 'react';
import { EPISODE_1_DATA } from '../../story/Episode1TheVisitor';
import { audio } from '../../audio/HorrorAudioEngine';
import { Radio, Play, ArrowLeft, Shield, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface MissionBriefingProps {
  onStartMission: () => void;
  onBack: () => void;
}

export const MissionBriefingView: React.FC<MissionBriefingProps> = ({
  onStartMission,
  onBack,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudio = () => {
    if (!isPlayingAudio) {
      setIsPlayingAudio(true);
      audio.playStaticBurst(0.4, 0.4);
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 7000);
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
          <span>Abort to Main Menu</span>
        </button>

        <div style={{
          display: 'inline-block',
          padding: '4px 10px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '16px',
          color: '#f87171',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          CLASSIFIED FIELD OPERATION
        </div>

        <h1 style={{
          fontSize: '1.8rem',
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          color: '#f8fafc',
          margin: 0
        }}>
          {EPISODE_1_DATA.title}
        </h1>
        <div style={{ fontSize: '0.9rem', color: '#38bdf8', marginTop: '4px' }}>
          {EPISODE_1_DATA.subtitle} • Est. Time: {EPISODE_1_DATA.estimatedMinutes} mins • {EPISODE_1_DATA.difficulty}
        </div>
      </div>

      {/* Description Card */}
      <div style={{
        backgroundColor: '#0e111b',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '20px',
        margin: '16px 0'
      }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px' }}>
          SITUATION SUMMARY
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
          {EPISODE_1_DATA.description}
        </p>

        {/* Audio Briefing Box */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#141826',
          borderRadius: '8px',
          border: '1px solid #232b3f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio size={20} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
                Dispatcher 7 Encrypted Tape
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                {isPlayingAudio ? 'Broadcasting transmission...' : 'Tap to listen to audio briefing'}
              </div>
            </div>
          </div>

          <button
            onClick={toggleAudio}
            style={{
              padding: '6px 14px',
              backgroundColor: isPlayingAudio ? '#ef4444' : '#1e293b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {isPlayingAudio ? 'Playing...' : 'Play Audio'}
          </button>
        </div>
      </div>

      {/* Objectives Checklist */}
      <div style={{
        backgroundColor: '#0e111b',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '12px' }}>
          PRIMARY INVESTIGATION OBJECTIVES
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {EPISODE_1_DATA.objectives.map((obj) => (
            <div key={obj.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={16} color="#475569" />
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {obj.text} {obj.optional && <span style={{ color: '#f59e0b' }}>(Optional Relic)</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div>
        <button
          onClick={onStartMission}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#ef4444',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)'
          }}
        >
          <Play size={20} fill="#ffffff" />
          <span>COMMENCE AR INVESTIGATION</span>
        </button>
      </div>
    </div>
  );
};
