import { describe, it, expect } from 'vitest';
import { EPISODE_1_CLUES } from '../src/story/ClueDefinitions';

describe('Episode 1 Clues Solvability & Placement Tests', () => {
  it('contains exactly five mandatory investigative clues', () => {
    expect(EPISODE_1_CLUES.length).toBe(5);
  });

  it('every clue has a unique ID, non-empty description, and valid tag', () => {
    const ids = new Set<string>();
    EPISODE_1_CLUES.forEach((clue) => {
      expect(ids.has(clue.id)).toBe(false);
      ids.add(clue.id);

      expect(clue.name.length).toBeGreaterThan(3);
      expect(clue.description.length).toBeGreaterThan(10);
      expect(clue.lore.length).toBeGreaterThan(10);
      expect(clue.tag.length).toBeGreaterThan(2);
    });
  });

  it('all 3D clue world positions are placed within safe indoor boundaries (within 4 meters)', () => {
    EPISODE_1_CLUES.forEach((clue) => {
      const [x, y, z] = clue.worldPosition;
      const distanceFromOrigin = Math.sqrt(x * x + y * y + z * z);

      // Ensures clues are reachable from seated / indoor position without dangerous movement
      expect(distanceFromOrigin).toBeLessThanOrEqual(4.5);
      // Floor or desk height (between 0.0m and 1.8m)
      expect(y).toBeGreaterThanOrEqual(0.0);
      expect(y).toBeLessThanOrEqual(1.8);
    });
  });

  it('contains keys to all three required puzzles', () => {
    const puzzleKeys = EPISODE_1_CLUES.map((c) => c.puzzleKey).filter(Boolean);
    expect(puzzleKeys).toContain('FREQUENCY_TUNER');
    expect(puzzleKeys).toContain('WARD_CIPHER');
    expect(puzzleKeys).toContain('ECHO_SEQUENCE');
  });
});
