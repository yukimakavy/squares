import useGameStore from '../stores/gameStore';

const SPEED_OPTIONS = [1, 10, 100] as const;

export default function SpeedToggle() {
  const debugSpeedMultiplier = useGameStore((state) => state.debugSpeedMultiplier);

  const handleToggle = () => {
    const currentIndex = SPEED_OPTIONS.indexOf(debugSpeedMultiplier as typeof SPEED_OPTIONS[number]);
    const nextIndex = (currentIndex + 1) % SPEED_OPTIONS.length;
    const nextSpeed = SPEED_OPTIONS[nextIndex];

    useGameStore.setState({ debugSpeedMultiplier: nextSpeed });
  };

  return (
    <button
      onClick={handleToggle}
      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
      title="Toggle game speed for testing"
    >
      {debugSpeedMultiplier}x
    </button>
  );
}
