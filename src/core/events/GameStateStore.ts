import { StateStore } from '@/core/events/StateStore';
import { GameSaveData, DEFAULT_SAVE_DATA } from '@/core/types/GameTypes';

export class GameStateStore extends StateStore<GameSaveData> {
  private static instance: GameStateStore;

  private constructor() {
    super(DEFAULT_SAVE_DATA);
  }

  static getInstance(): GameStateStore {
    if (!GameStateStore.instance) {
      GameStateStore.instance = new GameStateStore();
    }
    return GameStateStore.instance;
  }
}
