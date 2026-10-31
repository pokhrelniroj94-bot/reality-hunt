export type GameState =
  | 'BOOT'
  | 'MENU'
  | 'TUTORIAL'
  | 'EPISODE_SELECT'
  | 'BRIEFING'
  | 'EXPLORATION'
  | 'CLUE_DISCOVERY'
  | 'PUZZLE'
  | 'ENCOUNTER'
  | 'RESULT'
  | 'PAUSE'
  | 'FAILURE';

export type GameMode = 'SOLO_NIGHT' | 'HUNT_WITH_FRIENDS' | 'DAILY_NIGHTMARE';

export type IntensityLevel = 'MILD' | 'STANDARD' | 'NIGHTMARE';

export interface PlayerSettings {
  masterVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  heartbeatVolume: number;
  subtitles: boolean;
  reducedMotion: boolean;
  cameraOffMode: boolean;
  seatedMode: boolean;
  brightness: number;
  intensity: IntensityLevel;
  glassesMode: boolean;
  voiceInteraction: boolean;
}

export interface ClueItem {
  id: string;
  name: string;
  tag: string;
  description: string;
  lore: string;
  found: boolean;
  timestamp?: number;
  worldPosition: [number, number, number];
  icon: string;
  puzzleKey?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'tool' | 'relic' | 'document' | 'key';
  usableInPuzzle?: string;
  quantity: number;
}

export interface Objective {
  id: string;
  text: string;
  completed: boolean;
  optional?: boolean;
}

export interface EpisodeData {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Nightmare';
  description: string;
  briefingAudioTranscript: string;
  clues: ClueItem[];
  objectives: Objective[];
  endings: Record<string, EpisodeEnding>;
}

export interface EpisodeEnding {
  id: string;
  title: string;
  tagline: string;
  description: string;
  narrativeConclusion: string;
  scoreBonus: number;
  badgeId: string;
}

export interface InvestigationMetrics {
  startTime: number;
  endTime?: number;
  cluesDiscovered: number;
  totalClues: number;
  puzzlesSolved: number;
  totalPuzzles: number;
  fearSpikesCount: number;
  maxFearLevel: number;
  flashlightUsageSeconds: number;
  endingAchieved?: string;
  calculatedScore: number;
}

export interface UserProfile {
  id: string;
  username: string;
  isGuest: boolean;
  level: number;
  experience: number;
  totalHunts: number;
  victories: number;
  nightmareStreak: number;
  unlockedBadges: string[];
  settings: PlayerSettings;
}
