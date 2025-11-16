import useGameStore from '../stores/gameStore';
import { formatMultiplier } from '../utils/format';
import { getSquareColor } from '../utils/colors';

export default function CollectButton() {
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const layer = useGameStore((state) => state.layer);
  const getTotalMultiplier = useGameStore((state) => state.getTotalMultiplier);
  const getPinkMultiplier = useGameStore((state) => state.getPinkMultiplier);
  const collect = useGameStore((state) => state.collect);

  const totalSquares = layer?.totalSquares || 0;
  const multiplier = getTotalMultiplier();
  let reward = totalSquares * multiplier;

  // Apply pink multiplier when on pink grid (prestige level 1)
  if (prestigeLevel === 1) {
    reward = reward * getPinkMultiplier();
  }

  // Can collect whenever there are squares filled (both blue and pink grids)
  const canCollect = totalSquares > 0;

  // Get color for current prestige level (use start color for button gradient)
  const layerColor = getSquareColor(0, prestigeLevel);

  if (!layer) return null;

  // Convert RGB to RGBA for gradient
  const createGradient = (color: string) => {
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch;
      const colorWithAlpha = `rgba(${r}, ${g}, ${b}, 0.87)`;
      return `linear-gradient(to right, ${color}, ${colorWithAlpha})`;
    }
    return color;
  };

  const buttonStyle = canCollect ? {
    background: createGradient(layerColor),
  } : {};

  return (
    <button
      onClick={collect}
      disabled={!canCollect}
      className={`px-6 py-2 rounded font-semibold text-sm transition-all min-w-[140px] ${
        !canCollect
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : 'text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
      }`}
      style={buttonStyle}
    >
      Collect {reward > 0 ? `+${formatMultiplier(reward)}` : ''}
    </button>
  );
}
