import 'phaser';
import { GameBootstrap } from '@/core/GameBootstrap';
import { GameConstants } from '@/core/config/Constants';

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
  scene: [] // To be implemented
};

// Initialize Application
GameBootstrap.run().then(() => {
  // Initialize Phaser Game only after bootstrap is complete
  const game = new Phaser.Game(config);
});

