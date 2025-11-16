import useGameStore from '../stores/gameStore';

export default function SlowdownToggle() {
  const debugDisableSlowdown = useGameStore((state) => state.debugDisableSlowdown);

  const handleToggle = () => {
    useGameStore.setState({ debugDisableSlowdown: !debugDisableSlowdown });
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1.5 text-white text-sm rounded transition-colors ${
        debugDisableSlowdown
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-gray-600 hover:bg-gray-700'
      }`}
      title="Toggle speed decrease per square (debug)"
    >
      {debugDisableSlowdown ? 'Flat' : 'Slow'}
    </button>
  );
}
