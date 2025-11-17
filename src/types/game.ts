export interface GameState {
  // Single reusable layer
  layer: LayerState;

  // Prestige system
  prestigeLevel: number; // How many times the layer has been completed (0 = first time, 1 = first prestige, etc.)
  previousCompletedLayer: LayerState | null; // The completed layer before prestige (for animation)

  // Currency (layer 0 currency, used for upgrades)
  currency: number;
  mana: number;
  hasCollected: boolean;

  // Upgrades
  upgrades: UpgradeState[];
  unlockedUpgrades: string[]; // IDs of upgrades that have been permanently unlocked

  // Spells
  spells: SpellState[];

  // Game meta
  lastUpdate: number;
  fillTime: number; // Time in ms to fill one square
  isProcessingOffline: boolean; // True when processing offline time
  isPaused: boolean; // True when game loop should pause (e.g., during layer transitions)
  debugSpeedMultiplier: number; // Debug speed multiplier (1x, 10x, 100x) for testing
  debugDisableSlowdown: boolean; // Debug flag to disable speed decrease per square

  // Prestige currencies (for each prestige level)
  prestigeCurrencies: number[]; // Index 0 = first prestige currency, etc.

  // UI state
  currentTab: 'squares' | 'skills'; // Current active tab
  skillsUnlocked: boolean; // Whether the Skills tab has been unlocked (ever had pink squares)

  // Passive generation state
  lastBlueSquareProduction: number; // The blue square collection amount from current run, used for passive generation during pink grid

  // Skills
  skills: SkillState[];
}

export interface LayerState {
  squares: SquareState[];
  totalSquares: number;
  currentSquareIndex: number;
  currentSquareFillProgress: number; // 0 to 1
  completedRows: number;
  rowBonuses: RowBonus[];
}

export interface SpellState {
  id: string;
  timesCast: number;
  activeUntil?: number; // Timestamp when effect expires (for duration spells)
}

export interface SquareState {
  index: number;
  row: number;
  col: number;
  filled: boolean;
  fillProgress: number; // 0 to 1
  rowCompleted: boolean; // True if the entire row is completed
}

export interface RowBonus {
  row: number;
  multiplier: number | null; // null while spinning, set when animation completes
  isSpinning: boolean;
}

// Slot machine multiplier options with probabilities
export interface SlotOption {
  multiplier: number;
  probability: number;
}

export const SLOT_OPTIONS: SlotOption[] = [
  { multiplier: 1.5, probability: 0.30 },
  { multiplier: 2, probability: 0.25 },
  { multiplier: 3, probability: 0.20 },
  { multiplier: 4, probability: 0.15 },
  { multiplier: 5, probability: 0.07 },
  { multiplier: 10, probability: 0.03 },
];

// Constants
export const GRID_SIZE = 12;
export const TOTAL_SQUARES = GRID_SIZE * GRID_SIZE;
export const FILL_TIME = 1000; // 1 second per square
export const SPIN_DURATION = 300; // 0.3 seconds for slot machine spin
export const LAYER_TIME_MULTIPLIER = 200; // Each layer's squares take 200x longer than the previous layer's last square
export const PASSIVE_GENERATION_RATE = 0.01; // 1% per second passive generation for completed layers

// Layer color configurations
export interface LayerConfig {
  layer: number;
  name: string;
  colorFrom: string; // Gradient start color
  colorTo: string; // Gradient end color
}

export const LAYER_CONFIGS: LayerConfig[] = [
  { layer: 0, name: 'Blue Squares', colorFrom: '#3b82f6', colorTo: '#ec4899' }, // blue-500 to pink-500
  { layer: 1, name: 'Pink Squares', colorFrom: '#ec4899', colorTo: '#10b981' }, // pink-500 to green-500
  { layer: 2, name: 'Green Squares', colorFrom: '#10b981', colorTo: '#eab308' }, // green-500 to yellow-500
];

export interface UpgradeState {
  id: string;
  level: number;
}

export interface UpgradeConfig {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number; // Cost multiplier per level
  maxLevel?: number;
  costCurrency?: 'blue' | 'pink'; // Currency type (defaults to 'blue' if not specified)
  getEffect: (level: number) => number; // Calculate effect for given level
  formatEffect: (level: number) => string; // Format effect for display
  unlockRequirement?: {
    type: 'currency' | 'prestige_currency';
    currencyIndex?: number; // For prestige_currency, which prestige level (0 = first prestige, etc.)
    amount: number;
    displayText: string;
  };
}

export interface SkillState {
  id: string;
  purchased: boolean;
}

export interface SkillConfig {
  id: string;
  name: string;
  description: string;
  cost: number;
  costCurrency: 'pink'; // Which prestige currency to use
  prerequisiteSkills?: string[]; // IDs of skills that must be purchased first
  effect: {
    type: 'passive_generation' | 'mana_multiplier' | 'fill_speed_multiplier' | 'unlock_combat';
    value?: number; // For passive_generation (% per second), mana_multiplier (multiplier), fill_speed_multiplier (multiplier)
  };
}
