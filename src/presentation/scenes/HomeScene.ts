import { BaseScene } from './BaseScene';
import { GameConstants } from '@/core/config/Constants';
import { Button } from '@/presentation/components/Button';
import { Dialog } from '@/presentation/components/Dialog';
import { HUD } from '@/presentation/components/HUD';

export class HomeScene extends BaseScene {
  constructor() {
    super(GameConstants.SCENES.HOME);
  }

  protected onCreate(): void {
    // 1. Add background
    this.add.rectangle(this.centerX, this.centerY, this.screenWidth, this.screenHeight, 0x3498db);

    // 2. Add HUD
    new HUD(this);

    // 3. Add Title Text
    this.add
      .text(this.centerX, this.centerY - 100, GameConstants.GAME_TITLE, {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    // 4. Reusable Play Button
    new Button(this, this.centerX, this.centerY + 50, 'MAIN', () => {
      this.navigateTo(GameConstants.SCENES.MAP);
    });

    // 5. Settings / Info Button showing a Dialog
    new Button(
      this,
      this.centerX,
      this.centerY + 130,
      'INFO',
      () => {
        new Dialog(
          this,
          'Tentang Game',
          'Game Petualangan Pancasila dibuat untuk edukasi nilai-nilai Pancasila.',
          () => {}
        );
      },
      { color: 0x9b59b6, hoverColor: 0x8e44ad }
    );
  }
}
