import { EventBus } from '@/core/events/EventBus';
import { GameStateStore } from '@/core/events/GameStateStore';
import { Logger } from '@/core/utils/Logger';

export class AchievementSystem {
  private static instance: AchievementSystem;

  private constructor() {
    this.setupEventListeners();
  }

  static getInstance(): AchievementSystem {
    if (!AchievementSystem.instance) {
      AchievementSystem.instance = new AchievementSystem();
    }
    return AchievementSystem.instance;
  }

  private setupEventListeners(): void {
    const eventBus = EventBus.getInstance();

    // Core game events that might trigger achievements
    eventBus.on('PROFILE:LEVEL_UP', this.checkLevelAchievements.bind(this));
    eventBus.on('GAMEPLAY:LEVEL_COMPLETE', this.checkGameplayAchievements.bind(this));
  }

  private unlockAchievement(id: string, title: string, description: string): void {
    const stateStore = GameStateStore.getInstance();
    const state = stateStore.getState();

    // Check if already unlocked
    if (state.achievements[id]?.isUnlocked) {
      return;
    }

    state.achievements[id] = {
      id,
      title,
      description,
      isUnlocked: true,
      unlockedAt: Date.now()
    };

    stateStore.setState({ achievements: { ...state.achievements } });

    Logger.info(`AchievementSystem: Unlocked achievement [${id}] - ${title}`);
    EventBus.getInstance().emit('ACHIEVEMENT:UNLOCKED', state.achievements[id]);
  }

  private checkLevelAchievements(payload: { newLevel: number }): void {
    if (payload.newLevel >= 5) {
      this.unlockAchievement('level_5', 'Pelajar Rajin', 'Mencapai level 5');
    }
    if (payload.newLevel >= 10) {
      this.unlockAchievement('level_10', 'Pelajar Teladan', 'Mencapai level 10');
    }
  }

  private checkGameplayAchievements(payload: {
    levelId: string;
    score: number;
    stars: number;
  }): void {
    if (payload.stars === 3) {
      this.unlockAchievement(
        `perfect_${payload.levelId}`,
        'Sempurna!',
        `Mendapatkan 3 bintang di ${payload.levelId}`
      );
    }
  }
}
