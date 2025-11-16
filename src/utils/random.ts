import { SLOT_OPTIONS } from '../types/game';

// Weighted random selection for slot machine
export const getRandomSlotMultiplier = (): number => {
  const random = Math.random();
  let cumulativeProbability = 0;

  for (const option of SLOT_OPTIONS) {
    cumulativeProbability += option.probability;
    if (random <= cumulativeProbability) {
      return option.multiplier;
    }
  }

  // Fallback (should never reach here if probabilities sum to 1)
  return SLOT_OPTIONS[0].multiplier;
};
