# REALITY HUNT — API & BACKEND SPECIFICATION

This document details the REST endpoints, payload schemas, rate limits, and Supabase database integration for REALITY HUNT.

---

## 1. REST Endpoints

### 1.1 Health Check
- **Endpoint**: `GET /api/health`
- **Description**: Returns service health status, engine version, and confirmation of fictional disclaimer enforcement.
- **Response**:
```json
{
  "status": "ONLINE",
  "service": "Reality Hunt Telemetry & AI Dialogue Server",
  "fictionalDisclaimerEnforced": true,
  "timestamp": "2026-10-31T12:00:00.000Z"
}
```

---

### 1.2 AI Dialogue Transmission
- **Endpoint**: `POST /api/ai-dialogue`
- **Rate Limit**: 1 request per 2,500ms per client IP (HTTP 429 returned if exceeded).
- **Request Body**:
```json
{
  "episodeId": "EPISODE_01_THE_VISITOR",
  "gamePhase": "EXPLORATION",
  "currentObjective": "Discover 5 anomalous clues",
  "foundClues": ["CLUE_CASSETTE", "CLUE_FROST_RESIDUE"],
  "solvedPuzzles": ["PUZZLE_FREQUENCY_87_4"],
  "fearLevel": 0.45,
  "playerInput": "Dispatcher 7, how do I align the floor ward?",
  "conversationHistory": []
}
```

- **Successful Response (200 OK)**:
```json
{
  "speaker": "Dispatcher 7",
  "message": "The frost inscription responds to three concentric frequencies. Align the outer rune with the meridian marker at the top.",
  "tensionLevel": "moderate",
  "soundTrigger": "static_burst",
  "suggestedAction": "Align Runic Ward rings",
  "isFictionalDisclaimerEnforced": true
}
```

- **Moderation Blocked Response (400 Bad Request)**:
```json
{
  "speaker": "System Protocol",
  "message": "Transmission blocked: Non-compliant phrase detected. Remember all investigations are strictly fictional simulation.",
  "tensionLevel": "low",
  "isFictionalDisclaimerEnforced": true
}
```

---

## 2. Supabase / PostgreSQL Tables & Row-Level Security

All tables are secured with PostgreSQL Row-Level Security (RLS) policies:

| Table Name | Description | Access Rules |
| :--- | :--- | :--- |
| `rh_profiles` | User profile, level, settings, badges | `auth.uid() = id` (User read/write only) |
| `rh_episodes` | Story catalog and metadata | Public read-only |
| `rh_player_missions` | Mission progression, scores, endings | `auth.uid() = user_id` |
| `rh_clues` | Clue catalog and lore | Public read-only |
| `rh_player_clues` | Discovered clue instances | `auth.uid() = user_id` |
| `rh_player_puzzle_progress` | Puzzle completion metrics | `auth.uid() = user_id` |
| `rh_daily_challenges` | Daily seeds and active mutators | Public read-only |
| `rh_leaderboard_entries` | Verified competitive challenge runs | Private table; exposed via sanitized view |
| `rh_public_leaderboard` | Public sanitized view | Masks UUIDs; exposes rank, username, score |
| `rh_purchases` | Billing receipts & cosmetic unlocks | `auth.uid() = user_id` |

---

## 3. Data Retention & Privacy Policy

1. **Camera Feed**: Raw camera frames and video streams are processed exclusively in client-side WebGL memory and are never uploaded, stored, or transmitted to any server.
2. **Microphone Audio**: When voice interaction is enabled, speech is parsed locally or through standard OS speech recognition APIs. Raw audio files are never stored.
3. **Account Deletion**: Players can immediately purge all cloud and local progress via the "Clear All Local Data" button in Settings or by executing a GDPR deletion request against the Supabase backend.
