import useGameStore from '../stores/gameStore';
import { clearSaveData } from '../utils/storage';

export default function ResetButton() {
  const reset = useGameStore((state) => state.reset);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      clearSaveData();
      reset();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
    >
      Reset
    </button>
  );
}
