import { Logger } from '@/core/utils/Logger';

type Listener<T> = (state: T, previousState: T) => void;

export class StateStore<T extends Record<string, any>> {
  private state: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  getState(): T {
    // Return a shallow copy to prevent direct mutation
    return { ...this.state };
  }

  setState(newState: Partial<T>): void {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.notifyListeners(previousState);
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(previousState: T): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, previousState);
      } catch (error) {
        Logger.error('Error in StateStore listener', error);
      }
    });
  }

  reset(initialState: T): void {
    const previousState = { ...this.state };
    this.state = { ...initialState };
    this.notifyListeners(previousState);
    Logger.debug('StateStore reset');
  }
}
