import * as THREE from 'three';
import { ARTrackingQuality, ARDisplayMode, ARCapabilities } from '../types/ar';

export interface IARProvider {
  readonly mode: ARDisplayMode;
  init(container: HTMLElement): Promise<boolean>;
  start(): Promise<void>;
  stop(): void;
  getTrackingQuality(): ARTrackingQuality;
  getCapabilities(): ARCapabilities;
  getScene(): THREE.Scene;
  getCamera(): THREE.PerspectiveCamera;
  getRenderer(): THREE.WebGLRenderer;
  raycast(screenX: number, screenY: number, interactiveObjects: THREE.Object3D[]): THREE.Intersection[];
  setFlashlight(enabled: boolean): void;
  update(delta: number): void;
  dispose(): void;
}
