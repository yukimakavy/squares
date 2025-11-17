import useGameStore from '../stores/gameStore';

export default function TabSelector() {
  const currentTab = useGameStore((state) => state.currentTab);
  const setTab = useGameStore((state) => state.setTab);

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setTab('squares')}
        className="w-12 h-12 rounded flex items-center justify-center transition-all bg-gray-700 hover:bg-gray-600"
      >
        <div
          className={`rounded bg-gradient-to-br from-blue-500 to-blue-600 transition-all ${
            currentTab === 'squares' ? 'w-8 h-8' : 'w-6 h-6'
          }`}
        ></div>
      </button>
      <button
        onClick={() => setTab('skills')}
        className="w-12 h-12 rounded flex items-center justify-center transition-all bg-gray-700 hover:bg-gray-600"
      >
        <div
          className={`rounded bg-gradient-to-br from-pink-500 to-pink-600 transition-all ${
            currentTab === 'skills' ? 'w-8 h-8' : 'w-6 h-6'
          }`}
        ></div>
      </button>
    </div>
  );
}
