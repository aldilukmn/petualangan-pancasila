import { BaseScene } from './BaseScene';
import { GameConstants } from '@/core/config/Constants';
import { ManagerRegistry } from '@/core/managers/ManagerRegistry';
import { AssetManager } from '@/core/managers/AssetManager';
import { Logger } from '@/core/utils/Logger';

export class PreloadScene extends BaseScene {
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBox!: Phaser.GameObjects.Graphics;

  constructor() {
    super(GameConstants.SCENES.PRELOAD);
  }

  protected onCreate(): void {
    this.createLoadingUI();
    this.loadHomeAssets();
  }

  private createLoadingUI(): void {
    const width = this.screenWidth;
    const height = this.screenHeight;

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x222222, 0.8);
    this.progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    this.make
      .text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Memuat...',
        style: {
          font: '20px monospace',
          color: '#ffffff'
        }
      })
      .setOrigin(0.5, 0.5);

    const percentText = this.make
      .text({
        x: width / 2,
        y: height / 2,
        text: '0%',
        style: {
          font: '18px monospace',
          color: '#ffffff'
        }
      })
      .setOrigin(0.5, 0.5);

    // Phaser's native load events for the progress bar
    this.load.on('progress', (value: number) => {
      percentText.setText(parseInt((value * 100).toString()) + '%');
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
  }

  private async loadHomeAssets(): Promise<void> {
    try {
      const assetManager = ManagerRegistry.getInstance().get<AssetManager>('AssetManager');

      // Load 'home' bundle using the AssetManager
      // Note: Because AssetManager wraps Phaser.Loader, the 'progress' event above will still fire
      // if AssetManager calls scene.load.start()
      await assetManager.loadBundle(this, 'home');

      // Navigate to Home Scene
      this.navigateTo(GameConstants.SCENES.HOME);
    } catch (error) {
      Logger.error('Failed to load home assets', error);
      this.eventBus.emit('APP:FATAL_ERROR', error);
    }
  }

  protected onCleanup(): void {
    this.progressBar.destroy();
    this.progressBox.destroy();
  }
}
