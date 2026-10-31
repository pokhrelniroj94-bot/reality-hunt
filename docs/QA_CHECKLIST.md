# REALITY HUNT — QUALITY ASSURANCE CHECKLIST & TEST SUITE

This QA checklist provides reproducible verification procedures for all gameplay systems, fallback modes, accessibility features, and edge cases.

---

## 1. Automated Test Suite Summary
Run tests using: `npm test`

- [x] **State Machine Validation** (`tests/stateMachine.test.ts`)
  - [x] Boot -> Menu initialization
  - [x] Exploration -> Pause -> Exploration
  - [x] Invalid transition rejection
  - [x] Hook listener lifecycle & unsubscription
- [x] **Puzzles Verification** (`tests/puzzles.test.ts`)
  - [x] Frequency Tuner tolerance limits (±0.6 MHz, ±0.12 Amp, ±25° Phase)
  - [x] Ward Cipher angular normalization and concentric ring alignment (±18°)
  - [x] Spectral Echo Matrix memory sequence matching and retry tracking
- [x] **Clue Solvability** (`tests/clues.test.ts`)
  - [x] 5 unique, non-colliding clue definitions
  - [x] Safe 3D spatial boundaries (all coordinates < 4.5m distance from player)
  - [x] Valid mapping to puzzle keys
- [x] **Endings & Scoring** (`tests/endings.test.ts`)
  - [x] Endings A, B, C and Aborted condition handling
  - [x] Badge award logic and score calculations
- [x] **AI Safety & Moderation** (`tests/aiSafety.test.ts`)
  - [x] Regex pattern blocking for real-world threats and real ghost claims
  - [x] Schema structure validation on outgoing payloads
  - [x] Local deterministic scripted fallback behavior

---

## 2. Interactive Manual QA Verification Checklist

### 2.1 Hardware & Sensor Fallbacks
- [ ] **Camera Permission Granted**: Verify live video feed overlay, orientation gyro tracking, and Three.js transparent scene sync.
- [ ] **Camera Permission Denied / Desktop / Camera-Off**: Verify automatic seamless fallback to the 3D Simulated Room with flickering overhead lights, desk props, and touch/drag orbit.
- [ ] **Low-Light / Flashlight Test**: Toggle flashlight button on HUD; confirm spotlight illuminates 3D clues and surfaces. Verify battery percentage decays gradually.
- [ ] **Emergency Stop Button**: Tap the red STOP button on the HUD at any point; verify immediate cessation of audio and return to debriefing screen.

### 2.2 Gameplay Flow (Episode 1: The Visitor)
- [ ] Tap **Solo Night** on Main Menu -> Briefing view displays objectives and audio tape.
- [ ] Tap **Commence AR Investigation** -> Enters 3D investigation room.
- [ ] Inspect desk: Tap **Damaged Reel #87.4** -> Plays audio chime, increments clue counter (1/5).
- [ ] Inspect floor: Tap **Frost Ward Circle** -> Triggers concentric ward cipher puzzle.
- [ ] Inspect desk: Tap **Blueprint** -> Increments clue counter.
- [ ] Inspect desk: Tap **Tuning Fork** -> Triggers 432 Hz Echo Matrix puzzle.
- [ ] Inspect wall: Tap **Polaroid** -> Discovers all 5 clues.
- [ ] Solve Frequency Puzzle (adjust sliders to 87.4 MHz, 0.8 Amp, 180° Phase) -> Waveform locks green, unlocks objective.
- [ ] Solve Ward Cipher Puzzle (rotate outer to 90°, middle to 225°, inner to 315°) -> Ward anchors, banishes Visitor, triggers Ending A ("The Containment Protocol").

### 2.3 Audio Engine Verification
- [ ] Confirm low-frequency sub-bass drone is audible.
- [ ] Verify dynamic heartbeat tempo increases as Fear Index rises.
- [ ] Verify Geiger counter crackle rate increases when approaching clues or entity.
- [ ] Test Mute and Volume sliders in Settings; confirm audio buses scale accordingly.

### 2.4 AR Glasses Simulator Mode
- [ ] Tap Glasses icon in top bar -> Activates high-contrast monochrome peripheral HUD.
- [ ] Verify center field of view remains 100% unobstructed.
- [ ] Verify speech recognition parses commands ("scan frequency", "stop").
