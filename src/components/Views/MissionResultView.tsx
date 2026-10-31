import React from 'react';
import { InvestigationMetrics } from '../../types/game';
import { EPISODE_1_ENDINGS } from '../../story/Endings';
import { Award, Clock, Skull, Zap, CheckCircle, RotateCcw, Home } from 'lucide-react';
import { audio } from '../../audio/HorrorAudioEngine';

interface MissionResultViewProps {
  metrics: InvestigationMetrics;
  onReplay: () => void;
  onReturnMenu: () => void;
}

export const MissionResultView: React.FC<MissionResultViewProps> = ({
  metrics,
  onReplay,
  onReturnMenu,
}) => {
  const endingKey = metrics.endingAchieved || 'ENDING_FAILED';
  const ending = EPISODE_1_ENDINGS[endingKey] || EPISODE_1_ENDINGS.ENDING_FAILED;

  const totalTimeSeconds = Math.round(
    ((metrics.endTime || Date.now()) - metrics.startTime) / 1000
  );
  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = totalTimeSeconds % 60;

  const isSuccess = endingKey === 'ENDING_SEAL' || endingKey === 'ENDING_VESSEL';

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#07080d',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '32px 24px',
      overflowY: 'auto'
    }}>
      {/* Header Result Tag */}
      <div>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '16px',
          background: isSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${isSuccess ? '#22c55e' : '#ef4444'}`,
          color: isSuccess ? '#86efac' : '#fca5a5',
          fontSize: '0.75rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '10px'
        }}>
          INVESTIGATION CONCLUSION
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          color: '#f8fafc',
          margin: 0
        }}>
          {ending.title}
        </h1>
        <div style={{ fontSize: '1rem', color: isSuccess ? '#38bdf8' : '#ef4444', marginTop: '4px', fontWeight: 600 }}>
          {ending.tagline}
        </div>
      </div>

      {/* Narrative Debriefing Card */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '20px',
        margin: '16px 0'
      }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '8px' }}>
          OFFICIAL AFTER-ACTION TELEMETRY
        </div>
        <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
          "{ending.narrativeConclusion}"
        </p>
      </div>

      {/* Score & Metrics Breakdown */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            TOTAL INVESTIGATION SCORE
          </span>
          <span style={{
            fontSize: '1.8rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 800,
            color: '#f59e0b'
          }}>
            {metrics.calculatedScore} PTS
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div style={{ background: '#141824', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={18} color="#38bdf8" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Time Elapsed</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {minutes}m {seconds}s
              </div>
            </div>
          </div>

          <div style={{ background: '#141824', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} color="#22c55e" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Clues Located</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {metrics.cluesDiscovered} / {metrics.totalClues}
              </div>
            </div>
          </div>

          <div style={{ background: '#141824', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="#fbbf24" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Puzzles Calibrated</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {metrics.puzzlesSolved} / {metrics.totalPuzzles}
              </div>
            </div>
          </div>

          <div style={{ background: '#141824', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Skull size={18} color="#ef4444" />
            <div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Peak Fear Level</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>
                {Math.round(metrics.maxFearLevel * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Badge Unlocked */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#1b1d2c',
          border: '1px solid #333952',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Award size={24} color="#f59e0b" />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>
              DISTINCTION BADGE UNLOCKED: {ending.badgeId}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
              Recorded to your permanent investigator career ledger.
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onReplay}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f8fafc',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <RotateCcw size={16} />
          <span>Replay Investigation</span>
        </button>

        <button
          onClick={onReturnMenu}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: '#ef4444',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <Home size={16} />
          <span>Return to Headquarters</span>
        </button>
      </div>
    </div>
  );
};
