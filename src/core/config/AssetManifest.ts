import { AssetType, AssetBundle } from '@/core/types/AssetTypes';

/**
 * Manifest definitions for all game assets, mapped by bundle/scene keys.
 */
export const AssetManifest: Record<string, AssetBundle> = {
  // Common assets needed immediately (Boot/Preload)
  core: [
    { key: 'logo', type: AssetType.IMAGE, path: 'assets/image/logo.png' },
    { key: 'ui_click', type: AssetType.AUDIO, path: 'assets/audio/ui_click.mp3' }
  ],
  // Assets for Home Scene
  home: [
    { key: 'bg_home', type: AssetType.IMAGE, path: 'assets/image/bg_home.png' },
    { key: 'bgm_home', type: AssetType.AUDIO, path: 'assets/audio/bgm_home.mp3' }
  ],
  // Assets for Map Scene
  map: [
    { key: 'bg_map', type: AssetType.IMAGE, path: 'assets/image/bg_map.png' },
    { key: 'bgm_map', type: AssetType.AUDIO, path: 'assets/audio/bgm_map.mp3' }
  ],
  // Assets for Quiz Scene
  quiz: [
    { key: 'bg_quiz', type: AssetType.IMAGE, path: 'assets/image/bg_quiz.png' },
    { key: 'bgm_quiz', type: AssetType.AUDIO, path: 'assets/audio/bgm_quiz.mp3' },
    { key: 'sfx_correct', type: AssetType.AUDIO, path: 'assets/audio/sfx_correct.mp3' },
    { key: 'sfx_wrong', type: AssetType.AUDIO, path: 'assets/audio/sfx_wrong.mp3' },
    { key: 'fx_confetti', type: AssetType.IMAGE, path: 'assets/image/fx_confetti.png', lazy: true }
  ],
  // Assets for Result/Reward Scene
  result: [
    { key: 'bg_result', type: AssetType.IMAGE, path: 'assets/image/bg_result.png' },
    { key: 'bgm_victory', type: AssetType.AUDIO, path: 'assets/audio/bgm_victory.mp3' },
    { key: 'icon_star', type: AssetType.IMAGE, path: 'assets/image/icon_star.png' }
  ]
};
