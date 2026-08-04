import { Logger } from '@/core/utils/Logger';

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  register<T>(key: string, service: T): void {
    if (this.services.has(key)) {
      Logger.warn(`ServiceRegistry: Service with key ${key} is already registered. Overwriting.`);
    }
    this.services.set(key, service);
    Logger.debug(`ServiceRegistry: Registered service [${key}]`);
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`ServiceRegistry: Service with key ${key} not found.`);
    }
    return service as T;
  }

  clear(): void {
    this.services.clear();
    Logger.debug('ServiceRegistry cleared');
  }
}
