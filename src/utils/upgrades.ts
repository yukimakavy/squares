import type { UpgradeConfig } from '../types/game';

/**
 * Applies an upgrade multiplier if the upgrade is purchased
 * This consolidates the repetitive pattern of looking up upgrades and applying their effects
 */
export function applyUpgradeMultiplier(
  upgrades: UpgradeConfig[],
  upgradeId: string,
  currentLevel: number,
  baseMultiplier: number
): number {
  if (currentLevel <= 0) return baseMultiplier;

  const config = upgrades.find(u => u.id === upgradeId);
  if (!config) return baseMultiplier;

  return baseMultiplier * config.getEffect(currentLevel);
}

/**
 * Applies multiple upgrade multipliers in sequence
 */
export function applyMultipleUpgrades(
  baseMultiplier: number,
  ...upgradeSources: Array<{
    upgrades: UpgradeConfig[];
    upgradeId: string;
    currentLevel: number;
  }>
): number {
  return upgradeSources.reduce(
    (multiplier, source) =>
      applyUpgradeMultiplier(source.upgrades, source.upgradeId, source.currentLevel, multiplier),
    baseMultiplier
  );
}
