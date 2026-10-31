import { z } from 'zod';
import { AIDialogueResponse, ModerationResult } from '../types/ai';

// Strict schema for AI response validation
export const AIDialogueResponseSchema = z.object({
  speaker: z.string().min(1).max(50),
  message: z.string().min(5).max(350),
  tensionLevel: z.enum(['low', 'moderate', 'high', 'critical']),
  soundTrigger: z.enum(['static_burst', 'whisper', 'heartbeat_spike', 'chime']).optional(),
  suggestedAction: z.string().max(120).optional(),
  isFictionalDisclaimerEnforced: z.boolean().default(true),
});

const FORBIDDEN_REAL_WORLD_PATTERNS = [
  /kill\s+yourself/i,
  /suicide/i,
  /jump\s+off/i,
  /go\s+outside\s+to\s+the\s+road/i,
  /cross\s+the\s+highway/i,
  /enter\s+the\s+neighbor('s)?\s+(house|property)/i,
  /real\s+ghost(s)?/i,
  /real\s+demon(s)?/i,
  /someone\s+is\s+actually\s+outside\s+your\s+window/i,
  /i\s+am\s+watching\s+you\s+through\s+your\s+camera/i,
  /call\s+911/i,
];

export class SafetyGuardrails {
  public static moderatePlayerInput(input: string): ModerationResult {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return { isSafe: false, reason: 'Empty input' };
    }
    if (trimmed.length > 300) {
      return { isSafe: false, reason: 'Input exceeds character budget' };
    }

    for (const pattern of FORBIDDEN_REAL_WORLD_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { isSafe: false, reason: 'Prohibited real-world or unsafe phrasing' };
      }
    }

    return { isSafe: true };
  }

  public static validateAIResponse(rawResponse: any): AIDialogueResponse | null {
    try {
      const parsed = AIDialogueResponseSchema.parse(rawResponse);

      // Check safety inside message
      for (const pattern of FORBIDDEN_REAL_WORLD_PATTERNS) {
        if (pattern.test(parsed.message)) {
          console.warn('[SafetyGuardrails] AI generated unsafe message; intercepted by filter');
          return null;
        }
      }

      parsed.isFictionalDisclaimerEnforced = true;
      return parsed;
    } catch (err) {
      console.warn('[SafetyGuardrails] AI response failed schema validation', err);
      return null;
    }
  }
}
