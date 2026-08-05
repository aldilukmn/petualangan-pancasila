import { BaseScene } from './BaseScene';
import { GameConstants } from '@/core/config/Constants';
import { ManagerRegistry } from '@/core/managers/ManagerRegistry';
import { AssetManager } from '@/core/managers/AssetManager';

export class BootScene extends BaseScene {
  constructor() {
    super(GameConstants.SCENES.BOOT);
  }

  protected onCreate(): void {
    // Basic setup before loading heavy assets
    this.cameras.main.setBackgroundColor('#000000');

    // Display a simple loading text while AssetManager loads the core/preload bundle
    this.add
      .text(this.centerX, this.centerY, 'Initializing...', {
        fontSize: '24px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.loadCoreAssets();
  }

  private async loadCoreAssets(): Promise<void> {
    try {
      const assetManager = ManagerRegistry.getInstance().get<AssetManager>('AssetManager');

      // Load 'core' bundle (e.g. logos, basic UI sounds needed for PreloadScene)
      await assetManager.loadBundle(this, 'core');

      // Navigate to PreloadScene
      this.navigateTo(GameConstants.SCENES.PRELOAD);
    } catch (error) {
      this.eventBus.emit('APP:FATAL_ERROR', error);
    }
  }
}
