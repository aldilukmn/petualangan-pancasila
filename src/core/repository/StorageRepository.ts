import { Logger } from '@/core/utils/Logger';

/**
 * Handles raw data persistence using browser's LocalStorage.
 * Abstracts away the actual storage mechanism from the rest of the game.
 */
export class StorageRepository {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  save<T>(key: string, data: T): boolean {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(`${this.prefix}${key}`, serialized);
      return true;
    } catch (error) {
      Logger.error(`StorageRepository: Failed to save key [${key}]`, error);
      return false;
    }
  }

  load<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(`${this.prefix}${key}`);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      Logger.error(`StorageRepository: Failed to load key [${key}]`, error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(this.prefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
    Logger.debug(`StorageRepository: Cleared ${keysToRemove.length} keys`);
  }
}
