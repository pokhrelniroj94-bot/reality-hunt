import React, { useState, useEffect, useRef } from 'react';
import { WardCipherState, PuzzleResult } from '../types/puzzles';
import { audio } from '../audio/HorrorAudioEngine';
import { Compass, RotateCw, CheckCircle, Shield, X } from 'lucide-react';

interface WardCipherPuzzleProps {
  onComplete: (result: PuzzleResult) => void;
  onCancel: () => void;
}

export const WardCipherPuzzle: React.FC<WardCipherPuzzleProps> = ({ onComplete, onCancel }) => {
  const [state, setState] = useState<WardCipherState>({
    outerRingAngle: 0,
    middleRingAngle: 90,
    innerRingAngle: 180,
    targetOuterAngle: 90,
    targetMiddleAngle: 225,
    targetInnerAngle: 315,
    toleranceDegrees: 18,
    isAligned: false,
    activeRunes: ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'],
  });

  const startTime = useRef<number>(Date.now());
  const mistakes = useRef<number>(0);

  const rotateRing = (ring: 'outer' | 'middle' | 'inner', delta: number) => {
    if (state.isAligned) return;
    audio.playUIClick();

    setState((prev) => {
      let nextAngle: number;
      if (ring === 'outer') {
        nextAngle = (prev.outerRingAngle + delta + 360) % 360;
        return { ...prev, outerRingAngle: nextAngle };
      } else if (ring === 'middle') {
        nextAngle = (prev.middleRingAngle + delta + 360) % 360;
        return { ...prev, middleRingAngle: nextAngle };
      } else {
        nextAngle = (prev.innerRingAngle + delta + 360) % 360;
        return { ...prev, innerRingAngle: nextAngle };
      }
    });
  };

  // Check alignment
  useEffect(() => {
    const checkAngleMatch = (current: number, target: number, tol: number) => {
      const diff = Math.abs((current % 360) - (target % 360));
      return Math.min(diff, 360 - diff) <= tol;
    };

    const outerOk = checkAngleMatch(state.outerRingAngle, state.targetOuterAngle, state.toleranceDegrees);
    const midOk = checkAngleMatch(state.middleRingAngle, state.targetMiddleAngle, state.toleranceDegrees);
    const innerOk = checkAngleMatch(state.innerRingAngle, state.targetInnerAngle, state.toleranceDegrees);

    if (outerOk && midOk && innerOk && !state.isAligned) {
      setState((prev) => ({ ...prev, isAligned: true }));
      audio.playPuzzleSuccess();

      setTimeout(() => {
        const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
        onComplete({
          puzzleId: 'PUZZLE_WARD_CIPHER',
          puzzleType: 'WARD_CIPHER',
          success: true,
          timeTakenSeconds: timeTaken,
          mistakes: mistakes.current,
          unlockedClueId: 'CLUE_FROST_RESIDUE',
        });
      }, 1500);
    }
  }, [state.outerRingAngle, state.middleRingAngle, state.innerRingAngle]);

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
        maxWidth: '480px',
        backgroundColor: '#0f111a',
        border: '1px solid #2a2e3f',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Compass color="#dc2626" size={24} />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                RUNIC WARD ALIGNMENT
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Spatial Containment Meridian Seal
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

        {/* Concentric Ward Visualizer */}
        <div style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          margin: '0 auto 20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Meridian Line Marker at Top (Target alignment point) */}
          <div style={{
            position: 'absolute',
            top: '-6px',
            width: '4px',
            height: '22px',
            backgroundColor: '#ef4444',
            zIndex: 10,
            boxShadow: '0 0 10px #ef4444'
          }} />

          {/* Outer Ring */}
          <div
            style={{
              position: 'absolute',
              width: '250px',
              height: '250px',
              borderRadius: '50%',
              border: `2px dashed ${state.isAligned ? '#22c55e' : '#dc2626'}`,
              transform: `rotate(${state.outerRingAngle}deg)`,
              transition: 'transform 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: state.isAligned ? '0 0 18px rgba(34, 197, 94, 0.4)' : '0 0 10px rgba(220, 38, 38, 0.2)'
            }}
          >
            <span style={{ position: 'absolute', top: '6px', fontSize: '1.1rem', color: '#f87171' }}>ᚠ</span>
            <span style={{ position: 'absolute', bottom: '6px', fontSize: '1.1rem', color: '#f87171' }}>ᚢ</span>
            <span style={{ position: 'absolute', left: '6px', fontSize: '1.1rem', color: '#f87171' }}>ᚦ</span>
            <span style={{ position: 'absolute', right: '6px', fontSize: '1.1rem', color: '#f87171' }}>ᚨ</span>
          </div>

          {/* Middle Ring */}
          <div
            style={{
              position: 'absolute',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: `2px dashed ${state.isAligned ? '#22c55e' : '#f59e0b'}`,
              transform: `rotate(${state.middleRingAngle}deg)`,
              transition: 'transform 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ position: 'absolute', top: '6px', fontSize: '1rem', color: '#fbbf24' }}>ᚱ</span>
            <span style={{ position: 'absolute', bottom: '6px', fontSize: '1rem', color: '#fbbf24' }}>ᚲ</span>
            <span style={{ position: 'absolute', left: '6px', fontSize: '1rem', color: '#fbbf24' }}>ᚷ</span>
            <span style={{ position: 'absolute', right: '6px', fontSize: '1rem', color: '#fbbf24' }}>ᚹ</span>
          </div>

          {/* Inner Ring */}
          <div
            style={{
              position: 'absolute',
              width: '110px',
              height: '110px',
              borderRadius: '50%',
              border: `2px dashed ${state.isAligned ? '#22c55e' : '#38bdf8'}`,
              transform: `rotate(${state.innerRingAngle}deg)`,
              transition: 'transform 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ position: 'absolute', top: '4px', fontSize: '0.9rem', color: '#7dd3fc' }}>ᚺ</span>
            <span style={{ position: 'absolute', bottom: '4px', fontSize: '0.9rem', color: '#7dd3fc' }}>ᚾ</span>
            <span style={{ position: 'absolute', left: '4px', fontSize: '0.9rem', color: '#7dd3fc' }}>ᛁ</span>
            <span style={{ position: 'absolute', right: '4px', fontSize: '0.9rem', color: '#7dd3fc' }}>ᛃ</span>
          </div>

          {/* Core Eye Marker */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: state.isAligned ? '#22c55e' : '#1e1b4b',
            border: '2px solid #818cf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px #818cf8'
          }}>
            <Shield size={18} color="#ffffff" />
          </div>
        </div>

        {/* Ring Rotation Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {/* Outer Ring Controls */}
          <div style={{ background: '#141724', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#f87171', display: 'block', marginBottom: '6px' }}>Outer Ring</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              <button
                onClick={() => rotateRing('outer', -45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                -45°
              </button>
              <button
                onClick={() => rotateRing('outer', 45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                +45°
              </button>
            </div>
          </div>

          {/* Middle Ring Controls */}
          <div style={{ background: '#141724', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block', marginBottom: '6px' }}>Middle Ring</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              <button
                onClick={() => rotateRing('middle', -45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                -45°
              </button>
              <button
                onClick={() => rotateRing('middle', 45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                +45°
              </button>
            </div>
          </div>

          {/* Inner Ring Controls */}
          <div style={{ background: '#141724', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#7dd3fc', display: 'block', marginBottom: '6px' }}>Inner Ring</span>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              <button
                onClick={() => rotateRing('inner', -45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                -45°
              </button>
              <button
                onClick={() => rotateRing('inner', 45)}
                style={{ padding: '6px 10px', background: '#25293d', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
              >
                +45°
              </button>
            </div>
          </div>
        </div>

        {/* Status banner */}
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          backgroundColor: state.isAligned ? 'rgba(34, 197, 94, 0.15)' : 'rgba(30, 41, 59, 0.5)',
          border: `1px solid ${state.isAligned ? '#22c55e' : '#334155'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {state.isAligned ? (
            <>
              <CheckCircle size={20} color="#22c55e" />
              <span style={{ fontSize: '0.85rem', color: '#86efac', fontWeight: 600 }}>
                CONCENTRIC RUNES LOCKED — WARD ANCHORED!
              </span>
            </>
          ) : (
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Align the active rune on each ring with the red top meridian marker.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
