import { EpisodeData } from '../types/game';
import { EPISODE_1_CLUES } from './ClueDefinitions';
import { EPISODE_1_ENDINGS } from './Endings';

export const EPISODE_1_DATA: EpisodeData = {
  id: 'EPISODE_01_THE_VISITOR',
  title: 'Episode 1: The Visitor',
  subtitle: 'The Frequency 87.4 Incident',
  estimatedMinutes: 12,
  difficulty: 'Moderate',
  description:
    'You intercept an erratic radio broadcast echoing from a decommissioned research outpost. Local thermal readings have plummeted. An adaptive supernatural entity is slipping through the static. Locate the five investigative clues, calibrate the frequency receiver, align the runic ward, and survive the encounter.',
  briefingAudioTranscript:
    'Dispatcher 7 to Field Investigator: We picked up an anomalous spike on frequency 87.4. All automated telemetry went offline at 02:40 hours. Your scanner is equipped with spatial anomaly tracking. Keep your flashlight charged, watch your fear radar, and do not let the Visitor linger in your field of view. Proceed with extreme caution.',
  clues: EPISODE_1_CLUES,
  objectives: [
    {
      id: 'OBJ_CALIBRATE_RADAR',
      text: 'Calibrate spatial scanner and survey the containment room.',
      completed: false,
    },
    {
      id: 'OBJ_LOCATE_CLUES',
      text: 'Discover 5 supernatural clues hidden within the environment.',
      completed: false,
    },
    {
      id: 'OBJ_SOLVE_FREQUENCY',
      text: 'Tune the receiver to Frequency 87.4 MHz to decode the transmission.',
      completed: false,
    },
    {
      id: 'OBJ_ALIGN_WARD',
      text: 'Align the 3 concentric ward rings to stabilize the spatial breach.',
      completed: false,
    },
    {
      id: 'OBJ_RESONANCE_ECHO',
      text: 'Optional: Harmonize the 432 Hz Tuning Fork using the Echo Sequence.',
      completed: false,
      optional: true,
    },
    {
      id: 'OBJ_SURVIVE_VISITOR',
      text: 'Survive the Visitor’s manifestation and resolve the containment breach.',
      completed: false,
    },
  ],
  endings: EPISODE_1_ENDINGS,
};
