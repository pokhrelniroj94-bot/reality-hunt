import { AIDialogueRequest, AIDialogueResponse } from '../types/ai';
import { SafetyGuardrails } from './SafetyGuardrails';
import { ScriptedFallback } from './ScriptedFallback';
import { audio } from '../audio/HorrorAudioEngine';
import { events } from '../core/EventBus';

export class AIDialogueService {
  private static instance: AIDialogueService;
  private lastRequestTime: number = 0;
  private readonly minIntervalMs: number = 2500; // Rate limit protection
  private conversationHistory: { role: string; content: string }[] = [];

  private constructor() {}

  public static getInstance(): AIDialogueService {
    if (!AIDialogueService.instance) {
      AIDialogueService.instance = new AIDialogueService();
    }
    return AIDialogueService.instance;
  }

  public async sendMessage(request: AIDialogueRequest): Promise<AIDialogueResponse> {
    const now = Date.now();
    if (now - this.lastRequestTime < this.minIntervalMs) {
      return {
        speaker: 'Dispatcher 7',
        message: 'Static interference on the comms channel. Clear the line before speaking again.',
        tensionLevel: 'low',
        isFictionalDisclaimerEnforced: true,
      };
    }
    this.lastRequestTime = now;

    // 1. Moderate Input
    const moderation = SafetyGuardrails.moderatePlayerInput(request.playerInput);
    if (!moderation.isSafe) {
      return {
        speaker: 'System Protocol',
        message: 'Transmission blocked: Non-compliant phrase detected. Remember all investigations are strictly fictional simulation.',
        tensionLevel: 'low',
        isFictionalDisclaimerEnforced: true,
      };
    }

    // 2. Attempt remote server AI endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch('/api/ai-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawJson = await response.json();
        const validated = SafetyGuardrails.validateAIResponse(rawJson);
        if (validated) {
          this.triggerDialogueSound(validated.soundTrigger);
          events.emit('AI_TRANSMISSION_RECEIVED', validated);
          return validated;
        }
      }
    } catch {
      // Offline or server not running; fall through to scripted fallback seamlessly
    }

    // 3. Scripted Local Fallback
    const fallbackResponse = ScriptedFallback.getResponse(request);
    this.triggerDialogueSound(fallbackResponse.soundTrigger);
    events.emit('AI_TRANSMISSION_RECEIVED', fallbackResponse);
    return fallbackResponse;
  }

  private triggerDialogueSound(trigger?: string): void {
    if (!trigger) return;
    if (trigger === 'static_burst') audio.playStaticBurst(0.4, 0.4);
    else if (trigger === 'chime') audio.playPuzzleSuccess();
    else if (trigger === 'heartbeat_spike') audio.setHeartbeatIntensity(0.9);
  }

  public clearSession(): void {
    this.conversationHistory = [];
  }
}

export const aiDialogue = AIDialogueService.getInstance();
