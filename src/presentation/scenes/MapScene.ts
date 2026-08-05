import { BaseScene } from './BaseScene';
import { GameConstants } from '@/core/config/Constants';
import { Button } from '@/presentation/components/Button';
import { HUD } from '@/presentation/components/HUD';
import { Dialog } from '@/presentation/components/Dialog';

export class MapScene extends BaseScene {
  constructor() {
    super(GameConstants.SCENES.MAP);
  }

  protected onCreate(): void {
    // 1. Add background
    this.add.rectangle(this.centerX, this.centerY, this.screenWidth, this.screenHeight, 0x27ae60);

    // 2. Add HUD
    new HUD(this);

    // 3. Add Title Text
    this.add
      .text(this.centerX, 100, 'PETA PETUALANGAN', {
        fontSize: '40px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    // 4. Back Button
    new Button(
      this,
      100,
      this.screenHeight - 50,
      'KEMBALI',
      () => {
        this.navigateTo(GameConstants.SCENES.HOME);
      },
      { width: 150, height: 50, color: 0xe74c3c, hoverColor: 0xc0392b }
    );

    // 5. Level Nodes
    this.createLevelNode(this.centerX - 150, this.centerY, '1', true);
    this.createLevelNode(this.centerX, this.centerY - 100, '2', false);
    this.createLevelNode(this.centerX + 150, this.centerY, '3', false);
  }

  private createLevelNode(x: number, y: number, levelText: string, isUnlocked: boolean): void {
    const color = isUnlocked ? 0xf1c40f : 0x7f8c8d;
    const node = this.add.circle(x, y, 40, color).setInteractive({ useHandCursor: isUnlocked });

    this.add
      .text(x, y, levelText, {
        fontSize: '32px',
        color: '#333333',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    node.on('pointerdown', () => {
      if (isUnlocked) {
        new Dialog(
          this,
          `Level ${levelText}`,
          `Apakah kamu siap bermain Level ${levelText}?`,
          () => {
            // Navigate to Quiz/Gameplay scene (not implemented yet)
            // this.navigateTo(GameConstants.SCENES.QUIZ, { levelId: `level_${levelText}` });
          },
          () => {}
        );
      }
    });
  }
}
