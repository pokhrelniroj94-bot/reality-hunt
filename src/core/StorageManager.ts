import { PlayerSettings, UserProfile, InvestigationMetrics } from '../types/game';

const SETTINGS_KEY = 'reality_hunt_settings';
const PROFILE_KEY = 'reality_hunt_profile';
const PROGRESS_KEY = 'reality_hunt_progress';

export const DEFAULT_SETTINGS: PlayerSettings = {
  masterVolume: 0.8,
  sfxVolume: 0.9,
  ambientVolume: 0.7,
  heartbeatVolume: 0.85,
  subtitles: true,
  reducedMotion: false,
  cameraOffMode: false,
  seatedMode: true,
  brightness: 1.0,
  intensity: 'STANDARD',
  glassesMode: false,
  voiceInteraction: false,
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'guest_' + Math.random().toString(36).substring(2, 9),
  username: 'Investigator_404',
  isGuest: true,
  level: 1,
  experience: 0,
  totalHunts: 0,
  victories: 0,
  nightmareStreak: 0,
  unlockedBadges: [],
  settings: DEFAULT_SETTINGS,
};

export class StorageManager {
  private static instance: StorageManager;

  private constructor() {}

  public static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  public getSettings(): PlayerSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed reading settings from storage', e);
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: PlayerSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to storage', e);
    }
  }

  public getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed reading profile from storage', e);
    }
    return DEFAULT_PROFILE;
  }

  public saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed saving profile to storage', e);
    }
  }

  public recordCompletedHunt(metrics: InvestigationMetrics): void {
    const profile = this.getProfile();
    profile.totalHunts += 1;
    if (metrics.endingAchieved && metrics.endingAchieved !== 'ENDING_FAILED') {
      profile.victories += 1;
      profile.experience += Math.floor(metrics.calculatedScore / 10);
      profile.level = Math.floor(profile.experience / 100) + 1;
    }
    if (metrics.endingAchieved && !profile.unlockedBadges.includes(metrics.endingAchieved)) {
      profile.unlockedBadges.push(metrics.endingAchieved);
    }
    this.saveProfile(profile);
  }

  public clearAllData(): void {
    try {
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(PROGRESS_KEY);
    } catch (e) {
      console.warn('Failed clearing storage', e);
    }
  }
}

export const storage = StorageManager.getInstance();
