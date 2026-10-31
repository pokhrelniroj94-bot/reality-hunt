import * as THREE from 'three';
import { IARProvider } from './IARProvider';
import { ARTrackingQuality, ARDisplayMode, ARCapabilities } from '../types/ar';

export class CameraFeedProvider implements IARProvider {
  public readonly mode: ARDisplayMode = 'CAMERA_FEED';

  private container: HTMLElement | null = null;
  private videoElement: HTMLVideoElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private flashlight: THREE.SpotLight;

  private isRunning: boolean = false;
  private trackingQuality: ARTrackingQuality = 'INITIALIZING';
  private stream: MediaStream | null = null;

  // Gyroscope tracking
  private deviceOrientationHandler: ((e: DeviceOrientationEvent) => void) | null = null;
  private hasGyroscope: boolean = false;
  private alpha: number = 0;
  private beta: number = 0;
  private gamma: number = 0;

  constructor() {
    this.videoElement = document.createElement('video');
    this.videoElement.setAttribute('playsinline', 'true');
    this.videoElement.setAttribute('autoplay', 'true');
    this.videoElement.setAttribute('muted', 'true');
    this.videoElement.style.position = 'absolute';
    this.videoElement.style.top = '0';
    this.videoElement.style.left = '0';
    this.videoElement.style.width = '100%';
    this.videoElement.style.height = '100%';
    this.videoElement.style.objectFit = 'cover';
    this.videoElement.style.zIndex = '0';

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 50);
    this.camera.position.set(0, 1.5, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setClearColor(0x000000, 0); // Transparent overlay
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '1';

    // Flashlight & ambient light for virtual objects placed in real camera world
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambient);

    this.flashlight = new THREE.SpotLight(0xffffff, 2.5, 12, Math.PI / 6, 0.3);
    this.flashlight.position.set(0, 0, 0);
    this.camera.add(this.flashlight);
    this.camera.add(this.flashlight.target);
    this.scene.add(this.camera);
  }

  public async init(container: HTMLElement): Promise<boolean> {
    this.container = container;
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    container.appendChild(this.videoElement);
    container.appendChild(this.renderer.domElement);

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
      this.trackingQuality = 'TRACKING_GOOD';
    } catch (err) {
      console.warn('Camera access unavailable or denied:', err);
      this.trackingQuality = 'NOT_AVAILABLE';
      return false;
    }

    this.setupDeviceOrientation();
    return true;
  }

  private setupDeviceOrientation(): void {
    if (window.DeviceOrientationEvent) {
      this.deviceOrientationHandler = (e: DeviceOrientationEvent) => {
        this.hasGyroscope = true;
        this.alpha = e.alpha || 0;
        this.beta = e.beta || 0;
        this.gamma = e.gamma || 0;

        // Convert Euler angles to camera rotation
        const degToRad = Math.PI / 180;
        const euler = new THREE.Euler(
          (this.beta - 90) * degToRad,
          this.alpha * degToRad,
          -this.gamma * degToRad,
          'YXZ'
        );
        this.camera.quaternion.setFromEuler(euler);
      };
      window.addEventListener('deviceorientation', this.deviceOrientationHandler, true);
    }
  }

  public async start(): Promise<void> {
    this.isRunning = true;
  }

  public stop(): void {
    this.isRunning = false;
  }

  public getTrackingQuality(): ARTrackingQuality {
    return this.trackingQuality;
  }

  public getCapabilities(): ARCapabilities {
    return {
      hasCamera: true,
      hasDeviceOrientation: this.hasGyroscope,
      hasWebXR: false,
      hasLightEstimation: false,
      hasHitTest: false,
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
    this.flashlight.intensity = enabled ? 2.5 : 0.0;
  }

  public update(delta: number): void {
    if (!this.isRunning) return;
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    if (this.deviceOrientationHandler) {
      window.removeEventListener('deviceorientation', this.deviceOrientationHandler, true);
    }
    if (this.videoElement.parentElement) {
      this.videoElement.parentElement.removeChild(this.videoElement);
    }
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
