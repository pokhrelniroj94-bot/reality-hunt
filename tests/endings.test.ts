import { describe, it, expect } from 'vitest';
import { EPISODE_1_ENDINGS } from '../src/story/Endings';

describe('Episode 1 Endings & Scoring Logic Tests', () => {
  it('defines at least two meaningful endings plus secret and abort endings', () => {
    expect(EPISODE_1_ENDINGS.ENDING_SEAL).toBeDefined();
    expect(EPISODE_1_ENDINGS.ENDING_ASSIMILATION).toBeDefined();
    expect(EPISODE_1_ENDINGS.ENDING_VESSEL).toBeDefined();
    expect(EPISODE_1_ENDINGS.ENDING_FAILED).toBeDefined();
  });

  it('all endings provide distinct narrative conclusions and score bonuses', () => {
    const titles = new Set<string>();
    const conclusions = new Set<string>();

    Object.values(EPISODE_1_ENDINGS).forEach((ending) => {
      expect(titles.has(ending.title)).toBe(false);
      titles.add(ending.title);

      expect(conclusions.has(ending.narrativeConclusion)).toBe(false);
      conclusions.add(ending.narrativeConclusion);

      expect(ending.scoreBonus).toBeGreaterThanOrEqual(200);
      expect(ending.badgeId.startsWith('BADGE_')).toBe(true);
    });
  });

  it('highest score bonus belongs to secret vessel ending', () => {
    expect(EPISODE_1_ENDINGS.ENDING_VESSEL.scoreBonus).toBeGreaterThan(
      EPISODE_1_ENDINGS.ENDING_SEAL.scoreBonus
    );
    expect(EPISODE_1_ENDINGS.ENDING_SEAL.scoreBonus).toBeGreaterThan(
      EPISODE_1_ENDINGS.ENDING_ASSIMILATION.scoreBonus
    );
  });
});
