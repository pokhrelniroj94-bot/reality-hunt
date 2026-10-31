export type PuzzleType = 'FREQUENCY_TUNER' | 'WARD_CIPHER' | 'ECHO_SEQUENCE';

export interface FrequencyPuzzleState {
  targetFrequency: number; // e.g. 87.4
  targetAmplitude: number; // e.g. 0.8
  targetPhase: number; // e.g. 180

  currentFrequency: number;
  currentAmplitude: number;
  currentPhase: number;

  tolerance: number;
  isUnlocked: boolean;
  timeRemaining?: number;
}

export interface WardCipherState {
  outerRingAngle: number;
  middleRingAngle: number;
  innerRingAngle: number;

  targetOuterAngle: number;
  targetMiddleAngle: number;
  targetInnerAngle: number;

  toleranceDegrees: number;
  isAligned: boolean;
  activeRunes: string[];
}

export interface EchoSequenceState {
  sequenceLength: number;
  targetTones: number[]; // indices of 0..4
  playerInput: number[];
  isPlayingDemo: boolean;
  currentStep: number;
  isCompleted: boolean;
  attemptsLeft: number;
}

export interface PuzzleResult {
  puzzleId: string;
  puzzleType: PuzzleType;
  success: boolean;
  timeTakenSeconds: number;
  mistakes: number;
  rewardItem?: string;
  unlockedClueId?: string;
}
