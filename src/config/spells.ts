import type { SpellConfig } from '../types/spells';

export const SPELLS: SpellConfig[] = [
  {
    id: 'haste',
    name: 'Haste',
    icon: '⚡',
    description: '10x square fill speed for 30 seconds',
    baseCost: 20,
    costMultiplier: 2,
    duration: 30000, // 30 seconds
    effect: () => {
      // Effect is handled in game loop
    },
  },
  {
    id: 'magical_collect',
    name: 'Magical Collect',
    icon: '✨',
    description: 'Collect blue squares without resetting',
    baseCost: 50,
    costMultiplier: 2,
    effect: () => {
      // Effect is handled in spell cast
    },
  },
  {
    id: 'faster_squares',
    name: 'Faster Squares',
    icon: '🚀',
    description: 'Permanent 2x square fill speed',
    baseCost: 100,
    costMultiplier: 2,
    effect: () => {
      // Effect is handled in game loop
    },
  },
];

export function getSpellCost(spell: SpellConfig, timesCast: number): number {
  return Math.floor(spell.baseCost * Math.pow(spell.costMultiplier, timesCast));
}
