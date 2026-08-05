import { GameStateStore } from '@/core/events/GameStateStore';

export class HUD extends Phaser.GameObjects.Container {
  private scoreText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private unsubscribeStore: () => void;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    const stateStore = GameStateStore.getInstance();
    const initialState = stateStore.getState();

    // UI Panel background
    const bg = scene.add.rectangle(0, 0, scene.scale.width, 60, 0x2c3e50, 0.9).setOrigin(0, 0);

    // Profile & Level
    this.levelText = scene.add.text(20, 15, `Level: ${initialState.profile.level}`, {
      fontSize: '22px',
      color: '#f1c40f',
      fontStyle: 'bold'
    });

    // Score / XP
    this.scoreText = scene.add
      .text(scene.scale.width - 20, 15, `XP: ${initialState.profile.totalXp}`, {
        fontSize: '22px',
        color: '#ecf0f1',
        fontStyle: 'bold'
      })
      .setOrigin(1, 0);

    this.add([bg, this.levelText, this.scoreText]);
    scene.add.existing(this);

    // Make HUD stay on top and fixed to camera
    this.setScrollFactor(0);
    this.setDepth(100);

    // Bind State
    this.unsubscribeStore = stateStore.subscribe((newState) => {
      this.levelText.setText(`Level: ${newState.profile.level}`);
      this.scoreText.setText(`XP: ${newState.profile.totalXp}`);
    });

    // Clean up when scene is destroyed
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, this.destroy, this);
  }

  destroy(fromScene?: boolean): void {
    if (this.unsubscribeStore) {
      this.unsubscribeStore();
    }
    super.destroy(fromScene);
  }
}
