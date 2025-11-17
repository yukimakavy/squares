import useGameStore from '../stores/gameStore';
import ComboSquare from './ComboSquare';
import ShopItem from './ShopItem';
import { COMBO_PAYOUTS } from '../types/game';
import { COMBO_UPGRADES } from '../config/upgrades';
import { calculateComboType } from '../utils/combos';

export default function Combos() {
  const comboSquares = useGameStore((state) => state.comboSquares);
  const comboResultDisplay = useGameStore((state) => state.comboResultDisplay);
  const hasManaGem = useGameStore((state) => state.getUpgradeLevel('mana_gem')) > 0;
  const getUpgradeLevel = useGameStore((state) => state.getUpgradeLevel);
  const hideMaxedUpgrades = useGameStore((state) => state.hideMaxedUpgrades);
  const setHideMaxedUpgrades = useGameStore((state) => state.setHideMaxedUpgrades);
  useGameStore((state) => state.upgrades); // Subscribe to upgrades array for reactivity

  // Calculate current hand type using centralized utility
  const currentHandType = calculateComboType(comboSquares);

  // Filter out maxed upgrades if hideMaxedUpgrades is enabled
  const comboUpgrades = hideMaxedUpgrades
    ? COMBO_UPGRADES.filter((upgrade) => {
        const currentLevel = getUpgradeLevel(upgrade.id);
        return !upgrade.maxLevel || currentLevel < upgrade.maxLevel;
      })
    : COMBO_UPGRADES;

  // Calculate modified payout for display based on current cards
  // This matches the exact logic in gameStore.ts lines 320-343
  const getModifiedPayout = (basePoints: number) => {
    let points = basePoints;

    // 1. Apply "More Combo Points" upgrade (always applies to all hands)
    const moreComboPointsLevel = getUpgradeLevel('more_combo_points');
    if (moreComboPointsLevel > 0) {
      const upgrade = COMBO_UPGRADES.find(u => u.id === 'more_combo_points');
      if (upgrade) {
        points *= upgrade.getEffect(moreComboPointsLevel);
      }
    }

    // Apply situational upgrades based on current visible cards
    const filledSquares = comboSquares.filter(s => s.filled);

    // 2. Lucky Blue upgrade (2x per blue card) - applies to ALL blue cards currently visible
    if (getUpgradeLevel('lucky_blue') > 0) {
      const blueCount = filledSquares.filter(s => s.color === 'blue').length;
      if (blueCount > 0) {
        points *= Math.pow(2, blueCount);
      }
    }

    // 3. Crazy Pink upgrade (100x if 3+ pink cards) - checks ALL pink cards currently visible
    if (getUpgradeLevel('crazy_pink') > 0) {
      const pinkCount = filledSquares.filter(s => s.color === 'pink').length;
      if (pinkCount >= 3) {
        points *= 100;
      }
    }

    return Math.floor(points);
  };

  return (
    <>
      {/* Desktop layout - matches main game grid */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: '256px 6px auto',
          gridTemplateRows: 'auto',
          gap: 0,
          minHeight: hasManaGem ? '650px' : '544px',
        }}
      >
        {/* Combo Shop - left side */}
        <div className="bg-gray-800 rounded-lg p-2 text-white md:w-64">
          {/* Hide Maxed Upgrades Checkbox */}
          <label className="flex items-center gap-2 mb-2 cursor-pointer text-xs text-gray-300 px-2 pt-2">
            <input
              type="checkbox"
              checked={hideMaxedUpgrades}
              onChange={(e) => setHideMaxedUpgrades(e.target.checked)}
              className="w-3 h-3 cursor-pointer"
            />
            <span>Hide maxed upgrades</span>
          </label>

          {/* Shop Items */}
          <div className="space-y-2 px-2">
            {comboUpgrades.map((upgrade) => (
              <ShopItem key={upgrade.id} upgrade={upgrade} />
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div />

        {/* Combo Game Area - right side */}
        <div className="bg-gray-800 rounded-lg p-6 text-white">
          {/* Combo Squares */}
          <div className="mb-8">
            <div className="flex gap-4 justify-center">
              {comboSquares.map((square) => (
                <ComboSquare key={square.index} square={square} />
              ))}
            </div>
          </div>

          {/* Payout Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Payouts</h3>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="space-y-0">
                {COMBO_PAYOUTS.map((payout, index) => {
                  const isCurrentHand = currentHandType === payout.type;
                  const isResultDisplay = comboResultDisplay && comboResultDisplay.active && comboResultDisplay.comboType === payout.type;
                  const displayPoints = isResultDisplay ? comboResultDisplay.points : getModifiedPayout(payout.points);
                  return (
                    <div
                      key={payout.type}
                      className={`flex justify-between items-center py-2 transition-all duration-200 ${
                        index > 0 ? 'border-t border-gray-700' : ''
                      } ${
                        isResultDisplay ? 'bg-orange-900/50 -mx-2 px-2 rounded' : isCurrentHand ? 'bg-purple-900/40 -mx-2 px-2 rounded' : ''
                      }`}
                    >
                      <span className={`font-medium ${
                        isResultDisplay ? 'text-orange-300 font-bold text-base' : isCurrentHand ? 'text-purple-300 font-bold text-sm' : 'text-gray-200 text-sm'
                      }`}>
                        {payout.name}
                      </span>
                      <span className={`font-bold ${
                        isResultDisplay ? 'text-orange-300 text-lg' : isCurrentHand ? 'text-purple-300 text-sm' : 'text-yellow-400 text-sm'
                      }`}>
                        {displayPoints.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout - stacked */}
      <div className="md:hidden flex flex-col gap-4">
        {/* Combo Game Area */}
        <div className="bg-gray-800 rounded-lg p-4 text-white">
          {/* Combo Squares */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center flex-wrap">
              {comboSquares.map((square) => (
                <ComboSquare key={square.index} square={square} />
              ))}
            </div>
          </div>

          {/* Payout Table */}
          <div>
            <h3 className="text-base font-semibold mb-2">Payouts</h3>
            <div className="bg-gray-900 rounded-lg p-3">
              <div className="space-y-0">
                {COMBO_PAYOUTS.map((payout, index) => {
                  const isCurrentHand = currentHandType === payout.type;
                  const isResultDisplay = comboResultDisplay && comboResultDisplay.active && comboResultDisplay.comboType === payout.type;
                  const displayPoints = isResultDisplay ? comboResultDisplay.points : getModifiedPayout(payout.points);
                  return (
                    <div
                      key={payout.type}
                      className={`flex justify-between items-center py-2 transition-all duration-200 ${
                        index > 0 ? 'border-t border-gray-700' : ''
                      } ${
                        isResultDisplay ? 'bg-orange-900/50 -mx-2 px-2 rounded' : isCurrentHand ? 'bg-purple-900/40 -mx-2 px-2 rounded' : ''
                      }`}
                    >
                      <span className={`font-medium ${
                        isResultDisplay ? 'text-orange-300 font-bold text-sm' : isCurrentHand ? 'text-purple-300 font-bold text-xs' : 'text-gray-200 text-xs'
                      }`}>
                        {payout.name}
                      </span>
                      <span className={`font-bold ${
                        isResultDisplay ? 'text-orange-300 text-base' : isCurrentHand ? 'text-purple-300 text-xs' : 'text-yellow-400 text-xs'
                      }`}>
                        {displayPoints.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Combo Shop */}
        <div className="bg-gray-800 rounded-lg p-4 text-white">
          {/* Hide Maxed Upgrades Checkbox */}
          <label className="flex items-center gap-2 mb-2 cursor-pointer text-xs text-gray-300">
            <input
              type="checkbox"
              checked={hideMaxedUpgrades}
              onChange={(e) => setHideMaxedUpgrades(e.target.checked)}
              className="w-3 h-3 cursor-pointer"
            />
            <span>Hide maxed upgrades</span>
          </label>

          {/* Shop Items */}
          <div className="space-y-2">
            {comboUpgrades.map((upgrade) => (
              <ShopItem key={upgrade.id} upgrade={upgrade} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
