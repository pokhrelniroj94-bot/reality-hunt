import React, { useState, useEffect, useRef } from 'react';
import { EchoSequenceState, PuzzleResult } from '../types/puzzles';
import { audio } from '../audio/HorrorAudioEngine';
import { Zap, Play, CheckCircle, Volume2, X } from 'lucide-react';

interface EchoSequencePuzzleProps {
  onComplete: (result: PuzzleResult) => void;
  onCancel: () => void;
}

const TONES = [
  { id: 0, name: '432 Hz', freq: 432, color: '#10b981', label: 'Alpha Resonator' },
  { id: 1, name: '528 Hz', freq: 528, color: '#f59e0b', label: 'Solar Resonator' },
  { id: 2, name: '639 Hz', freq: 639, color: '#ef4444', label: 'Void Resonator' },
  { id: 3, name: '741 Hz', freq: 741, color: '#38bdf8', label: 'Ethereal Resonator' },
];

export const EchoSequencePuzzle: React.FC<EchoSequencePuzzleProps> = ({ onComplete, onCancel }) => {
  const [state, setState] = useState<EchoSequenceState>({
    sequenceLength: 4,
    targetTones: [0, 2, 1, 3], // 432 -> 639 -> 528 -> 741
    playerInput: [],
    isPlayingDemo: false,
    currentStep: 0,
    isCompleted: false,
    attemptsLeft: 3,
  });

  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const startTime = useRef<number>(Date.now());
  const mistakes = useRef<number>(0);

  // Play audio note + visual flash
  const triggerTone = (toneIdx: number, durationSec: number = 0.5) => {
    const tone = TONES[toneIdx];
    if (tone) {
      audio.playTuningForkTone(tone.freq, durationSec);
      setActiveHighlight(toneIdx);
      setTimeout(() => setActiveHighlight(null), durationSec * 700);
    }
  };

  // Play demo sequence
  const playDemo = () => {
    if (state.isPlayingDemo || state.isCompleted) return;
    setState((prev) => ({ ...prev, isPlayingDemo: true, playerInput: [] }));

    let i = 0;
    const interval = setInterval(() => {
      if (i < state.targetTones.length) {
        triggerTone(state.targetTones[i], 0.6);
        i++;
      } else {
        clearInterval(interval);
        setState((prev) => ({ ...prev, isPlayingDemo: false }));
      }
    }, 850);
  };

  useEffect(() => {
    // Auto-play demo once mounted
    const timer = setTimeout(playDemo, 600);
    return () => clearTimeout(timer);
  }, []);

  const handlePadClick = (toneIdx: number) => {
    if (state.isPlayingDemo || state.isCompleted) return;

    triggerTone(toneIdx, 0.4);
    const nextInput = [...state.playerInput, toneIdx];
    const currentIndex = nextInput.length - 1;

    // Check correctness of current press
    if (nextInput[currentIndex] !== state.targetTones[currentIndex]) {
      // Mistake!
      mistakes.current += 1;
      audio.playPuzzleFailure();
      setState((prev) => ({
        ...prev,
        playerInput: [],
        attemptsLeft: Math.max(0, prev.attemptsLeft - 1),
      }));

      // Replay demo after error
      setTimeout(playDemo, 1000);
      return;
    }

    setState((prev) => ({ ...prev, playerInput: nextInput }));

    // Check if whole sequence complete
    if (nextInput.length === state.targetTones.length) {
      setState((prev) => ({ ...prev, isCompleted: true }));
      audio.playPuzzleSuccess();

      setTimeout(() => {
        const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
        onComplete({
          puzzleId: 'PUZZLE_ECHO_SEQUENCE',
          puzzleType: 'ECHO_SEQUENCE',
          success: true,
          timeTakenSeconds: timeTaken,
          mistakes: mistakes.current,
          unlockedClueId: 'CLUE_RESONANCE_FORK',
        });
      }, 1400);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(8, 8, 12, 0.94)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: '#0f111a',
        border: '1px solid #2a2e3f',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap color="#38bdf8" size={24} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                SPECTRAL HARMONIC MATRIX
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                432 Hz Acoustic Memory Sequence
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Play Sequence Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <button
            onClick={playDemo}
            disabled={state.isPlayingDemo || state.isCompleted}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              background: state.isPlayingDemo ? '#334155' : '#1e293b',
              border: '1px solid #475569',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.8rem',
              cursor: state.isPlayingDemo ? 'not-allowed' : 'pointer'
            }}
          >
            <Play size={14} />
            {state.isPlayingDemo ? 'Listening to Frequencies...' : 'Replay Echo Sequence'}
          </button>

          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
            Step: {state.playerInput.length} / {state.targetTones.length}
          </span>
        </div>

        {/* 2x2 Grid of Resonant Crystal Pads */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
          {TONES.map((tone) => {
            const isLit = activeHighlight === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => handlePadClick(tone.id)}
                disabled={state.isPlayingDemo || state.isCompleted}
                style={{
                  height: '110px',
                  borderRadius: '10px',
                  backgroundColor: isLit ? tone.color : '#161926',
                  border: `2px solid ${isLit ? '#ffffff' : tone.color}`,
                  color: isLit ? '#000000' : '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: state.isPlayingDemo ? 'wait' : 'pointer',
                  transform: isLit ? 'scale(1.04)' : 'scale(1.0)',
                  transition: 'all 0.15s ease',
                  boxShadow: isLit ? `0 0 24px ${tone.color}` : 'none'
                }}
              >
                <Volume2 size={24} style={{ marginBottom: '6px' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{tone.name}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{tone.label}</span>
              </button>
            );
          })}
        </div>

        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
          {state.targetTones.map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: i < state.playerInput.length ? '#22c55e' : '#334155',
                border: '1px solid #475569'
              }}
            />
          ))}
        </div>

        {/* Completion status */}
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: state.isCompleted ? 'rgba(34, 197, 94, 0.15)' : 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${state.isCompleted ? '#22c55e' : '#334155'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {state.isCompleted ? (
            <>
              <CheckCircle size={20} color="#22c55e" />
              <span style={{ fontSize: '0.85rem', color: '#86efac', fontWeight: 600 }}>
                RESONANCE ACHIEVED — HARMONIC RELIC PRIMED!
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
              Repeat the sequence of acoustic frequencies played by the echo chamber.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
