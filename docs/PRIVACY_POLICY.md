# REALITY HUNT — PRIVACY POLICY

**Effective Date:** October 31, 2026  
**Platform:** Mobile (Android / iOS), Web, and Optical AR Glasses  

At REALITY HUNT ("we", "our", "us"), we prioritize player privacy, transparent data handling, and strict user safety. This Privacy Policy outlines what information we collect, how it is used, and how your data is protected.

---

## 1. Camera & Sensor Data (Least Privilege)
- **Real-Time Video Frames**: REALITY HUNT uses your device's camera strictly to project fictional supernatural artifacts and entities into your physical environment.
- **Zero Video Uploads**: **We do NOT record, save, stream, or upload raw camera footage or photographs to our servers.** All AR computer vision and rendering occur locally and ephemerally in your device's volatile memory.
- **Orientation & Gyroscope**: Gyroscope and accelerometer data are used solely to orient virtual 3D models in alignment with your physical device movement. This telemetry is never stored remotely.

---

## 2. Voice & Microphone Telemetry
- Voice interaction (such as querying Dispatcher 7 or voice commands on smart glasses) is strictly opt-in and requires explicit permission.
- Voice processing is performed locally on-device or via secure operating system speech recognition APIs. Raw audio recordings are never stored on persistent storage.
- Text alternatives are provided for every single voice interaction in the game.

---

## 3. Account Data & Game Progress
- **Guest Mode**: Guest players store all progress (clues found, badges unlocked, settings) exclusively in local device storage (`localStorage`).
- **Authenticated Accounts**: When signed in via Supabase, progress, scores, and purchased cosmetics are secured via encrypted PostgreSQL tables with Row-Level Security (RLS). You only have access to your own private records.
- **Public Leaderboards**: Leaderboard entries display only your chosen username, level, and game score. Personal identifiers, emails, and UUIDs are masked.

---

## 4. Children's Privacy (COPPA & GDPR-K Compliance)
REALITY HUNT is designed as a psychological horror experience and is age-gated for players 13 and older (or 16 where required by local law). We do not knowingly collect personal data from children under 13.

---

## 5. User Data Deletion & Rights
You have the permanent right to:
1. Purge all local save data instantly via the **Clear Save Data** button in the Settings menu.
2. Request full deletion of your online account and associated telemetry by contacting support or invoking account deletion in-app.
