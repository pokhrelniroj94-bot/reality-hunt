import { AIDialogueRequest, AIDialogueResponse } from '../types/ai';

export class ScriptedFallback {
  public static getResponse(request: AIDialogueRequest): AIDialogueResponse {
    const { foundClues, solvedPuzzles, fearLevel, playerInput } = request;
    const inputLower = playerInput.toLowerCase();

    // 1. Direct player command or question responses
    if (inputLower.includes('help') || inputLower.includes('what should i do')) {
      if (foundClues.length < 5) {
        return {
          speaker: 'Dispatcher 7',
          message:
            'Use your scanner to sweep the containment space. Look for thermal anomalies, damaged audio reels, and runic floor markings.',
          tensionLevel: 'low',
          suggestedAction: 'Scan room perimeter for remaining clues',
          isFictionalDisclaimerEnforced: true,
        };
      } else if (!solvedPuzzles.includes('PUZZLE_FREQUENCY_87_4')) {
        return {
          speaker: 'Dispatcher 7',
          message:
            'You have all the clues. Now open the frequency tuner and calibrate the 87.4 MHz carrier to decode the broadcast.',
          tensionLevel: 'moderate',
          suggestedAction: 'Open Frequency Tuner from Inventory',
          isFictionalDisclaimerEnforced: true,
        };
      } else if (!solvedPuzzles.includes('PUZZLE_WARD_CIPHER')) {
        return {
          speaker: 'Dispatcher 7',
          message:
            'The broadcast decoded! Now align the 3 concentric ward rings on the floor before the entity crosses the threshold!',
          tensionLevel: 'high',
          suggestedAction: 'Align the Runic Ward',
          isFictionalDisclaimerEnforced: true,
        };
      }
    }

    if (inputLower.includes('who are you') || inputLower.includes('identify')) {
      return {
        speaker: 'Dispatcher 7',
        message:
          'This is Dispatcher 7 from the Bureau of Occult Telemetry. I am monitoring your frequency remotely. Everything you encounter is a localized spatial distortion.',
        tensionLevel: 'low',
        isFictionalDisclaimerEnforced: true,
      };
    }

    // 2. State-driven scripted narrative responses
    if (fearLevel > 0.75) {
      return {
        speaker: 'The Static Voice',
        message:
          'We hear your receiver humming... why do you resist the harmony? Align your senses with the void...',
        tensionLevel: 'critical',
        soundTrigger: 'whisper',
        suggestedAction: 'Do not look directly at the entity; complete the ward seal',
        isFictionalDisclaimerEnforced: true,
      };
    }

    if (solvedPuzzles.includes('PUZZLE_WARD_CIPHER')) {
      return {
        speaker: 'Dispatcher 7',
        message:
          'Incredible work! The ward runes are locking into place. The dimensional tear is collapsing. Stand firm!',
        tensionLevel: 'moderate',
        soundTrigger: 'chime',
        suggestedAction: 'Prepare for containment confirmation',
        isFictionalDisclaimerEnforced: true,
      };
    }

    if (foundClues.length >= 3) {
      return {
        speaker: 'Dispatcher 7',
        message:
          'Warning: Anomaly density is rising. The Visitor is actively tracking your signal. Keep your flashlight sweeping and maintain your composure.',
        tensionLevel: 'high',
        soundTrigger: 'heartbeat_spike',
        suggestedAction: 'Locate the remaining clues and prepare the tuning fork',
        isFictionalDisclaimerEnforced: true,
      };
    }

    // Default briefing line
    return {
      speaker: 'Dispatcher 7',
      message:
        'Telemetry confirmed. Atmospheric pressure is dropping. Stay within the safe play boundary and document all anomalous artifacts.',
      tensionLevel: 'low',
      suggestedAction: 'Investigate the room using your radar scanner',
      isFictionalDisclaimerEnforced: true,
    };
  }
}
