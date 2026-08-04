import 'phaser';

// Boot Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 768,
  height: 1024,
  parent: 'app',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#000000',
  scene: [] // To be implemented
};

// Initialize Phaser Game
const game = new Phaser.Game(config);

export default game;
