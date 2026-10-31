import React, { useState } from 'react';
import { ClueItem } from '../../types/game';
import { audio } from '../../audio/HorrorAudioEngine';
import {
  X,
  Radio,
  Compass,
  FileText,
  Zap,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface EvidenceBoardProps {
  clues: ClueItem[];
  onClose: () => void;
  onLaunchPuzzle: (puzzleKey: string) => void;
}

export const EvidenceBoardView: React.FC<EvidenceBoardProps> = ({
  clues,
  onClose,
  onLaunchPuzzle,
}) => {
  const [selectedClue, setSelectedClue] = useState<ClueItem>(clues[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return <Radio size={18} />;
      case 'Compass':
        return <Compass size={18} />;
      case 'FileText':
        return <FileText size={18} />;
      case 'Zap':
        return <Zap size={18} />;
      case 'Image':
        return <ImageIcon size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  const foundCount = clues.filter((c) => c.found).length;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 6, 10, 0.96)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 80,
      padding: '24px'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '16px',
        borderBottom: '1px solid #1e293b'
      }}>
        <div>
          <h1 style={{
            fontSize: '1.4rem',
            fontFamily: 'Cinzel, serif',
            fontWeight: 700,
            color: '#f8fafc',
            letterSpacing: '0.05em',
            margin: 0
          }}>
            CASE FILE: THE FREQUENCY 87.4 ANOMALY
          </h1>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Evidence Corkboard & Occult Diagnostics — {foundCount} of {clues.length} Discovered
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <X size={18} />
          <span>Close Dossier</span>
        </button>
      </div>

      {/* Main Split Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '24px',
        marginTop: '20px',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Column: Clue Cards List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
          paddingRight: '6px'
        }}>
          {clues.map((clue) => {
            const isSelected = selectedClue?.id === clue.id;
            return (
              <div
                key={clue.id}
                onClick={() => {
                  setSelectedClue(clue);
                  audio.playUIClick();
                }}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  backgroundColor: isSelected ? '#1e2336' : '#0e111a',
                  border: `1px solid ${isSelected ? '#ef4444' : '#1e293b'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: clue.found ? '#38bdf8' : '#64748b' }}>
                      {getIcon(clue.icon)}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: clue.found ? '#f8fafc' : '#94a3b8' }}>
                      {clue.found ? clue.name : 'Unknown Artifact'}
                    </span>
                  </div>
                  {clue.found ? (
                    <CheckCircle size={16} color="#22c55e" />
                  ) : (
                    <HelpCircle size={16} color="#475569" />
                  )}
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                  TAG: {clue.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Clue Analysis */}
        <div style={{
          backgroundColor: '#0a0d14',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto'
        }}>
          {selectedClue ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 10px',
                  background: selectedClue.found ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${selectedClue.found ? '#22c55e' : '#ef4444'}`,
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: selectedClue.found ? '#86efac' : '#fca5a5'
                }}>
                  {selectedClue.found ? 'RECOVERED & ANALYZED' : 'UNRECOVERED — SCAN SCENE'}
                </span>

                <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
                  CATALOG ID: {selectedClue.id}
                </span>
              </div>

              <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '8px' }}>
                {selectedClue.found ? selectedClue.name : 'Undiscovered Anomaly'}
              </h2>

              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
                {selectedClue.found
                  ? selectedClue.description
                  : 'This clue has not yet been physically located. Search your surroundings with the fear radar or inspect suspicious surfaces.'}
              </p>

              {selectedClue.found && (
                <div style={{
                  backgroundColor: '#121624',
                  border: '1px solid #232a40',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#38bdf8', marginBottom: '6px' }}>
                    ARCHIVIST CLASSIFIED NOTES
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5 }}>
                    "{selectedClue.lore}"
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ color: '#64748b' }}>Select an artifact from the dossier to inspect.</div>
          )}

          {/* Action to launch connected puzzle */}
          {selectedClue && selectedClue.found && selectedClue.puzzleKey && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              backgroundColor: '#161b2e',
              borderRadius: '8px',
              border: '1px solid #334155'
            }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                  Harmonic Mechanism Connected
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  This artifact can be calibrated via the interactive puzzle console.
                </div>
              </div>
              <button
                onClick={() => {
                  onLaunchPuzzle(selectedClue.puzzleKey!);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                <span>Calibrate Mechanism</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
