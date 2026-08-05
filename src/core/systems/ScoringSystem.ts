import { Logger } from '@/core/utils/Logger';
import { EventBus } from '@/core/events/EventBus';

export class ScoringSystem {
  private static instance: ScoringSystem;

  private currentScore = 0;
  private currentCombo = 0;
  private maxCombo = 0;
  private correctAnswers = 0;
  private wrongAnswers = 0;

  private constructor() {}

  static getInstance(): ScoringSystem {
    if (!ScoringSystem.instance) {
      ScoringSystem.instance = new ScoringSystem();
    }
    return ScoringSystem.instance;
  }

  resetSession(): void {
    this.currentScore = 0;
    this.currentCombo = 0;
    this.maxCombo = 0;
    this.correctAnswers = 0;
    this.wrongAnswers = 0;
    Logger.debug('ScoringSystem: Session reset');
    this.emitUpdate();
  }

  recordAnswer(isCorrect: boolean, baseScore = 100, timeBonus = 0): void {
    if (isCorrect) {
      this.correctAnswers++;
      this.currentCombo++;
      if (this.currentCombo > this.maxCombo) {
        this.maxCombo = this.currentCombo;
      }

      const comboMultiplier = 1 + this.currentCombo * 0.1;
      const pointsEarned = Math.floor((baseScore + timeBonus) * comboMultiplier);

      this.currentScore += pointsEarned;
      Logger.debug(`ScoringSystem: Correct! +${pointsEarned} pts (Combo: ${this.currentCombo}x)`);
    } else {
      this.wrongAnswers++;
      this.currentCombo = 0;
      Logger.debug('ScoringSystem: Wrong! Combo reset.');
    }
    this.emitUpdate();
  }

  calculateStars(): number {
    const total = this.correctAnswers + this.wrongAnswers;
    if (total === 0) return 0;

    const accuracy = this.correctAnswers / total;
    if (accuracy >= 0.9) return 3;
    if (accuracy >= 0.6) return 2;
    if (accuracy >= 0.3) return 1;
    return 0;
  }

  finalizeSession(levelId: string): void {
    const stars = this.calculateStars();
    const xpGained = this.currentScore; // 1 to 1 mapping for simplicity

    EventBus.getInstance().emit('GAMEPLAY:LEVEL_COMPLETE', {
      levelId,
      score: this.currentScore,
      stars,
      xpGained,
      maxCombo: this.maxCombo,
      correctAnswers: this.correctAnswers,
      wrongAnswers: this.wrongAnswers
    });

    Logger.info(`ScoringSystem: Session finalized for ${levelId} with ${stars} stars.`);
  }

  private emitUpdate(): void {
    EventBus.getInstance().emit('SCORING:UPDATED', {
      score: this.currentScore,
      combo: this.currentCombo
    });
  }
}
