import React, { useState } from 'react';
import { Users, Shield, Copy, Check, ArrowLeft, Radio, AlertCircle } from 'lucide-react';
import { audio } from '../../audio/HorrorAudioEngine';

interface MultiplayerLobbyProps {
  onBack: () => void;
}

interface PlayerSlot {
  id: string;
  name: string;
  role: 'Lead Investigator' | 'Occultist' | 'Signal Tech' | 'Sentry';
  isReady: boolean;
  ping: number;
}

export const MultiplayerLobbyView: React.FC<MultiplayerLobbyProps> = ({ onBack }) => {
  const [roomCode] = useState('VOID-8742');
  const [copied, setCopied] = useState(false);

  const [players, setPlayers] = useState<PlayerSlot[]>([
    { id: '1', name: 'Investigator_404 (You)', role: 'Lead Investigator', isReady: true, ping: 32 },
    { id: '2', name: 'Agent_Vane', role: 'Occultist', isReady: true, ping: 48 },
    { id: '3', name: 'Open Slot', role: 'Signal Tech', isReady: false, ping: 0 },
    { id: '4', name: 'Open Slot', role: 'Sentry', isReady: false, ping: 0 },
  ]);

  const copyRoomCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied(true);
    audio.playUIClick();
    setTimeout(() => setCopied(false), 2000);
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
      {/* Top Header */}
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

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '16px',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid #38bdf8',
          color: '#7dd3fc',
          fontSize: '0.7rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          <Users size={14} />
          <span>CO-OP INVESTIGATION SUITE (2–4 PLAYERS)</span>
        </div>

        <h1 style={{
          fontSize: '1.8rem',
          fontFamily: 'Cinzel, serif',
          fontWeight: 700,
          color: '#f8fafc',
          margin: 0
        }}>
          HUNT WITH FRIENDS
        </h1>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
          Synchronized evidence, assigned roles, and spatial audio comms.
        </div>
      </div>

      {/* Room Code Card */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        margin: '16px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            PRIVATE SQUAD TRANSMISSION CODE
          </div>
          <div style={{ fontSize: '1.4rem', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, color: '#38bdf8' }}>
            {roomCode}
          </div>
        </div>

        <button
          onClick={copyRoomCode}
          style={{
            padding: '8px 14px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '6px',
            color: '#f8fafc',
            fontSize: '0.8rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Roster Slots */}
      <div style={{
        backgroundColor: '#0e111a',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
          INVESTIGATIVE SQUAD ROSTER (4 SLOTS)
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {players.map((slot) => (
            <div
              key={slot.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: slot.name.includes('Open') ? '#12141d' : '#151926',
                border: slot.name.includes('You') ? '1px solid #38bdf8' : '1px solid #1e293b'
              }}
            >
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                  {slot.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                  Role: {slot.role}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  backgroundColor: slot.isReady ? 'rgba(34, 197, 94, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: slot.isReady ? '#86efac' : '#94a3b8'
                }}>
                  {slot.isReady ? 'READY' : 'WAITING'}
                </span>
                {slot.ping > 0 && (
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>
                    {slot.ping}ms
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Disclaimer */}
      <div style={{
        backgroundColor: '#111524',
        border: '1px solid #28334e',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '20px',
        display: 'flex',
        gap: '10px'
      }}>
        <AlertCircle size={20} color="#38bdf8" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
          <strong>Multiplayer Status Notice:</strong> The co-op synchronization architecture, state sync schemas, and role permissions are fully specified and live in the backend migrations. Real-time multiplayer rooms are queued for cloud deployment; live investigation currently runs in single-player Solo Night.
        </div>
      </div>

      {/* Start Button */}
      <div>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Return to Single-Player Investigation
        </button>
      </div>
    </div>
  );
};
