import { events } from '../core/EventBus';
import { audio } from '../audio/HorrorAudioEngine';

export type EntityBehaviorState = 'DORMANT' | 'STALKING' | 'MANIFESTING' | 'HUNTING' | 'BANISHED';

export interface EntityMetrics {
  state: EntityBehaviorState;
  distance: number; // in meters (0 to 12)
  fearLevel: number; // 0.0 (calm) to 1.0 (panic)
  glitchIntensity: number;
  isDirectlyLookedAt: boolean;
  timeInCurrentState: number;
}

export class VisitorEntity {
  private state: EntityBehaviorState = 'DORMANT';
  private distance: number = 8.5; // Start far away
  private fearLevel: number = 0.05;
  private timeInCurrentState: number = 0;

  // Reactivity variables
  private flashlightReactionTimer: number = 0;
  private clueProgressMultiplier: number = 1.0;
  private isLookedAt: boolean = false;
  private difficultyFactor: number = 1.0; // Mild = 0.7, Standard = 1.0, Nightmare = 1.4

  // Audio & Event throttle
  private lastStingerTime: number = 0;

  constructor(difficultyFactor: number = 1.0) {
    this.difficultyFactor = difficultyFactor;
  }

  public getState(): EntityBehaviorState {
    return this.state;
  }

  public getDistance(): number {
    return this.distance;
  }

  public getFearLevel(): number {
    return this.fearLevel;
  }

  public setDifficulty(factor: number): void {
    this.difficultyFactor = factor;
  }

  public onClueDiscovered(clueCount: number, totalClues: number): void {
    // Each clue discovery agitates The Visitor
    this.clueProgressMultiplier = 1.0 + (clueCount / totalClues) * 0.8;
    this.fearLevel = Math.min(1.0, this.fearLevel + 0.12 * this.difficultyFactor);

    if (this.state === 'DORMANT') {
      this.transitionTo('STALKING');
    } else if (clueCount >= 3 && this.state === 'STALKING') {
      this.transitionTo('MANIFESTING');
    }
  }

  public onPuzzleFailed(): void {
    // Puzzle failure draws entity closer
    this.fearLevel = Math.min(1.0, this.fearLevel + 0.25 * this.difficultyFactor);
    this.distance = Math.max(1.5, this.distance - 2.0);
    audio.playStaticBurst(0.9, 0.8);

    if (this.state !== 'HUNTING') {
      this.transitionTo('HUNTING');
    }
  }

  public onPuzzleSolved(): void {
    // Puzzle success pushes entity back
    this.distance = Math.min(10.0, this.distance + 3.0);
    this.fearLevel = Math.max(0.1, this.fearLevel - 0.2);
    if (this.state === 'HUNTING') {
      this.transitionTo('MANIFESTING');
    }
  }

  public setLookedAt(lookedAt: boolean, flashlightOn: boolean): void {
    this.isLookedAt = lookedAt;

    if (lookedAt && flashlightOn) {
      this.flashlightReactionTimer += 0.05;
      if (this.flashlightReactionTimer > 2.0 && this.state === 'STALKING') {
        // Prolonged direct stare with flashlight triggers manifestation
        this.transitionTo('MANIFESTING');
      }
    } else {
      this.flashlightReactionTimer = Math.max(0, this.flashlightReactionTimer - 0.02);
    }
  }

  public banish(): void {
    this.transitionTo('BANISHED');
    this.fearLevel = 0.0;
    this.distance = 15.0;
  }

  private transitionTo(newState: EntityBehaviorState): void {
    if (this.state === newState) return;
    const oldState = this.state;
    this.state = newState;
    this.timeInCurrentState = 0;

    events.emit('ENTITY_STATE_CHANGED', { from: oldState, to: newState });

    if (newState === 'MANIFESTING') {
      const now = Date.now();
      if (now - this.lastStingerTime > 15000) {
        audio.playEncounterStinger();
        this.lastStingerTime = now;
      }
      this.distance = 3.8;
    } else if (newState === 'HUNTING') {
      audio.playEncounterStinger();
      this.distance = 2.0;
    }
  }

  public update(delta: number, flashlightOn: boolean): EntityMetrics {
    this.timeInCurrentState += delta;

    switch (this.state) {
      case 'DORMANT':
        this.distance = 10.0;
        this.fearLevel = 0.05;
        break;

      case 'STALKING':
        // Creeps slightly closer over time
        this.distance = Math.max(4.5, this.distance - delta * 0.15 * this.clueProgressMultiplier);
        this.fearLevel = Math.min(0.5, 0.15 + (10 - this.distance) * 0.05);

        // Sound cues: geiger clicks based on distance
        audio.setGeigerProximity(1.0 - this.distance / 10);
        break;

      case 'MANIFESTING':
        // Hovering nearby, breathing distortion
        const oscillation = Math.sin(this.timeInCurrentState * 2.0) * 0.3;
        this.distance = Math.max(2.5, 3.5 + oscillation);
        this.fearLevel = Math.min(0.85, 0.5 + (4 - this.distance) * 0.2);

        audio.setGeigerProximity(0.85);

        if (this.timeInCurrentState > 25.0 / this.difficultyFactor) {
          // If player lingers too long without solving ward/frequency, escalates to hunting
          this.transitionTo('HUNTING');
        }
        break;

      case 'HUNTING':
        // Closes in on player
        this.distance = Math.max(1.1, this.distance - delta * 0.4 * this.difficultyFactor);
        this.fearLevel = Math.min(1.0, 0.8 + (2 - this.distance) * 0.2);
        audio.setGeigerProximity(1.0);
        break;

      case 'BANISHED':
        this.distance = 20.0;
        this.fearLevel = 0.0;
        audio.setGeigerProximity(0.0);
        break;
    }

    // Dynamic heartbeat updates with fear level
    audio.setHeartbeatIntensity(this.fearLevel);

    const glitchIntensity =
      this.state === 'HUNTING' ? 0.9 : this.state === 'MANIFESTING' ? 0.45 : this.state === 'STALKING' ? 0.15 : 0.0;

    return {
      state: this.state,
      distance: this.distance,
      fearLevel: this.fearLevel,
      glitchIntensity,
      isDirectlyLookedAt: this.isLookedAt,
      timeInCurrentState: this.timeInCurrentState,
    };
  }
}
