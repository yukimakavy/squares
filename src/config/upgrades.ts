import type { UpgradeConfig } from '../types/game';

// Blue square upgrades
export const UPGRADES: UpgradeConfig[] = [
  {
    id: 'fill_faster',
    name: '⏱️ Fill Faster',
    description: 'Squares fill 20% faster per level',
    baseCost: 5,
    costMultiplier: 2, // Cost doubles each level
    maxLevel: 25,
    getEffect: (level: number) => {
      // 20% faster per level, compounding: 1.2^level (speed multiplier)
      return Math.pow(1.2, level);
    },
    formatEffect: (level: number) => {
      // Calculate actual speed multiplier: 1.2^level
      const speedMultiplier = Math.pow(1.2, level);
      const speedIncrease = ((speedMultiplier - 1) * 100).toFixed(0);
      return `${speedIncrease}% faster`;
    },
  },
  {
    id: 'mana_gem',
    name: '🔮 Mana Gem',
    description: 'Generates mana over time',
    baseCost: 2000,
    costMultiplier: 1.2,
    maxLevel: 50,
    unlockRequirement: {
      type: 'currency',
      amount: 2000,
      displayText: 'Get 2k blue squares to unlock',
    },
    getEffect: (level: number) => {
      // 0.1 mana/second per level
      return level * 0.1;
    },
    formatEffect: (level: number) => {
      const manaPerSecond = (level * 0.1).toFixed(1);
      return `${manaPerSecond} mana/s`;
    },
  },
  {
    id: 'pink_multiplier',
    name: '💗 Pink Multiplier',
    description: 'Doubles pink squares per level',
    baseCost: 1000000,
    costMultiplier: 10, // Cost increases 10x per level
    maxLevel: 5,
    unlockRequirement: {
      type: 'prestige_currency',
      currencyIndex: 0, // First prestige currency (pink squares)
      amount: 1,
      displayText: 'Get 1 Pink square to unlock',
    },
    getEffect: (level: number) => {
      // 2^level multiplier
      return Math.pow(2, level);
    },
    formatEffect: (level: number) => {
      const multiplier = Math.pow(2, level);
      return `${multiplier}x pink squares`;
    },
  },
];

// Pink square upgrades
export const PINK_UPGRADES: UpgradeConfig[] = [
  {
    id: 'passive_generation',
    name: '⏳ Passive Generation',
    description: 'Generate 10% of blue squares per second passively',
    baseCost: 1,
    costMultiplier: 1,
    maxLevel: 1,
    costCurrency: 'pink',
    unlockRequirement: {
      type: 'prestige_currency',
      currencyIndex: 0,
      amount: 1,
      displayText: 'Get 1 Pink square to unlock',
    },
    getEffect: (level: number) => level * 0.1,
    formatEffect: () => '10% per second',
  },
  {
    id: 'mana_boost',
    name: '🔮 Mana Boost',
    description: 'Mana generation 5x per level',
    baseCost: 4,
    costMultiplier: 5,
    maxLevel: 5,
    costCurrency: 'pink',
    unlockRequirement: {
      type: 'prestige_currency',
      currencyIndex: 0,
      amount: 1,
      displayText: 'Get 1 Pink square to unlock',
    },
    getEffect: (level: number) => {
      const multipliers = [0, 5, 25, 125, 625, 3125];
      return multipliers[level] || 0;
    },
    formatEffect: (level: number) => {
      const multipliers = [0, 5, 25, 125, 625, 3125];
      return `${multipliers[level]}x mana`;
    },
  },
  {
    id: 'fill_rate',
    name: '⚡ Fill Rate',
    description: 'Fill rate 5x per level',
    baseCost: 4,
    costMultiplier: 5,
    maxLevel: 5,
    costCurrency: 'pink',
    unlockRequirement: {
      type: 'prestige_currency',
      currencyIndex: 0,
      amount: 1,
      displayText: 'Get 1 Pink square to unlock',
    },
    getEffect: (level: number) => {
      const multipliers = [0, 5, 25, 125, 625, 3125];
      return multipliers[level] || 0;
    },
    formatEffect: (level: number) => {
      const multipliers = [0, 5, 25, 125, 625, 3125];
      return `${multipliers[level]}x fill rate`;
    },
  },
];

export function getUpgradeCost(upgrade: UpgradeConfig, currentLevel: number): number {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
}
