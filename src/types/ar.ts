export type ARTrackingQuality = 'NOT_AVAILABLE' | 'INITIALIZING' | 'RELOCALIZING' | 'TRACKING_GOOD' | 'TRACKING_DEGRADED' | 'EXCESSIVE_MOTION' | 'INSUFFICIENT_FEATURES';

export type ARDisplayMode = 'SIMULATED_ROOM' | 'CAMERA_FEED' | 'WEBXR_IMMERSIVE' | 'GLASSES_COMPACT';

export interface ARAnchor {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number, number]; // Quaternion
  type: 'clue' | 'entity' | 'ward_portal' | 'spectral_residue';
  metadata?: Record<string, unknown>;
}

export interface ARPlane {
  id: string;
  center: [number, number, number];
  extents: [number, number]; // width, height
  alignment: 'HORIZONTAL_UP' | 'HORIZONTAL_DOWN' | 'VERTICAL';
}

export interface ARRaycastHit {
  position: [number, number, number];
  normal: [number, number, number];
  distance: number;
}

export interface ARCapabilities {
  hasCamera: boolean;
  hasDeviceOrientation: boolean;
  hasWebXR: boolean;
  hasLightEstimation: boolean;
  hasHitTest: boolean;
}

export interface GlassesHUDState {
  currentObjective: string;
  fearBarPercent: number;
  proximityMeters: number;
  lastTransmission: string;
  isListeningVoice: boolean;
  alertColor: 'green' | 'yellow' | 'red';
}
