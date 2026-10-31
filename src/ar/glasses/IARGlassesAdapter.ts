export interface VoiceCommand {
  phrase: string;
  action: 'SCAN_FREQUENCY' | 'TOGGLE_RADAR' | 'INSPECT_CLUE' | 'EMERGENCY_STOP' | 'READ_OBJECTIVE';
  confidence: number;
}

export interface IARGlassesAdapter {
  readonly deviceModel: string;
  readonly isConnected: boolean;
  readonly fovDegrees: number;
  readonly supportsVoice: boolean;

  connect(): Promise<boolean>;
  disconnect(): void;
  sendGlanceableObjective(text: string): void;
  updateFearIndicator(fearPercent: number, distanceMeters: number): void;
  sendAudioCue(cueType: 'whisper_left' | 'whisper_right' | 'pulse' | 'alarm'): void;
  startVoiceListening(onCommand: (cmd: VoiceCommand) => void): void;
  stopVoiceListening(): void;
}
