import * as THREE from 'three';
import { IARProvider } from './IARProvider';
import { ARTrackingQuality, ARDisplayMode, ARCapabilities } from '../types/ar';

export class SimulatedRoomProvider implements IARProvider {
  public readonly mode: ARDisplayMode = 'SIMULATED_ROOM';

  private container: HTMLElement | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private flashlight: THREE.SpotLight;
  private ambientLight: THREE.AmbientLight;
  private ceilingFlickerLight: THREE.PointLight;

  private isRunning: boolean = false;
  private isFlashlightOn: boolean = true;
  private trackingQuality: ARTrackingQuality = 'TRACKING_GOOD';

  // Interaction controls
  private isPointerDown: boolean = false;
  private previousPointerPos: { x: number; y: number } = { x: 0, y: 0 };
  private euler: THREE.Euler = new THREE.Euler(0, 0, 0, 'YXZ');

  // Flicker timing
  private flickerTimer: number = 0;
  private thunderTimer: number = 0;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x06060a, 0.12);

    this.camera = new THREE.PerspectiveCamera(65, 1, 0.1, 50);
    this.camera.position.set(0, 1.6, 0); // Eye level

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setClearColor(0x06060a);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Ambient light (very dim for horror atmosphere)
    this.ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.25);
    this.scene.add(this.ambientLight);

    // Ceiling flickering industrial bulb
    this.ceilingFlickerLight = new THREE.PointLight(0xffeedd, 0.8, 12, 1.8);
    this.ceilingFlickerLight.position.set(0, 2.7, -1.2);
    this.ceilingFlickerLight.castShadow = true;
    this.scene.add(this.ceilingFlickerLight);

    // Player Flashlight attached to camera
    this.flashlight = new THREE.SpotLight(0xf8fafc, 3.5, 18, Math.PI / 7, 0.45, 1.2);
    this.flashlight.position.set(0, 0, 0);
    this.flashlight.target.position.set(0, 0, -1);
    this.camera.add(this.flashlight);
    this.camera.add(this.flashlight.target);
    this.scene.add(this.camera);

    this.buildSimulatedEnvironment();
  }

  public async init(container: HTMLElement): Promise<boolean> {
    this.container = container;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();

    container.appendChild(this.renderer.domElement);
    this.bindInputEvents();
    return true;
  }

  private buildSimulatedEnvironment(): void {
    // Room dimensions: 7m wide, 3m tall, 8m deep
    const roomGroup = new THREE.Group();
    roomGroup.name = 'ROOM_GEOMETRY';

    // Floor
    const floorGeo = new THREE.PlaneGeometry(8, 8, 16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x181820,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(8, 8);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x0f0f14, roughness: 0.95 });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 3;
    roomGroup.add(ceiling);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1f2029,
      roughness: 0.9,
    });

    // North Wall (Front)
    const northWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
    northWall.position.set(0, 1.5, -4);
    northWall.receiveShadow = true;
    roomGroup.add(northWall);

    // South Wall (Back)
    const southWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
    southWall.position.set(0, 1.5, 4);
    southWall.rotation.y = Math.PI;
    southWall.receiveShadow = true;
    roomGroup.add(southWall);

    // East Wall (Right)
    const eastWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
    eastWall.position.set(4, 1.5, 0);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.receiveShadow = true;
    roomGroup.add(eastWall);

    // West Wall (Left)
    const westWall = new THREE.Mesh(new THREE.PlaneGeometry(8, 3), wallMat);
    westWall.position.set(-4, 1.5, 0);
    westWall.rotation.y = Math.PI / 2;
    westWall.receiveShadow = true;
    roomGroup.add(westWall);

    // Investigation Desk in front of North Wall
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x271e16, roughness: 0.7 });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 1.1), deskMat);
    deskTop.position.set(0, 0.85, -2.6);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    roomGroup.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.BoxGeometry(0.08, 0.85, 0.08);
    const legPositions = [
      [-1.0, 0.425, -2.15],
      [1.0, 0.425, -2.15],
      [-1.0, 0.425, -3.05],
      [1.0, 0.425, -3.05],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      roomGroup.add(leg);
    });

    // Occult Ward Circle on Floor (glowing chalk runes)
    const circleGeo = new THREE.RingGeometry(0.7, 0.75, 32);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0x991b1b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const wardRing = new THREE.Mesh(circleGeo, circleMat);
    wardRing.rotation.x = -Math.PI / 2;
    wardRing.position.set(0, 0.01, -1.2);
    roomGroup.add(wardRing);

    // Vintage Radio / Signal Analyzer on the desk
    const radioBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.28, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x2b2d38, roughness: 0.4, metalness: 0.6 })
    );
    radioBody.position.set(-0.6, 1.02, -2.5);
    radioBody.castShadow = true;
    roomGroup.add(radioBody);

    // Window with storm backdrop
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.2, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x11131a })
    );
    windowFrame.position.set(2.4, 1.8, -3.95);
    roomGroup.add(windowFrame);

    this.scene.add(roomGroup);
  }

  private bindInputEvents(): void {
    if (!this.container) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      this.isPointerDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      this.previousPointerPos = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isPointerDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - this.previousPointerPos.x;
      const deltaY = clientY - this.previousPointerPos.y;

      const sensitivity = 0.0035;
      this.euler.y -= deltaX * sensitivity;
      this.euler.x -= deltaY * sensitivity;

      // Clamp vertical pitch to prevent flipping
      this.euler.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.euler.x));
      this.camera.quaternion.setFromEuler(this.euler);

      this.previousPointerPos = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isPointerDown = false;
    };

    const onResize = () => {
      if (!this.container) return;
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };

    this.container.addEventListener('mousedown', onPointerDown);
    this.container.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    this.container.addEventListener('touchstart', onPointerDown, { passive: true });
    this.container.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    window.addEventListener('resize', onResize);
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
      hasCamera: false,
      hasDeviceOrientation: false,
      hasWebXR: false,
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
    this.isFlashlightOn = enabled;
    this.flashlight.intensity = enabled ? 3.5 : 0.0;
  }

  public update(delta: number): void {
    if (!this.isRunning) return;

    // Atmospheric ceiling light flickering
    this.flickerTimer += delta;
    if (this.flickerTimer > 0.08) {
      this.flickerTimer = 0;
      if (Math.random() < 0.22) {
        this.ceilingFlickerLight.intensity = Math.random() < 0.5 ? 0.15 : 0.9;
      } else {
        this.ceilingFlickerLight.intensity = 0.75 + Math.random() * 0.15;
      }
    }

    // Occasional subtle lightning flash outside
    this.thunderTimer += delta;
    if (this.thunderTimer > 18) {
      this.thunderTimer = 0;
      this.ambientLight.intensity = 1.6;
      setTimeout(() => {
        this.ambientLight.intensity = 0.25;
      }, 70);
    }

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.stop();
    if (this.container && this.renderer.domElement.parentElement === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
    this.renderer.dispose();
  }
}
