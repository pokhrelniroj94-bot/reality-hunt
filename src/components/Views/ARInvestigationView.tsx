import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ARManager } from '../../ar/ARManager';
import { IARProvider } from '../../ar/IARProvider';
import { VisitorEntity } from '../../entity/VisitorEntity';
import { VisitorRenderer } from '../../entity/VisitorRenderer';
import { InvestigationHUD } from '../HUD/InvestigationHUD';
import { FrequencyPuzzle } from '../../puzzles/FrequencyPuzzle';
import { WardCipherPuzzle } from '../../puzzles/WardCipherPuzzle';
import { EchoSequencePuzzle } from '../../puzzles/EchoSequencePuzzle';
import { EvidenceBoardView } from './EvidenceBoardView';
import { InventoryView } from './InventoryView';
import { DialogueView } from './DialogueView';
import { GlassesHUD } from '../../ar/glasses/GlassesHUD';
import { EPISODE_1_CLUES } from '../../story/ClueDefinitions';
import { ClueItem, PlayerSettings, InvestigationMetrics } from '../../types/game';
import { ARDisplayMode } from '../../types/ar';
import { audio } from '../../audio/HorrorAudioEngine';
import { events } from '../../core/EventBus';

interface ARInvestigationViewProps {
  settings: PlayerSettings;
  onMissionEnd: (metrics: InvestigationMetrics) => void;
  onEmergencyExit: () => void;
}

export const ARInvestigationView: React.FC<ARInvestigationViewProps> = ({
  settings,
  onMissionEnd,
  onEmergencyExit,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const arManagerRef = useRef<ARManager | null>(null);
  const providerRef = useRef<IARProvider | null>(null);

  const entityLogicRef = useRef<VisitorEntity>(new VisitorEntity(settings.intensity === 'NIGHTMARE' ? 1.4 : settings.intensity === 'MILD' ? 0.7 : 1.0));
  const entityRendererRef = useRef<VisitorRenderer>(new VisitorRenderer());

  // Clues state
  const [clues, setClues] = useState<ClueItem[]>(EPISODE_1_CLUES);
  const clueObjectsRef = useRef<THREE.Object3D[]>([]);

  // Puzzles state
  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);
  const [solvedPuzzles, setSolvedPuzzles] = useState<string[]>([]);

  // UI Drawers & Overlays
  const [isEvidenceBoardOpen, setIsEvidenceBoardOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isDialogueOpen, setIsDialogueOpen] = useState(false);
  const [glassesMode, setGlassesMode] = useState(settings.glassesMode);

  // Gameplay state
  const [displayMode, setDisplayMode] = useState<ARDisplayMode>(settings.cameraOffMode ? 'SIMULATED_ROOM' : 'CAMERA_FEED');
  const [flashlightOn, setFlashlightOn] = useState(true);
  const flashlightOnRef = useRef(true);
  const batteryPercentRef = useRef(98);
  const batteryElapsedRef = useRef(0);
  const [batteryPercent, setBatteryPercent] = useState(98);
  const [fearLevel, setFearLevel] = useState(0.05);
  const [entityDistance, setEntityDistance] = useState(8.5);
  const [currentObjective, setCurrentObjective] = useState('Survey the room with radar and discover 5 anomalous clues.');
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>('Dispatcher 7: Scanner telemetry online. Investigate the space.');

  // Metrics
  const startTimeRef = useRef<number>(Date.now());
  const fearSpikesRef = useRef<number>(0);
  const maxFearRef = useRef<number>(0.05);
  const missionEndedRef = useRef<boolean>(false);

  // Initialize AR Session & 3D Objects
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let isDisposed = false;

    const initAR = async () => {
      if (!containerRef.current) return;

      const arManager = new ARManager(settings);
      arManagerRef.current = arManager;

      const provider = await arManager.initialize(containerRef.current, displayMode);
      providerRef.current = provider;

      const scene = provider.getScene();

      // Add entity to scene
      scene.add(entityRendererRef.current.getObject());

      // Spawn 3D Clue Representations in scene
      spawn3DClues(scene);

      // Start AR tracking
      await provider.start();

      // Audio engine start
      audio.init(settings);
      audio.resumeAudioContext();

      // Animation & Tick Loop
      const loop = (time: number) => {
        if (isDisposed) return;
        const delta = Math.min(0.1, (time - lastTime) / 1000);
        lastTime = time;

        // Update provider
        provider.update(delta);

        // Update Entity
        const metrics = entityLogicRef.current.update(delta, flashlightOnRef.current);
        setFearLevel(metrics.fearLevel);
        setEntityDistance(metrics.distance);

        if (metrics.fearLevel > maxFearRef.current) {
          maxFearRef.current = metrics.fearLevel;
        }

        // Entity visual update
        entityRendererRef.current.update(
          delta,
          metrics.state,
          metrics.distance,
          provider.getCamera().position
        );

        // Flashlight battery drain (1% every 30 sec)
        if (flashlightOnRef.current && batteryPercentRef.current > 0) {
          batteryElapsedRef.current += delta;

          if (batteryElapsedRef.current >= 30) {
            const drainAmount = Math.floor(batteryElapsedRef.current / 30);
            batteryElapsedRef.current %= 30;

            const nextBattery = Math.max(0, batteryPercentRef.current - drainAmount);
            batteryPercentRef.current = nextBattery;
            setBatteryPercent(nextBattery);

            if (nextBattery === 0) {
              flashlightOnRef.current = false;
              setFlashlightOn(false);
              provider.setFlashlight(false);
            }
          }
        }

        // Check Ending Conditions
        checkEndingTriggers(metrics.state, metrics.fearLevel);

        animId = requestAnimationFrame(loop);
      };

      animId = requestAnimationFrame(loop);
    };

    initAR();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      audio.stopGeiger();
      audio.setHeartbeatIntensity(0);

      if (providerRef.current) {
        providerRef.current.dispose();
        providerRef.current = null;
      }

      arManagerRef.current = null;
    };
  }, [displayMode]);

  const spawn3DClues = (scene: THREE.Scene) => {
    clueObjectsRef.current = [];

    // Clue 1: Cassette on desk
    const cassetteGeo = new THREE.BoxGeometry(0.2, 0.04, 0.12);
    const cassetteMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const cassetteMesh = new THREE.Mesh(cassetteGeo, cassetteMat);
    cassetteMesh.position.set(-0.6, 0.9, -2.4);
    cassetteMesh.userData = { clueId: 'CLUE_CASSETTE' };
    scene.add(cassetteMesh);
    clueObjectsRef.current.push(cassetteMesh);

    // Clue 2: Frost Ward Circle on floor
    const frostGeo = new THREE.CircleGeometry(0.5, 16);
    const frostMat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.5 });
    const frostMesh = new THREE.Mesh(frostGeo, frostMat);
    frostMesh.rotation.x = -Math.PI / 2;
    frostMesh.position.set(0.0, 0.02, -1.2);
    frostMesh.userData = { clueId: 'CLUE_FROST_RESIDUE' };
    scene.add(frostMesh);
    clueObjectsRef.current.push(frostMesh);

    // Clue 3: Architectural Blueprint paper
    const paperGeo = new THREE.PlaneGeometry(0.4, 0.28);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.8 });
    const paperMesh = new THREE.Mesh(paperGeo, paperMat);
    paperMesh.rotation.x = -Math.PI / 2;
    paperMesh.position.set(0.7, 0.9, -2.5);
    paperMesh.userData = { clueId: 'CLUE_ARCHITECTURAL_BLUEPRINT' };
    scene.add(paperMesh);
    clueObjectsRef.current.push(paperMesh);

    // Clue 4: Harmonic Tuning Fork
    const forkGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.28);
    const forkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });
    const forkMesh = new THREE.Mesh(forkGeo, forkMat);
    forkMesh.position.set(-0.1, 0.9, -2.7);
    forkMesh.userData = { clueId: 'CLUE_RESONANCE_FORK' };
    scene.add(forkMesh);
    clueObjectsRef.current.push(forkMesh);

    // Clue 5: Distorted Polaroid on wall
    const photoGeo = new THREE.PlaneGeometry(0.22, 0.26);
    const photoMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const photoMesh = new THREE.Mesh(photoGeo, photoMat);
    photoMesh.position.set(1.2, 1.4, -3.8);
    photoMesh.userData = { clueId: 'CLUE_DISTORTED_POLAROID' };
    scene.add(photoMesh);
    clueObjectsRef.current.push(photoMesh);
  };

  // Tap / Click handling via raycasting
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!providerRef.current) return;

    // Raycast against clue objects
    const hits = providerRef.current.raycast(e.clientX, e.clientY, clueObjectsRef.current);
    if (hits.length > 0) {
      const topHit = hits[0].object;
      const clueId = topHit.userData.clueId;
      if (clueId) {
        discoverClue(clueId);
      }
    }
  };

  const discoverClue = (clueId: string) => {
    const clueIndex = clues.findIndex((c) => c.id === clueId);
    if (clueIndex === -1) return;

    if (!clues[clueIndex].found) {
      audio.playPuzzleSuccess();
      const updated = [...clues];
      updated[clueIndex] = { ...updated[clueIndex], found: true, timestamp: Date.now() };
      setClues(updated);

      const foundCount = updated.filter((c) => c.found).length;
      entityLogicRef.current.onClueDiscovered(foundCount, clues.length);

      setActiveSubtitle(`Discovered: ${updated[clueIndex].name}`);
      setTimeout(() => setActiveSubtitle(null), 3500);

      if (foundCount === 5) {
        setCurrentObjective('All 5 clues discovered. Calibrate Frequency 87.4 in your Gear drawer!');
      } else {
        setCurrentObjective(`Investigate remaining clues (${foundCount}/5 discovered).`);
      }

      // If clue has a puzzle, prompt player to open it
      if (updated[clueIndex].puzzleKey) {
        setTimeout(() => {
          setActivePuzzle(updated[clueIndex].puzzleKey!);
        }, 800);
      }
    }
  };

  const handleToggleFlashlight = () => {
    if (!flashlightOnRef.current && batteryPercentRef.current <= 0) return;

    const nextState = !flashlightOnRef.current;
    flashlightOnRef.current = nextState;
    setFlashlightOn(nextState);
    if (providerRef.current) {
      providerRef.current.setFlashlight(nextState);
    }
    audio.playUIClick();
  };

  const handleToggleDisplayMode = () => {
    const nextMode = displayMode === 'CAMERA_FEED' ? 'SIMULATED_ROOM' : 'CAMERA_FEED';
    setDisplayMode(nextMode);
  };

  const handlePuzzleComplete = (result: any) => {
    setActivePuzzle(null);
    if (result.success) {
      setSolvedPuzzles((prev) => [...prev, result.puzzleId]);
      entityLogicRef.current.onPuzzleSolved();

      if (result.puzzleId === 'PUZZLE_FREQUENCY_87_4') {
        setCurrentObjective('Signal 87.4 MHz decoded! Now align the 3 Runic Ward rings on the floor.');
        setActiveSubtitle('Dispatcher 7: Frequency decoded! The ward is destabilizingâ€”align the rings!');
      } else if (result.puzzleId === 'PUZZLE_WARD_CIPHER') {
        setCurrentObjective('Ward rings locked! Prepare for the Visitorâ€™s collapse.');
        entityLogicRef.current.banish();
        setTimeout(() => triggerEnding('ENDING_SEAL'), 2000);
      } else if (result.puzzleId === 'PUZZLE_ECHO_SEQUENCE') {
        setCurrentObjective('Resonance Chamber harmonic! The entity can be captured!');
        setTimeout(() => triggerEnding('ENDING_VESSEL'), 2000);
      }
    }
  };

  const checkEndingTriggers = (entityState: string, fear: number) => {
    // If fear maxes out and entity reaches close proximity without ward sealed
    if (fear >= 0.98 && entityState === 'HUNTING' && !solvedPuzzles.includes('PUZZLE_WARD_CIPHER')) {
      triggerEnding('ENDING_ASSIMILATION');
    }
  };

  const triggerEnding = (endingId: string) => {
    if (missionEndedRef.current) return;
    missionEndedRef.current = true;

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const foundCount = clues.filter((c) => c.found).length;

    let score = foundCount * 200 + solvedPuzzles.length * 350;
    if (endingId === 'ENDING_SEAL') score += 2500;
    else if (endingId === 'ENDING_VESSEL') score += 3200;
    else score += 950;

    const metrics: InvestigationMetrics = {
      startTime: startTimeRef.current,
      endTime: Date.now(),
      cluesDiscovered: foundCount,
      totalClues: clues.length,
      puzzlesSolved: solvedPuzzles.length,
      totalPuzzles: 3,
      fearSpikesCount: fearSpikesRef.current,
      maxFearLevel: maxFearRef.current,
      flashlightUsageSeconds: timeTaken * (flashlightOn ? 0.8 : 0.2),
      endingAchieved: endingId,
      calculatedScore: score,
    };

    onMissionEnd(metrics);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#06060a',
        cursor: 'crosshair',
      }}
    >
      {/* HUD Overlay */}
      <InvestigationHUD
        currentObjective={currentObjective}
        foundCluesCount={clues.filter((c) => c.found).length}
        totalCluesCount={clues.length}
        fearLevel={fearLevel}
        entityDistance={entityDistance}
        batteryPercent={batteryPercent}
        flashlightOn={flashlightOn}
        displayMode={displayMode}
        glassesMode={glassesMode}
        activeSubtitle={activeSubtitle}
        onToggleFlashlight={handleToggleFlashlight}
        onOpenEvidenceBoard={() => setIsEvidenceBoardOpen(true)}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenDialogue={() => setIsDialogueOpen(true)}
        onToggleDisplayMode={handleToggleDisplayMode}
        onToggleGlassesMode={() => setGlassesMode((prev) => !prev)}
        onEmergencyStop={onEmergencyExit}
      />

      {/* AR Glasses HUD (High-contrast peripheral mode) */}
      {glassesMode && (
        <GlassesHUD
          currentObjective={currentObjective}
          fearLevel={fearLevel}
          entityDistance={entityDistance}
          onVoiceCommand={(cmd) => {
            if (cmd.action === 'EMERGENCY_STOP') onEmergencyExit();
            else if (cmd.action === 'SCAN_FREQUENCY') setActivePuzzle('FREQUENCY_TUNER');
          }}
          onExitGlasses={() => setGlassesMode(false)}
        />
      )}

      {/* Interactive Puzzles */}
      {activePuzzle === 'FREQUENCY_TUNER' && (
        <FrequencyPuzzle
          onComplete={handlePuzzleComplete}
          onCancel={() => setActivePuzzle(null)}
        />
      )}
      {activePuzzle === 'WARD_CIPHER' && (
        <WardCipherPuzzle
          onComplete={handlePuzzleComplete}
          onCancel={() => setActivePuzzle(null)}
        />
      )}
      {activePuzzle === 'ECHO_SEQUENCE' && (
        <EchoSequencePuzzle
          onComplete={handlePuzzleComplete}
          onCancel={() => setActivePuzzle(null)}
        />
      )}

      {/* Dossier & Gear Drawers */}
      {isEvidenceBoardOpen && (
        <EvidenceBoardView
          clues={clues}
          onClose={() => setIsEvidenceBoardOpen(false)}
          onLaunchPuzzle={(key) => setActivePuzzle(key)}
        />
      )}
      {isInventoryOpen && (
        <InventoryView
          onClose={() => setIsInventoryOpen(false)}
          onLaunchPuzzle={(key) => setActivePuzzle(key)}
        />
      )}
      {isDialogueOpen && (
        <DialogueView
          currentObjective={currentObjective}
          foundClues={clues.filter((c) => c.found).map((c) => c.id)}
          solvedPuzzles={solvedPuzzles}
          fearLevel={fearLevel}
          onClose={() => setIsDialogueOpen(false)}
        />
      )}
    </div>
  );
};


