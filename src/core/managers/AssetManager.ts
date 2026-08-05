import { IManager } from '@/core/managers/ManagerRegistry';
import { Logger } from '@/core/utils/Logger';
import { AssetConfig, AssetType } from '@/core/types/AssetTypes';
import { AssetManifest } from '@/core/config/AssetManifest';
import { EventBus } from '@/core/events/EventBus';

export class AssetManager implements IManager {
  private loadedAssets: Set<string> = new Set();

  async initialize(): Promise<void> {
    Logger.info('AssetManager initialized');
  }

  shutdown(): void {
    this.loadedAssets.clear();
    Logger.info('AssetManager shut down');
  }

  /**
   * Preload a bundle of assets defined in the manifest.
   * Should be called from a Phaser Scene (e.g. PreloadScene).
   */
  async loadBundle(scene: Phaser.Scene, bundleKey: string): Promise<void> {
    const assets = AssetManifest[bundleKey];
    if (!assets) {
      Logger.warn(`AssetManager: Bundle [${bundleKey}] not found in manifest.`);
      return Promise.resolve();
    }

    // Filter out lazy-loaded assets unless requested explicitly elsewhere
    const requiredAssets = assets.filter((asset) => !asset.lazy);
    return this.loadAssets(scene, requiredAssets);
  }

  /**
   * Lazy load a specific asset or a bundle of assets dynamically during gameplay.
   */
  async lazyLoadBundle(scene: Phaser.Scene, bundleKey: string): Promise<void> {
    const assets = AssetManifest[bundleKey];
    if (!assets) {
      Logger.warn(`AssetManager: Bundle [${bundleKey}] not found for lazy loading.`);
      return Promise.resolve();
    }
    return this.loadAssets(scene, assets);
  }

  /**
   * Unload assets to free up memory (Memory Management Strategy)
   */
  unloadBundle(scene: Phaser.Scene, bundleKey: string): void {
    const assets = AssetManifest[bundleKey];
    if (!assets) return;

    assets.forEach((asset) => {
      if (this.loadedAssets.has(asset.key)) {
        this.removeAssetFromCache(scene, asset);
        this.loadedAssets.delete(asset.key);
        Logger.debug(`AssetManager: Unloaded asset [${asset.key}]`);
      }
    });
  }

  /**
   * Helper to check if an asset is already loaded
   */
  isLoaded(key: string): boolean {
    return this.loadedAssets.has(key);
  }

  private removeAssetFromCache(scene: Phaser.Scene, asset: AssetConfig): void {
    try {
      switch (asset.type) {
        case AssetType.IMAGE:
        case AssetType.SPRITESHEET:
          scene.textures.remove(asset.key);
          break;
        case AssetType.AUDIO:
          scene.cache.audio.remove(asset.key);
          break;
        case AssetType.JSON:
          scene.cache.json.remove(asset.key);
          break;
        case AssetType.VIDEO:
          scene.cache.video.remove(asset.key);
          break;
      }
    } catch (error) {
      Logger.warn(`AssetManager: Error unloading asset [${asset.key}]`, error);
    }
  }

  private loadAssets(scene: Phaser.Scene, assets: AssetConfig[]): Promise<void> {
    return new Promise((resolve) => {
      let toLoad = 0;

      assets.forEach((asset) => {
        if (!this.loadedAssets.has(asset.key)) {
          this.queueAsset(scene, asset);
          toLoad++;
        }
      });

      if (toLoad === 0) {
        resolve();
        return;
      }

      // Event listener for completion
      const onComplete = () => {
        scene.load.off('complete', onComplete);
        scene.load.off('loaderror', onError);

        assets.forEach((a) => this.loadedAssets.add(a.key));
        Logger.debug(`AssetManager: Loaded ${toLoad} assets`);
        resolve();
      };

      // Event listener for errors
      const onError = (fileObj: any) => {
        const msg = `AssetManager: Failed to load asset [${fileObj.key}]`;
        Logger.error(msg);
        EventBus.getInstance().emit('APP:ASSET_LOAD_ERROR', fileObj);
        // We do not reject here to allow graceful degradation (fallback assets)
      };

      scene.load.on('complete', onComplete);
      scene.load.on('loaderror', onError);

      // Start loading if not already loading (useful for lazy loads)
      if (!scene.load.isLoading()) {
        scene.load.start();
      }
    });
  }

  private queueAsset(scene: Phaser.Scene, asset: AssetConfig): void {
    switch (asset.type) {
      case AssetType.IMAGE:
        scene.load.image(asset.key, asset.path);
        break;
      case AssetType.AUDIO:
        scene.load.audio(asset.key, asset.path);
        break;
      case AssetType.SPRITESHEET:
        scene.load.spritesheet(asset.key, asset.path, asset.options);
        break;
      case AssetType.JSON:
        scene.load.json(asset.key, asset.path);
        break;
      case AssetType.VIDEO:
        scene.load.video(asset.key, asset.path);
        break;
      default:
        Logger.warn(`AssetManager: Unknown asset type [${asset.type}] for key [${asset.key}]`);
    }
  }
}
