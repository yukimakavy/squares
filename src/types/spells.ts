export interface SpellState {
  id: string;
  timesCast: number;
  activeUntil?: number; // Timestamp when effect expires (for duration spells)
}

export interface SpellConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseCost: number;
  costMultiplier: number; // Cost multiplier per cast
  duration?: number; // Duration in ms (for timed effects)
  effect: () => void;
}
