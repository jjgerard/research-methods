// The "10 correct in a row" scoring engine every sub-level runs on (the
// same one as the quizzes in Shapes and Language). A wrong answer resets
// the streak to zero, so a sub-level is only done once 10 straight answers
// land. Reward AND penalty scale with the CURRENT bonus tier -- the streak
// going into this question -- so a wrong guess at a high streak is a real
// loss, not a free reroll. That's what stops a run of 10 being fished for
// by guessing: most questions here have only two possible answers.
const STREAK_TARGET = 10;
const STREAK_BASE_POINTS = 10;
const STREAK_TIER_SIZE = 3; // every 3-in-a-row doubles the multiplier

class StreakGame {
  constructor(target = STREAK_TARGET) {
    this.streak = 0;
    this.target = target;
  }
  multiplier() {
    return Math.pow(2, Math.floor(this.streak / STREAK_TIER_SIZE));
  }
  // Apply a correct/incorrect answer; returns {pointsDelta, streak,
  // progress (0-1), complete, multiplier (the one this answer scored at)}.
  answer(correct) {
    const multiplier = this.multiplier();
    const pointsDelta = (correct ? 1 : -1) * STREAK_BASE_POINTS * multiplier;
    this.streak = correct ? this.streak + 1 : 0;
    return {
      pointsDelta,
      multiplier,
      streak: this.streak,
      progress: Math.min(1, this.streak / this.target),
      complete: this.streak >= this.target,
    };
  }
}
