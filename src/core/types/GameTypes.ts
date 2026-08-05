export interface UserProfile {
  name: string;
  avatarId: string;
  totalXp: number;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  isUnlocked: boolean;
  unlockedAt?: number;
}

export interface LevelProgress {
  levelId: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  highScore: number;
  stars: number; // 0 to 3
}

export interface GameSettings {
  bgmVolume: number; // 0.0 to 1.0
  sfxVolume: number; // 0.0 to 1.0
  isMuted: boolean;
}

export interface GameSaveData {
  profile: UserProfile;
  achievements: Record<string, Achievement>;
  progress: Record<string, LevelProgress>;
  settings: GameSettings;
  lastSavedAt: number;
}

// Default initial state
export const DEFAULT_SAVE_DATA: GameSaveData = {
  profile: {
    name: 'Pemain',
    avatarId: 'avatar_default',
    totalXp: 0,
    level: 1
  },
  achievements: {}, // Empty initially
  progress: {
    level_1: { levelId: 'level_1', isUnlocked: true, isCompleted: false, highScore: 0, stars: 0 }
  },
  settings: {
    bgmVolume: 1.0,
    sfxVolume: 1.0,
    isMuted: false
  },
  lastSavedAt: Date.now()
};
