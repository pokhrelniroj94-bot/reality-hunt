import React, { useState } from 'react';
import { Calendar, Flame, Trophy, ShieldAlert, ArrowLeft, Play, Clock } from 'lucide-react';
import { audio } from '../../audio/HorrorAudioEngine';

interface DailyNightmareProps {
  onBack: () => void;
  onStartChallenge: (seed: string) => void;
}

export const DailyNightmareView: React.FC<DailyNightmareProps> = ({
  onBack,
  onStartChallenge,
}) => {
  const [streakCount] = useState<number>(3);
  const todaySeed = 'SEED-NIGHTMARE-8704';

  const modifiers = [
    { name: 'Dim Battery Protocol', desc: 'Flashlight battery operates at 50% capacity.' },
    { name: 'Hyper-Resonant Visitor', desc: 'The Visitor stalks 25% closer and reacts violently to audio.' },
    { name: 'Inverted Runic Alignment', desc: 'Concentric ward rings require reverse polar alignment.' },
  ];

  const leaderboard = [
    { rank: 1, name: 'SpectralHunter_X', score: 4850, time: '6m 12s', verified: true },
    { rank: 2, name: 'Vane_Archivist', score: 4620, time: '7m 04s', verified: true },
    { rank: 3, name: 'Cipher_99', score: 4310, time: '8m 45s', verified: true },
    { rank: 4, name: 'Investigator_404 (You)', score: 3950, time: '9m 20s', verified: true },
  ];

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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '16px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #f59e0b',
              color: '#fbbf24',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              <Calendar size={14} />
              <span>ROTATING DAILY CHALLENGE</span>
            </div>

            <h1 style={{
              fontSize: '1.8rem',
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              color: '#f8fafc',
              margin: 0
            }}>
              DAILY NIGHTMARE
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
              CURRENT SEED: {todaySeed} • Resets in 11h 24m
            </div>
          </div>

          {/* Streak Badge */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '12px',
            padding: '8px 14px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
              <Flame size={16} color="#ef4444" />
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>{streakCount}</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#fca5a5' }}>Day Streak</div>
          </div>
        </div>
      </div>

      {/* Active Modifiers Box */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        margin: '16px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <ShieldAlert size={18} color="#ef4444" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ACTIVE NIGHTMARE MUTATORS
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {modifiers.map((mod, i) => (
            <div key={i} style={{ background: '#141824', padding: '10px 14px', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fca5a5' }}>{mod.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{mod.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Daily Leaderboard */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Trophy size={18} color="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            GLOBAL SEED LEADERBOARD (VERIFIED RUNS)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: entry.rank === 4 ? '#1c2236' : '#121522',
                border: entry.rank === 4 ? '1px solid #38bdf8' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: entry.rank === 1 ? '#f59e0b' : entry.rank === 2 ? '#cbd5e1' : '#b45309'
                }}>
                  #{entry.rank}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{entry.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'JetBrains Mono, monospace' }}>
                  {entry.score} PTS
                </div>
                <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{entry.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy Button */}
      <div>
        <button
          onClick={() => onStartChallenge(todaySeed)}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#f59e0b',
            color: '#000000',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 30px rgba(245, 158, 11, 0.3)'
          }}
        >
          <Play size={20} fill="#000000" />
          <span>DEPLOY INTO DAILY NIGHTMARE</span>
        </button>
      </div>
    </div>
  );
};
