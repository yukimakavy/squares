import useGameStore from '../stores/gameStore';
import { getSquareColor } from '../utils/colors';
import { formatMultiplier } from '../utils/format';

export default function CurrencyDisplay() {
  const currency = useGameStore((state) => state.currency);
  const mana = useGameStore((state) => state.mana);
  const prestigeCurrencies = useGameStore((state) => state.prestigeCurrencies);
  const comboPoints = useGameStore((state) => state.comboPoints);
  const combosUnlocked = useGameStore((state) => state.combosUnlocked);

  const blueColor = getSquareColor(0, 0); // Prestige 0 color (blue - start of gradient)

  return (
    <div className="flex items-center gap-3 md:gap-6">
      {/* Prestige 0 currency (blue squares) - always shown */}
      <div className="flex items-center gap-1 md:gap-2">
        <div className="text-lg md:text-2xl font-bold text-white">
          {formatMultiplier(Math.floor(currency))}
        </div>
        <div
          className="w-4 h-4 md:w-6 md:h-6 rounded-sm"
          style={{ backgroundColor: blueColor }}
        />
      </div>

      {/* Pink currency (prestige 1) - shown if you have any pink squares */}
      {prestigeCurrencies[0] > 0 && (
        <div className="flex items-center gap-1 md:gap-2">
          <div className="text-lg md:text-2xl font-bold text-white">
            {formatMultiplier(Math.floor(prestigeCurrencies[0]))}
          </div>
          <div
            className="w-4 h-4 md:w-6 md:h-6 rounded-sm"
            style={{ backgroundColor: getSquareColor(0, 1) }}
          />
        </div>
      )}

      {/* Mana currency */}
      {mana > 0 && (
        <div className="flex items-center gap-1 md:gap-2">
          <div className="text-lg md:text-2xl font-bold text-purple-400">
            {formatMultiplier(Math.floor(mana))}
          </div>
          <div className="text-lg md:text-2xl">🔮</div>
        </div>
      )}

      {/* Combo Points - shown if combos are unlocked */}
      {combosUnlocked && (
        <div className="flex items-center gap-1 md:gap-2">
          <div className="text-lg md:text-2xl font-bold text-purple-400">
            {formatMultiplier(Math.floor(comboPoints))}
          </div>
          <div className="relative w-4 h-4 md:w-5 md:h-5">
            {/* 2x2 grid of squares */}
            <div className="grid grid-cols-2 gap-0.5 w-full h-full">
              {/* Top-left: blue */}
              <div className="w-full h-full" style={{ backgroundColor: '#3b82f6' }} />
              {/* Top-right: pink */}
              <div className="w-full h-full" style={{ backgroundColor: '#ec4899' }} />
              {/* Bottom-left: green */}
              <div className="w-full h-full" style={{ backgroundColor: '#10b981' }} />
              {/* Bottom-right: orange */}
              <div className="w-full h-full" style={{ backgroundColor: '#f97316' }} />
            </div>
            {/* Center: white (overlaid) */}
            <div className="absolute top-1/2 left-1/2 w-1 h-1 md:w-1.5 md:h-1.5" style={{
              backgroundColor: '#f3f4f6',
              transform: 'translate(-50%, -50%)'
            }} />
          </div>
        </div>
      )}
    </div>
  );
}
