import { EventBus } from '@/core/events/EventBus';
import { Logger } from '@/core/utils/Logger';

/**
 * EventOrchestrator acts as the central hub for cross-layer communication.
 * It listens to generic UI events and triggers Core Logic, and vice versa.
 */
export class EventOrchestrator {
  private static isInitialized = false;

  static initialize(): void {
    if (this.isInitialized) return;

    const bus = EventBus.getInstance();

    // 1. Error Recovery Integration
    bus.on('APP:FATAL_ERROR', (error: Error) => {
      Logger.error('EventOrchestrator: Caught FATAL ERROR, executing recovery flow.', error);
      // Here you would trigger the UI to show a fallback Error Screen
      // bus.emit('UI:SHOW_ERROR_SCREEN', error.message);
    });

    // 2. Save & Load Integration
    bus.on('SAVE:COMPLETED', () => {
      Logger.debug('EventOrchestrator: Save completed, notifying UI (if needed).');
      // bus.emit('UI:SHOW_TOAST', 'Progress Saved');
    });

    // 3. Progression Integration
    bus.on('PROGRESSION:LEVEL_UNLOCKED', (payload: { levelId: string }) => {
      Logger.info(`EventOrchestrator: Level Unlocked: ${payload.levelId}`);
      // Play a sound or show a popup globally
      // bus.emit('AUDIO:PLAY_SFX', 'sfx_unlock');
    });

    // 4. Achievement Integration
    bus.on('ACHIEVEMENT:UNLOCKED', (payload: any) => {
      Logger.info(`EventOrchestrator: Achievement Unlocked: ${payload.title}`);
      // Show achievement toast in UI
      // bus.emit('UI:SHOW_ACHIEVEMENT', payload);
    });

    this.isInitialized = true;
    Logger.info('EventOrchestrator: Integration wiring complete.');
  }
}
