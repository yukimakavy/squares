import useGameStore from '../stores/gameStore';
import { formatMultiplier } from '../utils/format';

export default function MultiDisplay() {
  const layer = useGameStore((state) => state.layer);
  const getTotalMultiplier = useGameStore((state) => state.getTotalMultiplier);

  if (!layer) return null;

  const totalMultiplier = getTotalMultiplier();

  if (totalMultiplier <= 1) return null;

  return (
    <div className="flex items-center justify-center px-4 py-2 h-[38px]">
      <div className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
        {formatMultiplier(totalMultiplier)}
      </div>
    </div>
  );
}
