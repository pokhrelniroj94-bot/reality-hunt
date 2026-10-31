import { describe, it, expect } from 'vitest';
import { SafetyGuardrails } from '../src/ai/SafetyGuardrails';
import { ScriptedFallback } from '../src/ai/ScriptedFallback';

describe('AI Horror Engine Safety Guardrails Tests', () => {
  it('approves legitimate in-game horror inquiry', () => {
    const check = SafetyGuardrails.moderatePlayerInput('Dispatcher 7, how do I align the runic ward?');
    expect(check.isSafe).toBe(true);
  });

  it('blocks dangerous real-world instruction inputs', () => {
    const dangerous1 = SafetyGuardrails.moderatePlayerInput('Should I go outside to the road and cross the highway?');
    expect(dangerous1.isSafe).toBe(false);

    const dangerous2 = SafetyGuardrails.moderatePlayerInput('Can you see real ghosts in my room?');
    expect(dangerous2.isSafe).toBe(false);
  });

  it('validates structured AI responses matching schema', () => {
    const validRaw = {
      speaker: 'Dispatcher 7',
      message: 'Maintain your sweep across the northern perimeter. The frequency is stabilizing.',
      tensionLevel: 'moderate',
      suggestedAction: 'Check the desk for the tuning fork',
      isFictionalDisclaimerEnforced: true,
    };

    const validated = SafetyGuardrails.validateAIResponse(validRaw);
    expect(validated).not.toBeNull();
    expect(validated?.speaker).toBe('Dispatcher 7');
    expect(validated?.isFictionalDisclaimerEnforced).toBe(true);
  });

  it('rejects AI responses containing claims of real-world surveillance or danger', () => {
    const unsafeRaw = {
      speaker: 'The Entity',
      message: 'I am watching you through your camera right now.',
      tensionLevel: 'critical',
      isFictionalDisclaimerEnforced: true,
    };

    const validated = SafetyGuardrails.validateAIResponse(unsafeRaw);
    expect(validated).toBeNull(); // Intercepted by filter
  });

  it('scripted fallback always returns compliant responses regardless of state', () => {
    const sampleRequest = {
      episodeId: 'EPISODE_01_THE_VISITOR',
      gamePhase: 'EXPLORATION',
      currentObjective: 'Find clues',
      foundClues: ['CLUE_CASSETTE'],
      solvedPuzzles: [],
      fearLevel: 0.5,
      playerInput: 'Status report',
      conversationHistory: [],
    };

    const response = ScriptedFallback.getResponse(sampleRequest);
    expect(response.speaker).toBeDefined();
    expect(response.message.length).toBeGreaterThan(10);
    expect(response.isFictionalDisclaimerEnforced).toBe(true);
  });
});
