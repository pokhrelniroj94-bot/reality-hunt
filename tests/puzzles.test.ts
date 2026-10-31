import { describe, it, expect } from 'vitest';

describe('Puzzle Logic Unit Tests', () => {
  describe('Puzzle 1: Frequency Tuner Resonance', () => {
    const targetFreq = 87.4;
    const targetAmp = 0.8;
    const targetPhase = 180;

    const checkResonance = (freq: number, amp: number, phase: number) => {
      const freqDiff = Math.abs(freq - targetFreq);
      const ampDiff = Math.abs(amp - targetAmp);
      const phaseDiff = Math.abs(phase - targetPhase);

      const isUnlocked = freqDiff <= 0.6 && ampDiff <= 0.12 && phaseDiff <= 25;
      return { isUnlocked, freqDiff, ampDiff, phaseDiff };
    };

    it('unlocks when values match within calibrated tolerance', () => {
      const match = checkResonance(87.5, 0.78, 175);
      expect(match.isUnlocked).toBe(true);
    });

    it('fails to unlock when frequency is off by more than 0.6 MHz', () => {
      const mismatch = checkResonance(89.0, 0.8, 180);
      expect(mismatch.isUnlocked).toBe(false);
      expect(mismatch.freqDiff).toBeGreaterThan(0.6);
    });

    it('fails to unlock when amplitude is incorrect', () => {
      const mismatch = checkResonance(87.4, 0.4, 180);
      expect(mismatch.isUnlocked).toBe(false);
    });
  });

  describe('Puzzle 2: Ward Cipher Ring Alignment', () => {
    const targetOuter = 90;
    const targetMiddle = 225;
    const targetInner = 315;
    const tolerance = 18;

    const checkWardAlignment = (outer: number, mid: number, inner: number) => {
      const diffAngle = (a: number, b: number) => {
        const d = Math.abs((a % 360) - (b % 360));
        return Math.min(d, 360 - d);
      };

      const outerOk = diffAngle(outer, targetOuter) <= tolerance;
      const midOk = diffAngle(mid, targetMiddle) <= tolerance;
      const innerOk = diffAngle(inner, targetInner) <= tolerance;

      return outerOk && midOk && innerOk;
    };

    it('locks the ward when all 3 concentric rings align with top meridian', () => {
      expect(checkWardAlignment(90, 225, 315)).toBe(true);
    });

    it('tolerates small angular variance within 18 degrees', () => {
      expect(checkWardAlignment(95, 220, 320)).toBe(true);
    });

    it('rejects alignment if even one ring is misaligned', () => {
      expect(checkWardAlignment(90, 225, 180)).toBe(false);
      expect(checkWardAlignment(0, 225, 315)).toBe(false);
    });
  });

  describe('Puzzle 3: Spectral Echo Sequence Memory', () => {
    const targetSequence = [0, 2, 1, 3];

    const validateStep = (currentInputs: number[]): { isCorrectSoFar: boolean; isComplete: boolean } => {
      for (let i = 0; i < currentInputs.length; i++) {
        if (currentInputs[i] !== targetSequence[i]) {
          return { isCorrectSoFar: false, isComplete: false };
        }
      }
      return {
        isCorrectSoFar: true,
        isComplete: currentInputs.length === targetSequence.length,
      };
    };

    it('validates correct partial sequence', () => {
      const res = validateStep([0, 2]);
      expect(res.isCorrectSoFar).toBe(true);
      expect(res.isComplete).toBe(false);
    });

    it('confirms completion when full sequence matches', () => {
      const res = validateStep([0, 2, 1, 3]);
      expect(res.isCorrectSoFar).toBe(true);
      expect(res.isComplete).toBe(true);
    });

    it('detects mistake on wrong tone press', () => {
      const res = validateStep([0, 3]); // Expected 2
      expect(res.isCorrectSoFar).toBe(false);
      expect(res.isComplete).toBe(false);
    });
  });
});
