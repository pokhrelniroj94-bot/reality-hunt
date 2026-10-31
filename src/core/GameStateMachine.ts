import { GameState } from '../types/game';
import { events } from './EventBus';

export type StateChangeHook = (from: GameState, to: GameState, payload?: any) => void;

export class GameStateMachine {
  private currentState: GameState = 'BOOT';
  private previousState: GameState = 'BOOT';
  private hooks: StateChangeHook[] = [];

  // Deterministic valid transition graph
  private validTransitions: Record<GameState, GameState[]> = {
    BOOT: ['MENU'],
    MENU: ['TUTORIAL', 'EPISODE_SELECT', 'BRIEFING', 'SETTINGS' as any, 'STORE' as any, 'MULTIPLAYER' as any, 'DAILY_NIGHTMARE' as any],
    TUTORIAL: ['EXPLORATION', 'MENU'],
    EPISODE_SELECT: ['BRIEFING', 'MENU'],
    BRIEFING: ['EXPLORATION', 'MENU'],
    EXPLORATION: ['CLUE_DISCOVERY', 'PUZZLE', 'ENCOUNTER', 'PAUSE', 'RESULT', 'FAILURE', 'MENU'],
    CLUE_DISCOVERY: ['EXPLORATION', 'PUZZLE', 'ENCOUNTER', 'PAUSE'],
    PUZZLE: ['EXPLORATION', 'CLUE_DISCOVERY', 'ENCOUNTER', 'RESULT', 'FAILURE', 'PAUSE'],
    ENCOUNTER: ['EXPLORATION', 'PUZZLE', 'RESULT', 'FAILURE', 'PAUSE'],
    RESULT: ['MENU', 'EPISODE_SELECT', 'EXPLORATION'],
    PAUSE: ['EXPLORATION', 'CLUE_DISCOVERY', 'PUZZLE', 'ENCOUNTER', 'MENU'],
    FAILURE: ['MENU', 'EXPLORATION', 'BRIEFING']
  };

  constructor(initialState: GameState = 'BOOT') {
    this.currentState = initialState;
    this.previousState = initialState;
  }

  public getState(): GameState {
    return this.currentState;
  }

  public getPreviousState(): GameState {
    return this.previousState;
  }

  public canTransitionTo(nextState: GameState): boolean {
    const allowed = this.validTransitions[this.currentState] || [];
    return allowed.includes(nextState);
  }

  public transition(nextState: GameState, payload?: any): boolean {
    if (this.currentState === nextState) {
      return true; // No-op idempotent
    }

    if (!this.canTransitionTo(nextState)) {
      console.warn(
        `[GameStateMachine] Invalid transition rejected: ${this.currentState} -> ${nextState}`
      );
      return false;
    }

    const from = this.currentState;
    this.previousState = from;
    this.currentState = nextState;

    // Trigger hooks
    this.hooks.forEach((hook) => {
      try {
        hook(from, nextState, payload);
      } catch (err) {
        console.error('[GameStateMachine] Hook execution failed:', err);
      }
    });

    // Broadcast across event bus
    events.emit('STATE_CHANGED', { from, to: nextState, payload });
    return true;
  }

  public subscribe(hook: StateChangeHook): () => void {
    this.hooks.push(hook);
    return () => {
      this.hooks = this.hooks.filter((h) => h !== hook);
    };
  }

  public forceState(state: GameState, payload?: any): void {
    const from = this.currentState;
    this.previousState = from;
    this.currentState = state;
    this.hooks.forEach((hook) => hook(from, state, payload));
    events.emit('STATE_CHANGED', { from, to: state, payload });
  }

  public reset(): void {
    this.currentState = 'MENU';
    this.previousState = 'BOOT';
    events.emit('STATE_CHANGED', { from: 'BOOT', to: 'MENU' });
  }
}
