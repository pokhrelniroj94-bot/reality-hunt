import * as THREE from 'three';
import { IARProvider } from './IARProvider';
import { ARTrackingQuality, ARDisplayMode, ARCapabilities } from '../types/ar';

export class WebXRProvider implements IARProvider {
  public readonly mode: ARDisplayMode = 'WEBXR_IMMERSIVE';

  private container: HTMLElement | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private flashlight: THREE.SpotLight;

  private isRunning: boolean = false;
  private trackingQuality: ARTrackingQuality = 'INITIALIZING';
  private xrSession: any = null;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.01, 20);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.xr.enabled = true;

    this.flashlight = new THREE.SpotLight(0xffffff, 2.0);
    this.camera.add(this.flashlight);
    this.scene.add(this.camera);
  }

  public async init(container: HTMLElement): Promise<boolean> {
    this.container = container;
    if (!('xr' in navigator)) {
      this.trackingQuality = 'NOT_AVAILABLE';
      return false;
    }

    try {
      const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar');
      if (!isSupported) {
        this.trackingQuality = 'NOT_AVAILABLE';
        return false;
      }

      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
      this.trackingQuality = 'TRACKING_GOOD';
      return true;
    } catch {
      this.trackingQuality = 'NOT_AVAILABLE';
      return false;
    }
  }

  public async start(): Promise<void> {
    if (!('xr' in navigator)) return;
    try {
      this.xrSession = await (navigator as any).xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
        optionalFeatures: ['dom-overlay', 'light-estimation'],
        domOverlay: { root: this.container },
      });
      await this.renderer.xr.setSession(this.xrSession);
      this.isRunning = true;
    } catch (e) {
      console.warn('WebXR session start failed', e);
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.xrSession) {
      this.xrSession.end();
      this.xrSession = null;
    }
  }

  public getTrackingQuality(): ARTrackingQuality {
    return this.trackingQuality;
  }

  public getCapabilities(): ARCapabilities {
    return {
      hasCamera: true,
      hasDeviceOrientation: true,
      hasWebXR: true,
      hasLightEstimation: true,
      hasHitTest: true,
    };
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public raycast(screenX: number, screenY: number, interactiveObjects: THREE.Object3D[]): THREE.Intersection[] {
    if (!this.container) return [];
    const rect = this.container.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((screenX - rect.left) / rect.width) * 2 - 1,
      -((screenY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    return raycaster.intersectObjects(interactiveObjects, true);
  }

  public setFlashlight(enabled: boolean): void {
    this.flashlight.intensity = enabled ? 2.0 : 0.0;
  }

  public update(delta: number): void {
    if (!this.isRunning) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
