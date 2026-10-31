export interface AIDialogueMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
  timestamp: number;
}

export interface AIDialogueRequest {
  episodeId: string;
  gamePhase: string;
  currentObjective: string;
  foundClues: string[];
  solvedPuzzles: string[];
  fearLevel: number;
  playerInput: string;
  conversationHistory: AIDialogueMessage[];
}

export interface AIDialogueResponse {
  speaker: string; // e.g. "Dispatcher 7", "The Static Signal"
  message: string;
  tensionLevel: 'low' | 'moderate' | 'high' | 'critical';
  soundTrigger?: 'static_burst' | 'whisper' | 'heartbeat_spike' | 'chime';
  suggestedAction?: string;
  isFictionalDisclaimerEnforced: boolean;
}

export interface ModerationResult {
  isSafe: boolean;
  reason?: string;
}
