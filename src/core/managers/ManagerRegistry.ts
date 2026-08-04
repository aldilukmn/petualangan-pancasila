import { Logger } from '@/core/utils/Logger';

export interface IManager {
  initialize(): void | Promise<void>;
  shutdown(): void;
}

export class ManagerRegistry {
  private static instance: ManagerRegistry;
  private managers: Map<string, IManager> = new Map();

  private constructor() {}

  static getInstance(): ManagerRegistry {
    if (!ManagerRegistry.instance) {
      ManagerRegistry.instance = new ManagerRegistry();
    }
    return ManagerRegistry.instance;
  }

  register(key: string, manager: IManager): void {
    if (this.managers.has(key)) {
      Logger.warn(`ManagerRegistry: Manager with key ${key} is already registered. Overwriting.`);
    }
    this.managers.set(key, manager);
    Logger.debug(`ManagerRegistry: Registered manager [${key}]`);
  }

  get<T extends IManager>(key: string): T {
    const manager = this.managers.get(key);
    if (!manager) {
      throw new Error(`ManagerRegistry: Manager with key ${key} not found.`);
    }
    return manager as T;
  }

  async initializeAll(): Promise<void> {
    Logger.info('ManagerRegistry: Initializing all managers...');
    for (const [key, manager] of this.managers.entries()) {
      try {
        await manager.initialize();
        Logger.debug(`ManagerRegistry: Initialized manager [${key}]`);
      } catch (error) {
        Logger.error(`ManagerRegistry: Failed to initialize manager [${key}]`, error);
        throw error;
      }
    }
  }

  shutdownAll(): void {
    Logger.info('ManagerRegistry: Shutting down all managers...');
    for (const [key, manager] of Array.from(this.managers.entries()).reverse()) {
      try {
        manager.shutdown();
        Logger.debug(`ManagerRegistry: Shut down manager [${key}]`);
      } catch (error) {
        Logger.error(`ManagerRegistry: Error during shutdown of manager [${key}]`, error);
      }
    }
  }

  clear(): void {
    this.managers.clear();
    Logger.debug('ManagerRegistry cleared');
  }
}
