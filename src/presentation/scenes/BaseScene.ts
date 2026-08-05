import { EventBus } from '@/core/events/EventBus';
import { GameStateStore } from '@/core/events/GameStateStore';
import { GameConstants } from '@/core/config/Constants';

/**
 * Base Scene that provides common functionality for all game scenes.
 * Handles responsive layout, event cleanup, and state access.
 */
export class BaseScene extends Phaser.Scene {
  protected eventBus: EventBus;
  protected stateStore: GameStateStore;

  // Responsive layout helpers
  protected screenWidth: number;
  protected screenHeight: number;
  protected centerX: number;
  protected centerY: number;

  constructor(key: string) {
    super({ key });
    this.eventBus = EventBus.getInstance();
    this.stateStore = GameStateStore.getInstance();

    // Default to config size, will be updated on resize
    this.screenWidth = GameConstants.SCREEN_WIDTH;
    this.screenHeight = GameConstants.SCREEN_HEIGHT;
    this.centerX = this.screenWidth / 2;
    this.centerY = this.screenHeight / 2;
  }

  init(data?: any): void {
    this.updateDimensions();

    // Clean up events on shutdown to prevent memory leaks
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.cleanup, this);

    // Listen to resize events
    this.scale.on(Phaser.Scale.Events.RESIZE, this.handleResize, this);

    this.onInit(data);
  }

  create(): void {
    this.onCreate();
  }

  // Override these methods in child classes
  protected onInit(_data?: any): void {}
  protected onCreate(): void {}
  protected onResize(): void {}

  // Custom cleanup method for child classes to override
  protected onCleanup(): void {}

  private handleResize(gameSize: Phaser.Structs.Size): void {
    this.updateDimensions(gameSize.width, gameSize.height);
    this.onResize();
  }

  private updateDimensions(width?: number, height?: number): void {
    this.screenWidth = width || this.scale.width;
    this.screenHeight = height || this.scale.height;
    this.centerX = this.screenWidth / 2;
    this.centerY = this.screenHeight / 2;
  }

  private cleanup(): void {
    this.scale.off(Phaser.Scale.Events.RESIZE, this.handleResize, this);
    this.onCleanup();
  }

  /**
   * Helper to switch scenes safely
   */
  protected navigateTo(sceneKey: string, data?: any): void {
    this.scene.start(sceneKey, data);
  }
}
