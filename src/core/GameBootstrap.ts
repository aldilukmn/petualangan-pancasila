import { Logger } from '@/core/utils/Logger';
import { ErrorHandler } from '@/core/utils/ErrorHandler';
import { EventBus } from '@/core/events/EventBus';
import { ManagerRegistry } from '@/core/managers/ManagerRegistry';
import { AssetManager } from '@/core/managers/AssetManager';
import { SaveManager } from '@/core/managers/SaveManager';
import { ProgressionSystem } from '@/core/systems/ProgressionSystem';
import { AchievementSystem } from '@/core/systems/AchievementSystem';
import { ScoringSystem } from '@/core/systems/ScoringSystem';

export class GameBootstrap {
  private static isBootstrapped = false;

  static async run(): Promise<void> {
    if (this.isBootstrapped) {
      Logger.warn('GameBootstrap: Application is already bootstrapped.');
      return;
    }

    try {
      Logger.info('GameBootstrap: Starting initialization sequence...');

      // 1. Initialize Error Handler
      ErrorHandler.getInstance();

      // 2. Initialize EventBus
      EventBus.getInstance();

      // 3. Register Core Services
      this.registerServices();

      // 4. Register Managers
      this.registerManagers();

      // 5. Initialize Core Logic Systems
      this.initializeSystems();

      // 6. Initialize Managers (SaveManager will load game state here)
      await ManagerRegistry.getInstance().initializeAll();

      // 7. Setup Global Shutdown Hooks
      this.setupShutdownHooks();

      this.isBootstrapped = true;
      Logger.info('GameBootstrap: Initialization complete.');
      EventBus.getInstance().emit('APP:BOOTSTRAP_COMPLETE');
    } catch (error) {
      Logger.error('GameBootstrap: Initialization failed!', error);
      ErrorHandler.getInstance().handle(error as Error, 'FATAL' as any, 'GameBootstrap');
    }
  }

  private static registerServices(): void {
    Logger.debug('GameBootstrap: Registering services...');
  }

  private static registerManagers(): void {
    Logger.debug('GameBootstrap: Registering managers...');
    const registry = ManagerRegistry.getInstance();

    registry.register('AssetManager', new AssetManager());
    registry.register('SaveManager', new SaveManager());
  }

  private static initializeSystems(): void {
    Logger.debug('GameBootstrap: Initializing core systems...');
    ProgressionSystem.getInstance();
    AchievementSystem.getInstance();
    ScoringSystem.getInstance();
  }

  private static setupShutdownHooks(): void {
    window.addEventListener('beforeunload', () => {
      this.shutdown();
    });
  }

  static shutdown(): void {
    if (!this.isBootstrapped) return;

    Logger.info('GameBootstrap: Commencing shutdown sequence...');
    EventBus.getInstance().emit('APP:SHUTTING_DOWN');

    // Shut down managers in reverse order
    ManagerRegistry.getInstance().shutdownAll();

    Logger.info('GameBootstrap: Shutdown complete.');
  }
}
