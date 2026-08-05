import 'phaser';
import { GameBootstrap } from '@/core/GameBootstrap';
import { GameConstants } from '@/core/config/Constants';
import { BootScene } from '@/presentation/scenes/BootScene';
import { PreloadScene } from '@/presentation/scenes/PreloadScene';
import { HomeScene } from '@/presentation/scenes/HomeScene';
import { MapScene } from '@/presentation/scenes/MapScene';

// Boot Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GameConstants.SCREEN_WIDTH,
  height: GameConstants.SCREEN_HEIGHT,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000',
  scene: [BootScene, PreloadScene, HomeScene, MapScene] // Register Scenes
};

// Initialize Application
GameBootstrap.run().then(() => {
  // Initialize Phaser Game only after bootstrap is complete
  new Phaser.Game(config);
});
