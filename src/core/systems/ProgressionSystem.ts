import { EventBus } from '@/core/events/EventBus';
import { GameStateStore } from '@/core/events/GameStateStore';
import { Logger } from '@/core/utils/Logger';

/**
 * Handles core business rules for level progression, XP gain, and unlocking mechanics.
 */
export class ProgressionSystem {
  private static instance: ProgressionSystem;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): ProgressionSystem {
    if (!ProgressionSystem.instance) {
      ProgressionSystem.instance = new ProgressionSystem();
    }
    return ProgressionSystem.instance;
  }

  private setupEventListeners(): void {
    const eventBus = EventBus.getInstance();

    // Listen for level completion to trigger progression logic
    eventBus.on('GAMEPLAY:LEVEL_COMPLETE', this.onLevelComplete.bind(this));
  }

  private onLevelComplete(payload: {
    levelId: string;
    score: number;
    stars: number;
    xpGained: number;
  }): void {
    const stateStore = GameStateStore.getInstance();
    const state = stateStore.getState();
    const progress = state.progress[payload.levelId];

    if (!progress) {
      Logger.warn(`ProgressionSystem: Level [${payload.levelId}] not found in state.`);
      return;
    }

    // Update level data
    progress.isCompleted = true;
    progress.highScore = Math.max(progress.highScore, payload.score);
    progress.stars = Math.max(progress.stars, payload.stars);

    // Update XP and check for level up
    const oldLevel = state.profile.level;
    state.profile.totalXp += payload.xpGained;
    state.profile.level = this.calculatePlayerLevel(state.profile.totalXp);

    // Save back to store
    stateStore.setState({
      progress: { ...state.progress, [payload.levelId]: progress },
      profile: { ...state.profile }
    });

    Logger.debug(`ProgressionSystem: Level ${payload.levelId} complete. XP: +${payload.xpGained}`);

    // Emit level up event if applicable
    if (state.profile.level > oldLevel) {
      EventBus.getInstance().emit('PROFILE:LEVEL_UP', { newLevel: state.profile.level });
    }

    // Try to unlock next level
    this.unlockNextLevel(payload.levelId);
  }

  private calculatePlayerLevel(totalXp: number): number {
    // Basic formula: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 300 XP (Level * 100 * (Level - 1) / 2)
    // Simplified: Math.floor(Math.sqrt(totalXp / 50)) + 1
    return Math.floor(Math.sqrt(totalXp / 50)) + 1;
  }

  private unlockNextLevel(currentLevelId: string): void {
    // Simplified logic: Assuming levels are sequential like 'level_1', 'level_2'
    const parts = currentLevelId.split('_');
    if (parts.length === 2 && parts[0] === 'level') {
      const nextLevelNum = parseInt(parts[1], 10) + 1;
      const nextLevelId = `level_${nextLevelNum}`;

      const stateStore = GameStateStore.getInstance();
      const state = stateStore.getState();

      if (state.progress[nextLevelId] && !state.progress[nextLevelId].isUnlocked) {
        state.progress[nextLevelId].isUnlocked = true;
        stateStore.setState({
          progress: { ...state.progress }
        });
        EventBus.getInstance().emit('PROGRESSION:LEVEL_UNLOCKED', { levelId: nextLevelId });
        Logger.info(`ProgressionSystem: Unlocked next level [${nextLevelId}]`);
      }
    }
  }
}
