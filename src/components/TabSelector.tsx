import useGameStore from '../stores/gameStore';

export default function TabSelector() {
  const currentTab = useGameStore((state) => state.currentTab);
  const setTab = useGameStore((state) => state.setTab);

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setTab('squares')}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          currentTab === 'squares'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        }`}
      >
        Squares
      </button>
      <button
        onClick={() => setTab('skills')}
        className={`px-4 py-2 rounded font-semibold transition-all ${
          currentTab === 'skills'
            ? 'bg-pink-600 text-white'
            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
        }`}
      >
        Skills
      </button>
    </div>
  );
}
