import type { SkillConfig } from '../types/game';

export const SKILLS: SkillConfig[] = [
  // Passive Generation - One time purchase
  {
    id: 'passive_generation',
    name: '⏳ Passive Generation',
    description: 'Generate 10% of blue squares per second passively',
    cost: 1,
    costCurrency: 'pink',
    effect: {
      type: 'passive_generation',
      value: 0.10, // 10% per second
    },
  },

  // Mana Boost - 3 levels
  {
    id: 'mana_boost_1',
    name: '🔮 Mana Boost I',
    description: '5x mana generation',
    cost: 2,
    costCurrency: 'pink',
    effect: {
      type: 'mana_multiplier',
      value: 5,
    },
  },
  {
    id: 'mana_boost_2',
    name: '🔮 Mana Boost II',
    description: '10x mana generation',
    cost: 20,
    costCurrency: 'pink',
    prerequisiteSkills: ['mana_boost_1'],
    effect: {
      type: 'mana_multiplier',
      value: 10,
    },
  },
  {
    id: 'mana_boost_3',
    name: '🔮 Mana Boost III',
    description: '20x mana generation',
    cost: 100,
    costCurrency: 'pink',
    prerequisiteSkills: ['mana_boost_2'],
    effect: {
      type: 'mana_multiplier',
      value: 20,
    },
  },

  // Fill Rate - 3 levels
  {
    id: 'fill_rate_1',
    name: '⚡ Fill Rate I',
    description: '3x fill rate',
    cost: 2,
    costCurrency: 'pink',
    effect: {
      type: 'fill_speed_multiplier',
      value: 3,
    },
  },
  {
    id: 'fill_rate_2',
    name: '⚡ Fill Rate II',
    description: '10x fill rate',
    cost: 100,
    costCurrency: 'pink',
    prerequisiteSkills: ['fill_rate_1'],
    effect: {
      type: 'fill_speed_multiplier',
      value: 10,
    },
  },
  {
    id: 'fill_rate_3',
    name: '⚡ Fill Rate III',
    description: '100x fill rate',
    cost: 5000,
    costCurrency: 'pink',
    prerequisiteSkills: ['fill_rate_2'],
    effect: {
      type: 'fill_speed_multiplier',
      value: 100,
    },
  },
];
