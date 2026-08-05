export const GameConstants = {
  GAME_TITLE: import.meta.env.VITE_APP_TITLE || 'Petualangan Pancasila',
  GAME_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',

  SCREEN_WIDTH: 768,
  SCREEN_HEIGHT: 1024,

  STORAGE_PREFIX: 'pp_save_v1_',

  MAX_CONCURRENT_AUDIO: 9,
  MAX_CONCURRENT_TWEENS: 10,

  SCENES: {
    BOOT: 'BootScene',
    PRELOAD: 'PreloadScene',
    HOME: 'HomeScene',
    MAP: 'MapScene',
    LEARNING: 'LearningScene',
    QUIZ: 'QuizScene',
    RESULT: 'ResultScene',
    ACHIEVEMENT: 'AchievementScene',
    PROFILE: 'ProfileScene',
    SETTINGS: 'SettingsScene',
    ERROR: 'ErrorScene'
  }
} as const;
