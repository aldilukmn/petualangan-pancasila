import { IManager } from '@/core/managers/ManagerRegistry';
import { StorageRepository } from '@/core/repository/StorageRepository';
import { GameStateStore } from '@/core/events/GameStateStore';
import { EventBus } from '@/core/events/EventBus';
import { GameConstants } from '@/core/config/Constants';
import { Logger } from '@/core/utils/Logger';
import { GameSaveData, DEFAULT_SAVE_DATA } from '@/core/types/GameTypes';

export class SaveManager implements IManager {
  private repository: StorageRepository;
  private readonly MAIN_SAVE_KEY = 'main_save';

  constructor() {
    this.repository = new StorageRepository(GameConstants.STORAGE_PREFIX);
  }

  async initialize(): Promise<void> {
    Logger.info('SaveManager: Initializing...');
    this.loadGame();
  }

  shutdown(): void {
    // Perform an auto-save on shutdown if needed
    this.saveGame();
    Logger.info('SaveManager: Shut down');
  }

  loadGame(): void {
    const savedData = this.repository.load<GameSaveData>(this.MAIN_SAVE_KEY);

    if (savedData) {
      Logger.debug('SaveManager: Found existing save data, merging...');
      // Merge with default to ensure new properties from updates are present
      const mergedData = { ...DEFAULT_SAVE_DATA, ...savedData };

      // Deep merge nested objects if necessary (e.g. progress, settings)
      mergedData.settings = { ...DEFAULT_SAVE_DATA.settings, ...savedData.settings };
      mergedData.profile = { ...DEFAULT_SAVE_DATA.profile, ...savedData.profile };

      GameStateStore.getInstance().reset(mergedData);
      EventBus.getInstance().emit('SAVE:LOADED', mergedData);
    } else {
      Logger.debug('SaveManager: No save data found, using defaults.');
      GameStateStore.getInstance().reset(DEFAULT_SAVE_DATA);
      this.saveGame(); // Create initial save
    }
  }

  saveGame(): void {
    const currentState = GameStateStore.getInstance().getState();
    currentState.lastSavedAt = Date.now();

    const success = this.repository.save(this.MAIN_SAVE_KEY, currentState);

    if (success) {
      EventBus.getInstance().emit('SAVE:COMPLETED');
      Logger.debug('SaveManager: Game saved successfully.');
    } else {
      EventBus.getInstance().emit('APP:FATAL_ERROR', new Error('Failed to save game data.'));
    }
  }

  resetProgress(): void {
    Logger.warn('SaveManager: Resetting ALL progress to default!');
    GameStateStore.getInstance().reset(DEFAULT_SAVE_DATA);
    this.saveGame();
    EventBus.getInstance().emit('SAVE:RESET');
  }
}
