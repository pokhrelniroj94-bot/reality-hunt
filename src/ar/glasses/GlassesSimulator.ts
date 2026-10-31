import { IARGlassesAdapter, VoiceCommand } from './IARGlassesAdapter';
import { events } from '../../core/EventBus';

export class GlassesSimulator implements IARGlassesAdapter {
  public readonly deviceModel: string = 'SpectraLens AR-X (Simulator)';
  public isConnected: boolean = false;
  public readonly fovDegrees: number = 42; // Standard optical waveguide FOV
  public readonly supportsVoice: boolean = true;

  private recognition: any = null;
  private onCommandCallback: ((cmd: VoiceCommand) => void) | null = null;

  public async connect(): Promise<boolean> {
    this.isConnected = true;
    events.emit('GLASSES_CONNECTED', { model: this.deviceModel });
    return true;
  }

  public disconnect(): void {
    this.stopVoiceListening();
    this.isConnected = false;
    events.emit('GLASSES_DISCONNECTED');
  }

  public sendGlanceableObjective(text: string): void {
    events.emit('GLASSES_OBJECTIVE_UPDATE', { text });
  }

  public updateFearIndicator(fearPercent: number, distanceMeters: number): void {
    events.emit('GLASSES_FEAR_UPDATE', { fearPercent, distanceMeters });
  }

  public sendAudioCue(cueType: 'whisper_left' | 'whisper_right' | 'pulse' | 'alarm'): void {
    events.emit('GLASSES_AUDIO_CUE', { cueType });
  }

  public startVoiceListening(onCommand: (cmd: VoiceCommand) => void): void {
    this.onCommandCallback = onCommand;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (e: any) => {
          const last = e.results.length - 1;
          const transcript = e.results[last][0].transcript.trim().toLowerCase();
          const confidence = e.results[last][0].confidence || 0.9;
          this.parseVoiceCommand(transcript, confidence);
        };

        this.recognition.onerror = (e: any) => {
          console.warn('Speech recognition error in glasses adapter', e);
        };

        this.recognition.start();
      } catch (err) {
        console.warn('Speech recognition could not be started', err);
      }
    }
  }

  public parseVoiceCommand(transcript: string, confidence: number = 0.95): void {
    let action: VoiceCommand['action'] | null = null;
    if (transcript.includes('scan') || transcript.includes('frequency') || transcript.includes('signal')) {
      action = 'SCAN_FREQUENCY';
    } else if (transcript.includes('radar') || transcript.includes('proximity')) {
      action = 'TOGGLE_RADAR';
    } else if (transcript.includes('inspect') || transcript.includes('clue') || transcript.includes('examine')) {
      action = 'INSPECT_CLUE';
    } else if (transcript.includes('emergency') || transcript.includes('stop') || transcript.includes('abort')) {
      action = 'EMERGENCY_STOP';
    } else if (transcript.includes('objective') || transcript.includes('mission')) {
      action = 'READ_OBJECTIVE';
    }

    if (action && this.onCommandCallback) {
      this.onCommandCallback({ phrase: transcript, action, confidence });
      events.emit('GLASSES_VOICE_COMMAND', { phrase: transcript, action });
    }
  }

  public stopVoiceListening(): void {
    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
      this.recognition = null;
    }
    this.onCommandCallback = null;
  }
}

export const glassesSimulator = new GlassesSimulator();
