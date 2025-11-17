import useGameStore from '../stores/gameStore';
import { formatMultiplier } from '../utils/format';
import { SLOT_OPTIONS } from '../types/game';

// Calculate expected value per slot: sum of (multiplier × probability)
const EXPECTED_MULTIPLIER_PER_SLOT = SLOT_OPTIONS.reduce(
  (sum, option) => sum + option.multiplier * option.probability,
  0
);

export default function MultiDisplay() {
  const layer = useGameStore((state) => state.layer);
  const getTotalMultiplier = useGameStore((state) => state.getTotalMultiplier);

  if (!layer) return null;

  const totalMultiplier = getTotalMultiplier();

  if (totalMultiplier <= 1) return null;

  // Count completed rows (rows with finalized multipliers)
  const completedRowCount = layer.rowBonuses.filter(b => b.multiplier !== null).length;

  // Calculate expected total multiplier for this many rows
  const expectedMultiplier = Math.pow(EXPECTED_MULTIPLIER_PER_SLOT, completedRowCount);

  // Calculate luck ratio (guard against division by zero, though it shouldn't happen)
  const luckRatio = expectedMultiplier > 0 ? totalMultiplier / expectedMultiplier : 1;

  // Determine luck indicator
  // ↑↑ = 1.4x or more (significantly above expected)
  // ↑  = 1.0x to 1.4x (above expected)
  // ↓  = 0.6x to 1.0x (below expected)
  // ↓↓ = below 0.6x (significantly below expected)
  let luckIndicator = '';
  let luckColor = '';

  if (luckRatio >= 1.4) {
    luckIndicator = '↑↑';
    luckColor = 'text-green-400';
  } else if (luckRatio >= 1.0) {
    luckIndicator = '↑';
    luckColor = 'text-green-400';
  } else if (luckRatio >= 0.6) {
    luckIndicator = '↓';
    luckColor = 'text-red-400';
  } else {
    luckIndicator = '↓↓';
    luckColor = 'text-red-400';
  }

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-2 h-[38px]">
      <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
        {formatMultiplier(totalMultiplier)}
      </div>
      <div className={`text-sm font-bold ${luckColor}`}>
        {luckIndicator}
      </div>
    </div>
  );
}
