import React, { useState } from 'react';
import { GameMode, UserProfile, PlayerSettings } from '../../types/game';
import { audio } from '../../audio/HorrorAudioEngine';
import {
  Skull,
  Users,
  Calendar,
  Settings as SettingsIcon,
  ShoppingBag,
  Award,
  AlertTriangle,
  Play,
  Volume2,
} from 'lucide-react';

interface MainMenuViewProps {
  profile: UserProfile;
  settings: PlayerSettings;
  onSelectMode: (mode: GameMode) => void;
  onOpenSettings: () => void;
  onOpenStore: () => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({
  profile,
  settings,
  onSelectMode,
  onOpenSettings,
  onOpenStore,
}) => {
  const [showWarning, setShowWarning] = useState(true);

  const handleStartMode = (mode: GameMode) => {
    audio.playUIClick();
    onSelectMode(mode);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#08080c',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '32px 24px',
      overflow: 'hidden'
    }}>
      {/* Background Ambient Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '420px',
        height: '420px',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.12) 0%, rgba(8, 8, 12, 0) 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Bar: Profile & Quick Nav */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* Profile Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15, 18, 28, 0.8)',
          border: '1px solid #1e293b',
          borderRadius: '24px',
          padding: '6px 14px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.8rem'
          }}>
            {profile.level}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>
              {profile.username}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
              Hunts: {profile.totalHunts} â€¢ Badges: {profile.unlockedBadges.length}
            </div>
          </div>
        </div>

        {/* Settings & Store buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onOpenStore}
            style={{
              padding: '8px 14px',
              borderRadius: '20px',
              background: '#141824',
              border: '1px solid #232a40',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem'
            }}
          >
            <ShoppingBag size={14} color="#f59e0b" />
            <span>Store</span>
          </button>

          <button
            onClick={onOpenSettings}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#141824',
              border: '1px solid #232a40',
              color: '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>

      {/* Center Branding */}
      <div style={{
        textAlign: 'center',
        zIndex: 10,
        margin: '20px 0'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '12px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.7rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          Augmented Reality Psychological Horror
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontFamily: 'Cinzel, serif',
          fontWeight: 900,
          color: '#f8fafc',
          letterSpacing: '0.08em',
          margin: 0,
          textShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
        }}>
          REALITY HUNT
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: '#94a3b8',
          marginTop: '8px',
          maxWidth: '460px',
          margin: '8px auto 0 auto',
          lineHeight: 1.5
        }}>
          Turn your real surroundings into a fictional supernatural investigation.
        </p>
      </div>

      {/* Game Mode Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        maxWidth: '440px',
        width: '100%',
        margin: '0 auto',
        zIndex: 10
      }}>
        {/* Solo Night Mode */}
        <button
          onClick={() => handleStartMode('SOLO_NIGHT')}
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: '#161a29',
            border: '1px solid #ef4444',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Skull size={22} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>SOLO NIGHT</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Episode 1: The Visitor (Full Story Campaign)
              </div>
            </div>
          </div>
          <Play size={18} color="#ef4444" />
        </button>

        {/* Hunt With Friends Mode (Co-Op Architecture) */}
        <button
          onClick={() => handleStartMode('HUNT_WITH_FRIENDS')}
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            backgroundColor: '#0f121d',
            border: '1px solid #1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#181e2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={22} color="#38bdf8" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>HUNT WITH FRIENDS</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                2â€“4 Player Co-Op Investigation Lobby
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: '#1e293b', color: '#94a3b8' }}>
            Preview
          </span>
        </button>

        {/* Daily Nightmare Mode */}
        <button
          onClick={() => handleStartMode('DAILY_NIGHTMARE')}
          style={{
            padding: '14px 20px',
            borderRadius: '12px',
            backgroundColor: '#0f121d',
            border: '1px solid #1e293b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#181e2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={22} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>DAILY NIGHTMARE</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Rotating Seed Challenge & Leaderboard
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: '4px', background: '#1e293b', color: '#fbbf24' }}>
            Daily
          </span>
        </button>
      </div>

      {/* Safety Notice Footer */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#64748b',
        maxWidth: '520px',
        margin: '16px auto 0 auto',
        lineHeight: 1.4
      }}>
        âš ï¸ Real-World Safety: Every supernatural event is explicitly fictional. Never approach dangerous areas, roads, or private property. Seated & indoor play supported.
      </div>

      {/* Creator Credit */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.72rem',
        color: '#64748b',
        marginTop: '8px',
        zIndex: 10,
        letterSpacing: '0.08em'
      }}>
        Created by <span style={{ color: '#cbd5e1', fontWeight: 700 }}>Niroj Pokhrel</span>
        <div style={{ fontSize: '0.62rem', marginTop: '4px' }}>
          © 2026 Niroj Pokhrel. All Rights Reserved.
        </div>
      </div>

      {/* Content Warning Modal */}
      {showWarning && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '440px',
            backgroundColor: '#0e111a',
            border: '1px solid #dc2626',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <AlertTriangle size={36} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '8px' }}>
              CONTENT & SAFETY ADVISORY
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
              REALITY HUNT is a psychological horror game featuring sudden audio stingers, atmospheric tension, and fictional supernatural entities.
              <br /><br />
              <strong style={{ color: '#fca5a5' }}>All phenomena are strictly fictional simulations.</strong>
              Please stay aware of your physical surroundings, keep play indoors or seated, and use the emergency STOP button whenever needed.
            </p>
            <button
              onClick={() => {
                setShowWarning(false);
                audio.init(settings);
                audio.resumeAudioContext();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              I Understand & Acknowledge
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

