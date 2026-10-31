-- Seed Data for Episode 1: The Visitor
INSERT INTO public.rh_episodes (id, title, subtitle, season, episode_order, is_free, estimated_minutes, difficulty)
VALUES 
    ('EPISODE_01_THE_VISITOR', 'Episode 1: The Visitor', 'The Frequency 87.4 Incident', 1, 1, TRUE, 12, 'Moderate'),
    ('EPISODE_02_ECHO_CHAMBER', 'Episode 2: The Echo Chamber', 'Subterranean Resonances', 1, 2, FALSE, 18, 'Challenging'),
    ('EPISODE_03_HOLLOW_STATIC', 'Episode 3: The Hollow Static', 'The Blackwood Transmission', 1, 3, FALSE, 22, 'Nightmare')
ON CONFLICT (id) DO NOTHING;

-- Seed Episode 1 Clues
INSERT INTO public.rh_clues (id, episode_id, name, tag, lore, puzzle_key)
VALUES
    ('CLUE_CASSETTE', 'EPISODE_01_THE_VISITOR', 'Damaged Reel #87.4', 'Audio Artifact', 'Recovered from the abandoned Blackwood Signal Array.', 'FREQUENCY_TUNER'),
    ('CLUE_FROST_RESIDUE', 'EPISODE_01_THE_VISITOR', 'Thermal Inscription (Frost Ward)', 'Occult Residue', 'Ancient ward circle diagram used to stabilize spatial breaches.', 'WARD_CIPHER'),
    ('CLUE_ARCHITECTURAL_BLUEPRINT', 'EPISODE_01_THE_VISITOR', 'Redacted Facility Blueprint (1974)', 'Government Document', 'Architectural schematic showing Sub-Basement Room 4B.', NULL),
    ('CLUE_RESONANCE_FORK', 'EPISODE_01_THE_VISITOR', 'Harmonic Tuning Fork (432Hz)', 'Acoustic Relic', 'Crafted from meteoric iron by lead investigator Dr. Vane.', 'ECHO_SEQUENCE'),
    ('CLUE_DISTORTED_POLAROID', 'EPISODE_01_THE_VISITOR', 'Spectral Polaroid #12', 'Visual Anomaly', 'Captured 8 minutes before contact with Investigator Miller was lost.', NULL)
ON CONFLICT (id) DO NOTHING;

-- Seed Achievements
INSERT INTO public.rh_achievements (id, name, description, icon_name, score_points)
VALUES
    ('BADGE_FIRST_CONTACT', 'First Contact', 'Begin your first investigation into Frequency 87.4.', 'Radio', 100),
    ('BADGE_WARDSMITH', 'Wardsmith', 'Achieve Ending A by successfully sealing the runic ward.', 'Shield', 500),
    ('BADGE_STATIC_ECHO', 'The Signal’s Echo', 'Witness Ending B and survive the audio breach.', 'Skull', 250),
    ('BADGE_RELIC_KEEPER', 'Relic Keeper', 'Achieve secret Ending C by capturing the Visitor in the tuning fork.', 'Award', 1000),
    ('BADGE_SURVIVOR', 'Cool Head Under Pressure', 'Complete an investigation while keeping fear index below 40%.', 'Heart', 400)
ON CONFLICT (id) DO NOTHING;
