/**
 * Reusable Button Component for Phaser
 */
export class Button extends Phaser.GameObjects.Container {
  private bg: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image;
  private textElement: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    onClick: () => void,
    options: {
      width?: number;
      height?: number;
      color?: number;
      hoverColor?: number;
      textColor?: string;
      fontSize?: string;
    } = {}
  ) {
    super(scene, x, y);

    const {
      width = 200,
      height = 60,
      color = 0x3498db,
      hoverColor = 0x2980b9,
      textColor = '#ffffff',
      fontSize = '24px'
    } = options;

    this.bg = scene.add
      .rectangle(0, 0, width, height, color)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5);

    this.textElement = scene.add
      .text(0, 0, text, {
        fontSize,
        color: textColor,
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add([this.bg, this.textElement]);

    this.bg.on('pointerover', () =>
      (this.bg as Phaser.GameObjects.Rectangle).setFillStyle(hoverColor)
    );
    this.bg.on('pointerout', () => (this.bg as Phaser.GameObjects.Rectangle).setFillStyle(color));

    this.bg.on('pointerdown', () => {
      // Add slight click effect
      this.y += 2;
      scene.time.delayedCall(100, () => {
        this.y -= 2;
        onClick();
      });
    });

    scene.add.existing(this);
  }

  setText(newText: string): void {
    this.textElement.setText(newText);
  }
}
