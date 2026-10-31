import { EpisodeEnding } from '../types/game';

export const EPISODE_1_ENDINGS: Record<string, EpisodeEnding> = {
  ENDING_SEAL: {
    id: 'ENDING_SEAL',
    title: 'Ending A: The Containment Protocol',
    tagline: 'The Ward Holds. The Frequency Dies.',
    description: 'You synchronized the 87.4 MHz transmission, rotated the concentric ward runes into alignment, and anchored the breach.',
    narrativeConclusion:
      'The harsh static abruptly cuts to dead silence. The crimson tendrils shatter into harmless sparks of ozone. The room warms by six degrees. On your recorder, Dispatcher 7 exhales: "Signal neutralized. Containment holds... for tonight. Pack your gear, Investigator."',
    scoreBonus: 2500,
    badgeId: 'BADGE_WARDSMITH',
  },
  ENDING_ASSIMILATION: {
    id: 'ENDING_ASSIMILATION',
    title: 'Ending B: Tuned Into The Static',
    tagline: 'The Signal Entered Your Sensors.',
    description: 'You surrendered to the anomalous broadcast or failed to align the ward rings before the Visitor fully manifested.',
    narrativeConclusion:
      'The audio screech overwhelms your headset. The shadows peel off the walls, converging onto your lens. The display shudders with impossible geometry. A distorted voice whispers through the speaker: "We have received your frequency." Your device reboots with corrupted memory.',
    scoreBonus: 950,
    badgeId: 'BADGE_STATIC_ECHO',
  },
  ENDING_VESSEL: {
    id: 'ENDING_VESSEL',
    title: 'Ending C: The Harmonic Vessel',
    tagline: 'The Entity Trapped Within The Alloy.',
    description: 'Secret Ending: By striking the 432 Hz tuning fork during maximum manifestation, you captured the Visitor’s resonance.',
    narrativeConclusion:
      'A blinding chord rings across the chamber. The Visitor screams in reverse, its shadowy tendrils spiraling inwards into the tines of the tuning fork. The metal now vibrates warm against your palm, glowing with an eerie amber pulse. You have not merely survived—you have captured a piece of the other side.',
    scoreBonus: 3200,
    badgeId: 'BADGE_RELIC_KEEPER',
  },
  ENDING_FAILED: {
    id: 'ENDING_FAILED',
    title: 'Mission Aborted: Heart Rate Critical',
    tagline: 'Panic Overcame The Investigation.',
    description: 'Your fear index reached critical overload, triggering the emergency neuro-safeguard.',
    narrativeConclusion:
      'Automated safety protocols engaged, cutting the feed and blinding the optical sensors. You retreated into safety before the Visitor made physical contact. The mystery remains buried in the static.',
    scoreBonus: 200,
    badgeId: 'BADGE_SURVIVOR',
  },
};
