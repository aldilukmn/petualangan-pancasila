import { Button } from './Button';

export class Dialog extends Phaser.GameObjects.Container {
  private overlay: Phaser.GameObjects.Rectangle;
  private panel: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    title: string,
    content: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    const width = scene.scale.width;
    const height = scene.scale.height;
    const centerX = width / 2;
    const centerY = height / 2;

    super(scene, centerX, centerY);

    // Dark overlay background
    this.overlay = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.7)
      .setInteractive()
      .setOrigin(0.5);

    // Main Panel
    this.panel = scene.add.rectangle(0, 0, 400, 300, 0xffffff).setOrigin(0.5);

    const titleText = scene.add
      .text(0, -100, title, {
        fontSize: '28px',
        color: '#333333',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    const contentText = scene.add
      .text(0, -20, content, {
        fontSize: '20px',
        color: '#666666',
        align: 'center',
        wordWrap: { width: 350 }
      })
      .setOrigin(0.5);

    this.add([this.overlay, this.panel, titleText, contentText]);

    // Buttons
    if (onCancel) {
      const cancelBtn = new Button(
        scene,
        -90,
        80,
        'Batal',
        () => {
          onCancel();
          this.close();
        },
        { width: 150, color: 0x95a5a6, hoverColor: 0x7f8c8d }
      );

      const confirmBtn = new Button(
        scene,
        90,
        80,
        'Ya',
        () => {
          onConfirm();
          this.close();
        },
        { width: 150, color: 0xe74c3c, hoverColor: 0xc0392b }
      );

      this.add([cancelBtn, confirmBtn]);
    } else {
      const okBtn = new Button(
        scene,
        0,
        80,
        'OK',
        () => {
          onConfirm();
          this.close();
        },
        { width: 200, color: 0x2ecc71, hoverColor: 0x27ae60 }
      );
      this.add(okBtn);
    }

    // Animation
    this.setAlpha(0);
    this.setScale(0.8);
    scene.add.existing(this);

    scene.tweens.add({
      targets: this,
      alpha: 1,
      scale: 1,
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  close(): void {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0.8,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
