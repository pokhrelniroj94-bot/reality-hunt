import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateMachine } from '../src/core/GameStateMachine';

describe('GameStateMachine Unit Tests', () => {
  let sm: GameStateMachine;

  beforeEach(() => {
    sm = new GameStateMachine('BOOT');
  });

  it('initializes in BOOT state', () => {
    expect(sm.getState()).toBe('BOOT');
  });

  it('allows valid transition from BOOT to MENU', () => {
    const success = sm.transition('MENU');
    expect(success).toBe(true);
    expect(sm.getState()).toBe('MENU');
    expect(sm.getPreviousState()).toBe('BOOT');
  });

  it('rejects invalid direct transition from BOOT to EXPLORATION', () => {
    const success = sm.transition('EXPLORATION');
    expect(success).toBe(false);
    expect(sm.getState()).toBe('BOOT'); // Must stay in BOOT
  });

  it('supports full normal mission loop: MENU -> BRIEFING -> EXPLORATION -> PUZZLE -> RESULT -> MENU', () => {
    expect(sm.transition('MENU')).toBe(true);
    expect(sm.transition('BRIEFING')).toBe(true);
    expect(sm.transition('EXPLORATION')).toBe(true);
    expect(sm.transition('PUZZLE')).toBe(true);
    expect(sm.transition('RESULT')).toBe(true);
    expect(sm.transition('MENU')).toBe(true);
    expect(sm.getState()).toBe('MENU');
  });

  it('supports pause and resume during exploration', () => {
    sm.transition('MENU');
    sm.transition('BRIEFING');
    sm.transition('EXPLORATION');

    expect(sm.transition('PAUSE')).toBe(true);
    expect(sm.getState()).toBe('PAUSE');

    expect(sm.transition('EXPLORATION')).toBe(true);
    expect(sm.getState()).toBe('EXPLORATION');
  });

  it('notifies subscribers upon state change', () => {
    let callCount = 0;
    let recordedTo = '';

    const unsubscribe = sm.subscribe((from, to) => {
      callCount++;
      recordedTo = to;
    });

    sm.transition('MENU');
    expect(callCount).toBe(1);
    expect(recordedTo).toBe('MENU');

    unsubscribe();
    sm.transition('BRIEFING');
    expect(callCount).toBe(1); // Should not increase after unsubscribe
  });
});
