import { Logger } from '@/core/utils/Logger';

type EventHandler = (...args: any[]) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, Set<EventHandler>> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, handler: EventHandler): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(handler);
  }

  off(event: string, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler);
    if (this.listeners.get(event)?.size === 0) {
      this.listeners.delete(event);
    }
  }

  once(event: string, handler: EventHandler): void {
    const onceWrapper = (...args: any[]) => {
      this.off(event, onceWrapper);
      handler(...args);
    };
    this.on(event, onceWrapper);
  }

  emit(event: string, ...args: any[]): void {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(...args);
        } catch (error) {
          Logger.error(`Error in EventBus handler for event: ${event}`, error);
        }
      });
    }
  }

  offAll(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  reset(): void {
    this.listeners.clear();
    Logger.debug('EventBus reset');
  }
}
