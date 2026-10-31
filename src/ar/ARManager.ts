import { IARProvider } from './IARProvider';
import { SimulatedRoomProvider } from './SimulatedRoomProvider';
import { CameraFeedProvider } from './CameraFeedProvider';
import { WebXRProvider } from './WebXRProvider';
import { ARDisplayMode } from '../types/ar';
import { PlayerSettings } from '../types/game';

export class ARManager {
  private activeProvider: IARProvider | null = null;
  private container: HTMLElement | null = null;
  private settings: PlayerSettings;

  constructor(settings: PlayerSettings) {
    this.settings = settings;
  }

  public async initialize(container: HTMLElement, requestedMode?: ARDisplayMode): Promise<IARProvider> {
    this.container = container;

    // Dispose any previous provider
    if (this.activeProvider) {
      this.activeProvider.dispose();
      this.activeProvider = null;
    }

    // 1. If Camera-Off mode is explicitly enabled by settings or requested as SIMULATED_ROOM
    if (this.settings.cameraOffMode || requestedMode === 'SIMULATED_ROOM') {
      const roomProvider = new SimulatedRoomProvider();
      await roomProvider.init(container);
      this.activeProvider = roomProvider;
      return roomProvider;
    }

    // 2. Try WebXR if requested or available
    if (requestedMode === 'WEBXR_IMMERSIVE') {
      const xrProvider = new WebXRProvider();
      const xrOk = await xrProvider.init(container);
      if (xrOk) {
        this.activeProvider = xrProvider;
        return xrProvider;
      }
    }

    // 3. Try Camera Feed provider
    const cameraProvider = new CameraFeedProvider();
    const cameraOk = await cameraProvider.init(container);
    if (cameraOk) {
      this.activeProvider = cameraProvider;
      return cameraProvider;
    }

    // 4. Graceful Fallback: Simulated Room Provider
    console.info('[ARManager] Falling back to high-fidelity Simulated 3D Room');
    const roomFallback = new SimulatedRoomProvider();
    await roomFallback.init(container);
    this.activeProvider = roomFallback;
    return roomFallback;
  }

  public getActiveProvider(): IARProvider | null {
    return this.activeProvider;
  }

  public switchMode(mode: ARDisplayMode): Promise<IARProvider> {
    if (!this.container) {
      throw new Error('ARManager container not initialized');
    }
    return this.initialize(this.container, mode);
  }

  public dispose(): void {
    if (this.activeProvider) {
      this.activeProvider.dispose();
      this.activeProvider = null;
    }
  }
}
