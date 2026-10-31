# REALITY HUNT — PRODUCTION ROADMAP & RELEASE PLAN

This roadmap outlines the milestones from the completed MVP through multi-platform AR glasses deployment and live multiplayer networking.

---

## Phase 1: MVP & Core Systems (Completed ✅)
- [x] Deterministic Game State Machine with complete transition graph.
- [x] Full playable First Episode: **"The Visitor — The Frequency 87.4 Incident"**.
- [x] 5 spatial clues with 3D models and interactive raycasting.
- [x] 3 original, logically solvable puzzles (Frequency Tuner, Concentric Ward Cipher, Echo Tone Matrix).
- [x] Adaptive fictional entity **The Visitor** with behavior state machine, tension curve, and dynamic Three.js particle renderer.
- [x] Multi-branching outcomes (Ending A: Containment Protocol, Ending B: Static Assimilation, Ending C: Harmonic Vessel).
- [x] Procedural Web Audio horror synthesis engine (drone, dynamic heartbeat, geiger clicks, stingers).
- [x] Modular AR Provider architecture: WebXR, Camera Feed with gyroscope, and 3D Simulated Room fallback.
- [x] Lightweight AR Glasses Adapter with peripheral waveguide HUD and speech command simulator.
- [x] AI Dialogue service with schema validation, safety guardrails, and deterministic local scripted fallback.
- [x] Supabase PostgreSQL migrations with Row-Level Security and public leaderboard view.
- [x] Automated unit test suite with 100% pass rate across 27 tests.
- [x] Complete Unity C# architecture scripts for native Android ARCore migration.

---

## Phase 2: Native Android & iOS Deployment (Target: Q1 2027)
- [ ] Import Unity C# migration scripts into Unity 2022.3 LTS project.
- [ ] Setup AR Foundation 5.1 with ARCore Depth API for real-world occlusion behind furniture.
- [ ] Integrate Google Play Billing and Apple StoreKit 2 for Season 1 passes and cosmetic flashlight skins.
- [ ] Implement cloud biometric save synchronization via Supabase Auth (Apple / Google Sign-In).

---

## Phase 3: Live Co-Op Investigations (Hunt With Friends) (Target: Q2 2027)
- [ ] Deploy WebSocket / WebRTC state synchronization server for 2–4 player co-op rooms.
- [ ] Implement shared spatial anchors (Azure Spatial Anchors / ARCore Cloud Anchors) so players see clues in the exact same physical spots.
- [ ] Spatial audio voice chat using WebRTC and HRTF (Head-Related Transfer Function).
- [ ] Specialized squad roles: Lead Investigator, Occultist, Signal Tech, Sentry.

---

## Phase 4: AR Glasses Native SDK Integration (Target: Q3 2027)
- [ ] Snap Spectacles OS SDK integration (lens studio native port).
- [ ] Ray-Ban Meta AI & Camera integration via open developer APIs.
- [ ] Apple Vision Pro visionOS port with spatial windowing and hand-tracking rune interaction.
- [ ] XREAL Air 2 Ultra spatial computing support.
