import React, { useState, useEffect } from 'react';
import { MainMenuView } from './components/Views/MainMenuView';
import { MissionBriefingView } from './components/Views/MissionBriefingView';
import { ARInvestigationView } from './components/Views/ARInvestigationView';
import { MissionResultView } from './components/Views/MissionResultView';
import { DailyNightmareView } from './components/Views/DailyNightmareView';
import { MultiplayerLobbyView } from './components/Views/MultiplayerLobbyView';
import { SettingsView } from './components/Views/SettingsView';
import { StoreView } from './components/Views/StoreView';
import { storage } from './core/StorageManager';
import { audio } from './audio/HorrorAudioEngine';
import {
  GameMode,
  PlayerSettings,
  UserProfile,
  InvestigationMetrics,
} from './types/game';

type AppView =
  | 'MENU'
  | 'BRIEFING'
  | 'INVESTIGATION'
  | 'RESULT'
  | 'DAILY_NIGHTMARE'
  | 'MULTIPLAYER'
  | 'SETTINGS'
  | 'STORE';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('MENU');
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [settings, setSettings] = useState<PlayerSettings>(storage.getSettings());
  const [lastMetrics, setLastMetrics] = useState<InvestigationMetrics | null>(null);

  useEffect(() => {
    audio.init(settings);
  }, []);

  const handleSelectMode = (mode: GameMode) => {
    if (mode === 'SOLO_NIGHT') {
      setCurrentView('BRIEFING');
    } else if (mode === 'DAILY_NIGHTMARE') {
      setCurrentView('DAILY_NIGHTMARE');
    } else if (mode === 'HUNT_WITH_FRIENDS') {
      setCurrentView('MULTIPLAYER');
    }
  };

  const handleStartInvestigation = () => {
    setCurrentView('INVESTIGATION');
  };

  const handleMissionEnd = (metrics: InvestigationMetrics) => {
    storage.recordCompletedHunt(metrics);
    setProfile(storage.getProfile());
    setLastMetrics(metrics);
    setCurrentView('RESULT');
  };

  const handleEmergencyExit = () => {
    const abortedMetrics: InvestigationMetrics = {
      startTime: Date.now() - 60000,
      endTime: Date.now(),
      cluesDiscovered: 0,
      totalClues: 5,
      puzzlesSolved: 0,
      totalPuzzles: 3,
      fearSpikesCount: 1,
      maxFearLevel: 0.9,
      flashlightUsageSeconds: 30,
      endingAchieved: 'ENDING_FAILED',
      calculatedScore: 200,
    };
    handleMissionEnd(abortedMetrics);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {currentView === 'MENU' && (
        <MainMenuView
          profile={profile}
          settings={settings}
          onSelectMode={handleSelectMode}
          onOpenSettings={() => setCurrentView('SETTINGS')}
          onOpenStore={() => setCurrentView('STORE')}
        />
      )}

      {currentView === 'BRIEFING' && (
        <MissionBriefingView
          onStartMission={handleStartInvestigation}
          onBack={() => setCurrentView('MENU')}
        />
      )}

      {currentView === 'INVESTIGATION' && (
        <ARInvestigationView
          settings={settings}
          onMissionEnd={handleMissionEnd}
          onEmergencyExit={handleEmergencyExit}
        />
      )}

      {currentView === 'RESULT' && lastMetrics && (
        <MissionResultView
          metrics={lastMetrics}
          onReplay={() => setCurrentView('INVESTIGATION')}
          onReturnMenu={() => setCurrentView('MENU')}
        />
      )}

      {currentView === 'DAILY_NIGHTMARE' && (
        <DailyNightmareView
          onBack={() => setCurrentView('MENU')}
          onStartChallenge={() => setCurrentView('INVESTIGATION')}
        />
      )}

      {currentView === 'MULTIPLAYER' && (
        <MultiplayerLobbyView onBack={() => setCurrentView('MENU')} />
      )}

      {currentView === 'SETTINGS' && (
        <SettingsView
          currentSettings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
          onBack={() => setCurrentView('MENU')}
        />
      )}

      {currentView === 'STORE' && (
        <StoreView onBack={() => setCurrentView('MENU')} />
      )}
    </div>
  );
};
