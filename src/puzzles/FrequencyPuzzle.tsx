import React, { useState, useEffect, useRef } from 'react';
import { FrequencyPuzzleState, PuzzleResult } from '../types/puzzles';
import { audio } from '../audio/HorrorAudioEngine';
import { Radio, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface FrequencyPuzzleProps {
  onComplete: (result: PuzzleResult) => void;
  onCancel: () => void;
}

export const FrequencyPuzzle: React.FC<FrequencyPuzzleProps> = ({ onComplete, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [state, setState] = useState<FrequencyPuzzleState>({
    targetFrequency: 87.4,
    targetAmplitude: 0.8,
    targetPhase: 180,
    currentFrequency: 75.0,
    currentAmplitude: 0.4,
    currentPhase: 45,
    tolerance: 1.2,
    isUnlocked: false,
  });

  const [matchPercent, setMatchPercent] = useState<number>(0);
  const startTime = useRef<number>(Date.now());
  const mistakes = useRef<number>(0);

  // Oscilloscope Canvas Rendering Loop
  useEffect(() => {
    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.04;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      // Dark CRT background
      ctx.fillStyle = '#060609';
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = '#151b26';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 1. Target Signal (Crimson Ghost Line)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.75)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const rad = (x / w) * Math.PI * 8 * (state.targetFrequency / 40) + t;
        const y = midY + Math.sin(rad + (state.targetPhase * Math.PI) / 180) * (state.targetAmplitude * 45);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Player Signal (Cyan Receiver Waveform)
      ctx.strokeStyle = state.isUnlocked ? '#22c55e' : 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = state.isUnlocked ? '#22c55e' : '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const rad = (x / w) * Math.PI * 8 * (state.currentFrequency / 40) + t;
        const y = midY + Math.sin(rad + (state.currentPhase * Math.PI) / 180) * (state.currentAmplitude * 45);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [state]);

  // Calculate resonance match
  useEffect(() => {
    const freqDiff = Math.abs(state.currentFrequency - state.targetFrequency);
    const ampDiff = Math.abs(state.currentAmplitude - state.targetAmplitude);
    const phaseDiff = Math.abs(state.currentPhase - state.targetPhase);

    // Normalized scores
    const freqScore = Math.max(0, 1 - freqDiff / 15);
    const ampScore = Math.max(0, 1 - ampDiff / 0.8);
    const phaseScore = Math.max(0, 1 - phaseDiff / 180);

    const totalMatch = Math.round(((freqScore * 0.5 + ampScore * 0.25 + phaseScore * 0.25) * 100));
    setMatchPercent(totalMatch);

    if (freqDiff <= 0.6 && ampDiff <= 0.12 && phaseDiff <= 25 && !state.isUnlocked) {
      setState((prev) => ({ ...prev, isUnlocked: true }));
      audio.playPuzzleSuccess();

      setTimeout(() => {
        const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
        onComplete({
          puzzleId: 'PUZZLE_FREQUENCY_87_4',
          puzzleType: 'FREQUENCY_TUNER',
          success: true,
          timeTakenSeconds: timeTaken,
          mistakes: mistakes.current,
          unlockedClueId: 'CLUE_CASSETTE',
        });
      }, 1400);
    }
  }, [state.currentFrequency, state.currentAmplitude, state.currentPhase]);

  const handleFrequencyChange = (val: number) => {
    setState((prev) => ({ ...prev, currentFrequency: val }));
    if (Math.random() < 0.2) audio.playStaticBurst(0.1, 0.2);
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
        maxWidth: '520px',
        backgroundColor: '#0f111a',
        border: '1px solid #2a2e3f',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Radio color="#ef4444" size={24} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                SIGNAL FREQUENCY TUNER
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Harmonic Spectrogram Decryption
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

        {/* Oscilloscope Canvas */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <canvas
            ref={canvasRef}
            width={480}
            height={160}
            style={{
              width: '100%',
              height: '160px',
              borderRadius: '8px',
              border: '1px solid #1e293b'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            fontSize: '0.75rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: state.isUnlocked ? '#22c55e' : '#38bdf8',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            RESONANCE: {matchPercent}%
          </div>
          <div style={{
            position: 'absolute',
            bottom: '8px',
            left: '12px',
            fontSize: '0.7rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#ef4444',
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            TARGET: 87.4 MHz
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>Frequency Carrier (MHz)</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>{state.currentFrequency.toFixed(1)} MHz</span>
            </div>
            <input
              type="range"
              min="60"
              max="110"
              step="0.2"
              value={state.currentFrequency}
              onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>Signal Amplitude</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>{state.currentAmplitude.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={state.currentAmplitude}
              onChange={(e) => setState((prev) => ({ ...prev, currentAmplitude: parseFloat(e.target.value) }))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>Phase Angle (Deg)</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#38bdf8' }}>{state.currentPhase}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="5"
              value={state.currentPhase}
              onChange={(e) => setState((prev) => ({ ...prev, currentPhase: parseInt(e.target.value) }))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
          </div>
        </div>

        {/* Status Message */}
        <div style={{
          marginTop: '20px',
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: state.isUnlocked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${state.isUnlocked ? '#22c55e' : '#334155'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {state.isUnlocked ? (
            <>
              <CheckCircle size={20} color="#22c55e" />
              <span style={{ fontSize: '0.85rem', color: '#86efac', fontWeight: 600 }}>
                CARRIER SYNCHRONIZED — DECRYPTING TRANSMISSION...
              </span>
            </>
          ) : (
            <>
              <AlertTriangle size={20} color="#f59e0b" />
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Adjust frequency, amplitude, and phase to match the red anomaly line.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
