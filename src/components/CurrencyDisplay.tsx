import useGameStore from '../stores/gameStore';
import { getSquareColor } from '../utils/colors';
import { formatMultiplier } from '../utils/format';

export default function CurrencyDisplay() {
  const currency = useGameStore((state) => state.currency);
  const mana = useGameStore((state) => state.mana);
  const prestigeCurrencies = useGameStore((state) => state.prestigeCurrencies);

  const blueColor = getSquareColor(0, 0); // Prestige 0 color (blue - start of gradient)

  return (
    <div className="flex items-center gap-6">
      {/* Prestige 0 currency (blue squares) - always shown */}
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold text-white">
          {formatMultiplier(Math.floor(currency))}
        </div>
        <div
          className="w-6 h-6 rounded-sm"
          style={{ backgroundColor: blueColor }}
        />
      </div>

      {/* Pink currency (prestige 1) - shown if you have any pink squares */}
      {prestigeCurrencies[0] > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">
            {formatMultiplier(Math.floor(prestigeCurrencies[0]))}
          </div>
          <div
            className="w-6 h-6 rounded-sm"
            style={{ backgroundColor: getSquareColor(0, 1) }}
          />
        </div>
      )}

      {/* Mana currency */}
      {mana > 0 && (
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-purple-400">
            {formatMultiplier(Math.floor(mana))}
          </div>
          <div className="text-2xl">🔮</div>
        </div>
      )}
    </div>
  );
}
