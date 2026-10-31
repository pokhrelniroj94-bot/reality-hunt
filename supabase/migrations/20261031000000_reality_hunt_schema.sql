-- ==============================================================================
-- REALITY HUNT — PRODUCTION DATABASE SCHEMA & ROW-LEVEL SECURITY POLICIES
-- PostgreSQL / Supabase Migration
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.rh_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(32) NOT NULL UNIQUE,
    avatar_url TEXT,
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    total_hunts INTEGER NOT NULL DEFAULT 0,
    victories INTEGER NOT NULL DEFAULT 0,
    nightmare_streak INTEGER NOT NULL DEFAULT 0,
    settings JSONB NOT NULL DEFAULT '{
        "masterVolume": 0.8,
        "sfxVolume": 0.9,
        "ambientVolume": 0.7,
        "heartbeatVolume": 0.85,
        "subtitles": true,
        "reducedMotion": false,
        "cameraOffMode": false,
        "seatedMode": true,
        "brightness": 1.0,
        "intensity": "STANDARD",
        "glassesMode": false,
        "voiceInteraction": false
    }'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Episodes Catalog Table (Publicly readable)
CREATE TABLE IF NOT EXISTS public.rh_episodes (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    subtitle VARCHAR(128) NOT NULL,
    season INTEGER NOT NULL DEFAULT 1,
    episode_order INTEGER NOT NULL DEFAULT 1,
    is_free BOOLEAN NOT NULL DEFAULT FALSE,
    estimated_minutes INTEGER NOT NULL DEFAULT 12,
    difficulty VARCHAR(32) NOT NULL DEFAULT 'Moderate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Player Mission Progress Table (Private per user)
CREATE TABLE IF NOT EXISTS public.rh_player_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    episode_id VARCHAR(64) NOT NULL REFERENCES public.rh_episodes(id),
    status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ABORTED'
    ending_id VARCHAR(64),
    score INTEGER NOT NULL DEFAULT 0,
    clues_found_count INTEGER NOT NULL DEFAULT 0,
    puzzles_solved_count INTEGER NOT NULL DEFAULT 0,
    peak_fear_level NUMERIC(4, 3) NOT NULL DEFAULT 0.0,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT valid_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED', 'ABORTED'))
);

-- 5. Clues Catalog Table
CREATE TABLE IF NOT EXISTS public.rh_clues (
    id VARCHAR(64) PRIMARY KEY,
    episode_id VARCHAR(64) NOT NULL REFERENCES public.rh_episodes(id),
    name VARCHAR(128) NOT NULL,
    tag VARCHAR(64) NOT NULL,
    lore TEXT NOT NULL,
    puzzle_key VARCHAR(64)
);

-- 6. Player Discovered Clues (Private per user)
CREATE TABLE IF NOT EXISTS public.rh_player_clues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.rh_player_missions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    clue_id VARCHAR(64) NOT NULL REFERENCES public.rh_clues(id),
    discovered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (mission_id, clue_id)
);

-- 7. Player Puzzle Progress
CREATE TABLE IF NOT EXISTS public.rh_player_puzzle_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES public.rh_player_missions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    puzzle_id VARCHAR(64) NOT NULL,
    puzzle_type VARCHAR(32) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    time_taken_seconds INTEGER NOT NULL DEFAULT 0,
    mistakes INTEGER NOT NULL DEFAULT 0,
    solved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (mission_id, puzzle_id)
);

-- 8. Achievements Catalog Table
CREATE TABLE IF NOT EXISTS public.rh_achievements (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(64) NOT NULL,
    score_points INTEGER NOT NULL DEFAULT 100
);

-- 9. Player Achievements (Private per user)
CREATE TABLE IF NOT EXISTS public.rh_player_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    achievement_id VARCHAR(64) NOT NULL REFERENCES public.rh_achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, achievement_id)
);

-- 10. Daily Nightmare Challenges
CREATE TABLE IF NOT EXISTS public.rh_daily_challenges (
    id VARCHAR(64) PRIMARY KEY, -- e.g. '2026-10-31'
    seed VARCHAR(64) NOT NULL,
    modifiers JSONB NOT NULL DEFAULT '[]'::jsonb,
    active_date DATE NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Daily Nightmare Leaderboard Entries
CREATE TABLE IF NOT EXISTS public.rh_leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id VARCHAR(64) NOT NULL REFERENCES public.rh_daily_challenges(id),
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    time_taken_seconds INTEGER NOT NULL,
    fear_spikes_count INTEGER NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    submission_signature TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (challenge_id, user_id)
);

-- 12. Purchases Table
CREATE TABLE IF NOT EXISTS public.rh_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.rh_profiles(id) ON DELETE CASCADE,
    item_id VARCHAR(64) NOT NULL,
    item_type VARCHAR(32) NOT NULL, -- 'EPISODE_PASS', 'COSMETIC'
    platform VARCHAR(32) NOT NULL, -- 'PLAY_STORE', 'APP_STORE', 'WEB'
    transaction_receipt TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_player_missions_user ON public.rh_player_missions(user_id);
CREATE INDEX IF NOT EXISTS idx_player_clues_mission ON public.rh_player_clues(mission_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_challenge ON public.rh_leaderboard_entries(challenge_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.rh_purchases(user_id);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.rh_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_player_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_player_clues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_player_puzzle_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_player_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rh_purchases ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update only their own profile
CREATE POLICY "Users read own profile" ON public.rh_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.rh_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Episodes & Clues: Public read-only
CREATE POLICY "Public read episodes" ON public.rh_episodes
    FOR SELECT USING (true);

CREATE POLICY "Public read clues" ON public.rh_clues
    FOR SELECT USING (true);

CREATE POLICY "Public read achievements" ON public.rh_achievements
    FOR SELECT USING (true);

CREATE POLICY "Public read daily challenges" ON public.rh_daily_challenges
    FOR SELECT USING (true);

-- Player Missions: Users own progress
CREATE POLICY "Users read own missions" ON public.rh_player_missions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own missions" ON public.rh_player_missions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own missions" ON public.rh_player_missions
    FOR UPDATE USING (auth.uid() = user_id);

-- Player Clues: Users own clues
CREATE POLICY "Users read own clues" ON public.rh_player_clues
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own clues" ON public.rh_player_clues
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leaderboard: Public read view without sensitive data
CREATE OR REPLACE VIEW public.rh_public_leaderboard AS
    SELECT 
        l.challenge_id,
        p.username,
        p.level,
        l.score,
        l.time_taken_seconds,
        l.is_verified,
        l.created_at
    FROM public.rh_leaderboard_entries l
    JOIN public.rh_profiles p ON p.id = l.user_id
    ORDER BY l.score DESC;

-- Purchases: User can read own purchases
CREATE POLICY "Users read own purchases" ON public.rh_purchases
    FOR SELECT USING (auth.uid() = user_id);
