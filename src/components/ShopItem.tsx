import type { UpgradeConfig } from '../types/game';
import useGameStore from '../stores/gameStore';
import { getUpgradeCost } from '../config/upgrades';
import { formatMultiplier } from '../utils/format';

interface ShopItemProps {
  upgrade: UpgradeConfig;
}

export default function ShopItem({ upgrade }: ShopItemProps) {
  const currency = useGameStore((state) => state.currency);
  const unlockedUpgrades = useGameStore((state) => state.unlockedUpgrades);
  const getUpgradeLevel = useGameStore((state) => state.getUpgradeLevel);
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade);

  const currentLevel = getUpgradeLevel(upgrade.id);
  const cost = getUpgradeCost(upgrade, currentLevel);
  const canAfford = currency >= cost;
  const isMaxLevel = upgrade.maxLevel !== undefined && currentLevel >= upgrade.maxLevel;

  // Check if upgrade is unlocked (permanently unlocked once requirements are met)
  const isUnlocked = !upgrade.unlockRequirement || unlockedUpgrades.includes(upgrade.id);

  const handlePurchase = () => {
    if (!canAfford || isMaxLevel || !isUnlocked) return;
    purchaseUpgrade(upgrade.id);
  };

  // Show locked state
  if (!isUnlocked) {
    return (
      <div className="bg-gray-700 rounded p-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="text-xl">🔒</div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-500">???</h3>
            <p className="text-xs text-gray-500">{upgrade.unlockRequirement!.displayText}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded p-2">
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">{upgrade.name}</h3>
          <p className="text-xs text-gray-400">{upgrade.description}</p>
        </div>
        {currentLevel > 0 && (
          <div className="text-xs font-bold text-blue-400 ml-2">Lv {currentLevel}</div>
        )}
      </div>

      {currentLevel > 0 && (
        <div className="text-xs text-green-400 mb-1">
          {upgrade.formatEffect(currentLevel)}
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={!canAfford || isMaxLevel}
        className={`w-full px-2 py-1.5 rounded text-xs font-semibold transition-all ${
          isMaxLevel
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
            : !canAfford
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isMaxLevel ? 'Max Level' : `Buy - ${formatMultiplier(cost)}`}
      </button>
    </div>
  );
}
