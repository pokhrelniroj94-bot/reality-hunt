# 👁️ REALITY HUNT — Augmented Reality Psychological Horror

> **Turn your real surroundings into a fictional supernatural investigation.**  
> *Production-oriented cross-platform AR horror game and future AR glasses platform.*

[![Tests](https://img.shields.io/badge/tests-27%20passed-success)](tests/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](tsconfig.json)
[![Three.js](https://img.shields.io/badge/Three.js-0.169-black)](package.json)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple)](vite.config.ts)
[![AR](https://img.shields.io/badge/AR-WebXR%20%7C%20Camera%20%7C%20Simulated-red)](src/ar/)

---

## 🎮 Vision & Highlights

Every supernatural event, broadcast, and entity in **REALITY HUNT** is explicitly and strictly fictional.

1. **Solo Night Campaign (Episode 1: The Visitor)**:
   - A 10–15 minute psychological horror investigation into the abandoned Blackwood Signal Array (Frequency 87.4 MHz).
   - Discover **5 investigative clues** placed in your physical room or simulated 3D environment.
   - Solve **3 original, tactile puzzles**:
     - *Signal Frequency Tuner* (Oscilloscope waveform matching).
     - *Runic Ward Cipher* (Concentric alignment rings).
     - *432 Hz Echo Matrix* (Acoustic resonance memory sequence).
   - Encounter the adaptive fictional entity **The Visitor**, reacting dynamically to player gaze, flashlight battery, and puzzle failures.
   - Reach **3 multi-branching endings**: *The Containment Protocol*, *Tuned Into The Static*, or the secret *Harmonic Vessel*.

2. **Modular AR Architecture**:
   - **Camera Feed Mode**: Live video feed with device orientation gyroscope tracking and WebGL post-processing shaders.
   - **Simulated 3D Room Mode**: High-fidelity Three.js room with flickering lighting, floor chalk runes, and desk props for desktop and camera-off play.
   - **WebXR Mode**: Immersive AR session with hit-testing.
   - **Safe Boundaries**: Seated/indoor play mode with prominent Emergency **STOP** button. Never forces outdoor walking or hazardous movements.

3. **Lightweight AR Glasses HUD**:
   - Designed for future optical see-through glasses (Ray-Ban Meta, Snap Spectacles, Apple Vision Pro, XREAL).
   - Peripheral waveguide layout leaving the center field of view 100% clear.
   - Built-in voice command simulation via Web Speech API.

4. **Procedural Horror Audio Engine**:
   - Web Audio API procedural synthesis: 46 Hz sub-bass drone, dynamic heartbeat oscillator synced to real-time Fear Index, Geiger counter clicks, dissonant cluster stingers, and pure 432 Hz tuning tones.
   - Zero external copyrighted audio assets.

5. **AI Horror Engine with Strict Safety Guardrails**:
   - Radio comms with Field Dispatcher 7.
   - Zod schema validation and content filters preventing real-world threats or claims of real ghosts.
   - Deterministic local scripted fallback ensuring 100% offline playability.

6. **Production Database & Backend**:
   - Complete PostgreSQL / Supabase migration with Row-Level Security (RLS) policies.
   - Public sanitized leaderboard view for competitive Daily Nightmare seeds.

7. **Unity & AR Foundation Migration Package**:
   - Ready-to-use C# source files (`GameStateMachine.cs`, `ARFoundationProvider.cs`, `VisitorEntityAI.cs`).
   - Detailed Android native build guide for Google ARCore.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ (tested on Node v24.15.0 and npm 11.12.1)

### 2. Installation
```bash
cd reality-hunt
npm install
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 27 unit tests validating state transitions, puzzle tolerances, clue solvability, endings, and AI safety.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build Production Bundle
```bash
npm run build
```
Generates optimized, tree-shaken static assets in `dist/`.

---

## 📁 Project Directory Structure

```
reality-hunt/
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript compilation config
├── vite.config.ts             # Vite development & build setup
├── vitest.config.ts           # Vitest unit test runner config
├── index.html                 # Main entrypoint with horror styling
├── .env.example               # Environment variables template
├── src/
│   ├── main.tsx               # React root mount
│   ├── App.tsx                # Master UI state orchestrator
│   ├── types/                 # Game, AR, Puzzle, AI TypeScript interfaces
│   ├── core/                  # Deterministic state machine, EventBus, StorageManager
│   ├── audio/                 # Procedural Web Audio horror synthesis engine
│   ├── ar/                    # ARManager, CameraFeed, SimulatedRoom, WebXR
│   │   └── glasses/           # ARGlassesAdapter, GlassesSimulator, GlassesHUD
│   ├── entity/                # The Visitor entity state machine & Three.js particle renderer
│   ├── puzzles/               # FrequencyPuzzle, WardCipherPuzzle, EchoSequencePuzzle
│   ├── ai/                    # AIDialogueService, SafetyGuardrails, ScriptedFallback
│   ├── story/                 # Episode1TheVisitor, ClueDefinitions, Endings
│   └── components/
│       ├── HUD/               # InvestigationHUD, FearRadar, BatterySanityGauge
│       └── Views/             # MainMenu, Briefing, ARInvestigation, EvidenceBoard,
│                              # Inventory, Dialogue, Result, DailyNightmare,
│                              # MultiplayerLobby, Settings, Store
├── server/
│   └── server.ts              # Node/Express API server with rate-limiting
├── supabase/
│   ├── migrations/            # PostgreSQL schema with Row-Level Security
│   └── seed.sql               # Starter episode & clue seed data
├── unity-migration/
│   ├── Android_Build_Guide.md # Android ARCore native build instructions
│   └── Scripts/               # C# classes for Unity AR Foundation
├── docs/
│   ├── ARCHITECTURE.md        # System architecture & Mermaid flowcharts
│   ├── API_DOCUMENTATION.md   # REST endpoints & Supabase schema specs
│   ├── PRIVACY_POLICY.md      # Zero-video-upload camera privacy policy
│   ├── TERMS_OF_SERVICE.md    # Code of safety & supernatural fiction disclaimer
│   ├── QA_CHECKLIST.md        # Reproducible test checklist
│   └── ROADMAP.md             # Production milestones & glasses integration
└── tests/
    ├── stateMachine.test.ts   # State transition unit tests
    ├── puzzles.test.ts        # 3 puzzle mechanics unit tests
    ├── clues.test.ts          # Spatial placement & solvability tests
    ├── endings.test.ts        # Score bonuses & ending conditions tests
    └── aiSafety.test.ts       # Moderation & schema validation tests
```

---

## 🛡️ Safety & Responsible Design

- **Explicit Fiction**: The game never claims or implies that ghosts or supernatural entities are real.
- **Physical Safety**: The game supports indoor and seated play. Clues spawn within safe, reachable bounds (< 4.5m) and never require running or approaching roads.
- **Privacy by Default**: Video streams and microphone audio are processed on-device and never saved or transmitted.
- **Immediate Stop Button**: The prominent red STOP button on the HUD halts all video and audio processing instantly.
