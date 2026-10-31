import * as THREE from 'three';
import { EntityBehaviorState } from './VisitorEntity';

export class VisitorRenderer {
  private entityGroup: THREE.Group;
  private coreMesh: THREE.Mesh;
  private tendrilsGroup: THREE.Group;
  private particles: THREE.Points;
  private leftEye: THREE.Mesh;
  private rightEye: THREE.Mesh;
  private auraLight: THREE.PointLight;

  private animTimer: number = 0;

  constructor() {
    this.entityGroup = new THREE.Group();
    this.entityGroup.name = 'THE_VISITOR_ENTITY';

    // 1. Shifting Dark Core (visibly fictional geometric anomaly)
    const coreGeo = new THREE.IcosahedronGeometry(0.45, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x220505,
      roughness: 0.3,
      metalness: 0.8,
      wireframe: false,
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.coreMesh.castShadow = true;
    this.entityGroup.add(this.coreMesh);

    // 2. Eye Glyphs (piercing glowing geometric markers)
    const eyeGeo = new THREE.OctahedronGeometry(0.045);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    this.leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEye.position.set(-0.14, 0.1, 0.38);

    this.rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEye.position.set(0.14, 0.1, 0.38);

    this.entityGroup.add(this.leftEye);
    this.entityGroup.add(this.rightEye);

    // 3. Spectral Tendrils (orbiting rings and shards)
    this.tendrilsGroup = new THREE.Group();
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x991b1b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.65 + i * 0.15, 0.015, 8, 32), ringMat);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      this.tendrilsGroup.add(ring);
    }
    this.entityGroup.add(this.tendrilsGroup);

    // 4. Glitch Particle Cloud
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1.6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdc2626,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
    });
    this.particles = new THREE.Points(particleGeo, particleMat);
    this.entityGroup.add(this.particles);

    // 5. Ambient Aura Light (casts subtle red glow on surrounding walls)
    this.auraLight = new THREE.PointLight(0xdc2626, 0.8, 4.5, 2.0);
    this.auraLight.position.set(0, 0, 0);
    this.entityGroup.add(this.auraLight);

    // Initial position
    this.entityGroup.position.set(0, 1.5, -8.0);
    this.entityGroup.visible = false;
  }

  public getObject(): THREE.Group {
    return this.entityGroup;
  }

  public update(
    delta: number,
    state: EntityBehaviorState,
    distance: number,
    cameraPos: THREE.Vector3
  ): void {
    this.animTimer += delta;

    if (state === 'DORMANT' || state === 'BANISHED') {
      this.entityGroup.visible = false;
      return;
    }

    this.entityGroup.visible = true;

    // Position along vector in front of camera / room coordinate
    const targetZ = -Math.max(1.2, distance);
    const bobbing = Math.sin(this.animTimer * 2.2) * 0.08;
    this.entityGroup.position.set(0, 1.45 + bobbing, targetZ);

    // Face camera
    this.entityGroup.lookAt(cameraPos);

    // Rotate tendrils
    this.tendrilsGroup.rotation.y += delta * 1.2;
    this.tendrilsGroup.rotation.x += delta * 0.8;

    // Jitter particles
    this.particles.rotation.y -= delta * 0.5;

    // React to behavior states
    if (state === 'HUNTING') {
      // Violent jitter
      this.entityGroup.position.x += (Math.random() - 0.5) * 0.06;
      this.entityGroup.position.y += (Math.random() - 0.5) * 0.06;
      this.auraLight.intensity = 2.2 + Math.random() * 0.8;
      (this.leftEye.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
      (this.rightEye.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);
    } else if (state === 'MANIFESTING') {
      this.auraLight.intensity = 1.2 + Math.sin(this.animTimer * 5) * 0.4;
      (this.leftEye.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
      (this.rightEye.material as THREE.MeshBasicMaterial).color.setHex(0xef4444);
    } else {
      // Stalking
      this.auraLight.intensity = 0.4;
      (this.leftEye.material as THREE.MeshBasicMaterial).color.setHex(0x991b1b);
      (this.rightEye.material as THREE.MeshBasicMaterial).color.setHex(0x991b1b);
    }
  }

  public dispose(): void {
    this.coreMesh.geometry.dispose();
    (this.coreMesh.material as THREE.Material).dispose();
    this.leftEye.geometry.dispose();
    (this.leftEye.material as THREE.Material).dispose();
    this.rightEye.geometry.dispose();
    (this.rightEye.material as THREE.Material).dispose();
    this.particles.geometry.dispose();
    (this.particles.material as THREE.Material).dispose();
  }
}
