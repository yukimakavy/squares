import { UPGRADES, PINK_UPGRADES } from '../config/upgrades';
import ShopItem from './ShopItem';
import useGameStore from '../stores/gameStore';

export default function Shop() {
  const currentTab = useGameStore((state) => state.currentTab);
  const setTab = useGameStore((state) => state.setTab);
  const skillsUnlocked = useGameStore((state) => state.skillsUnlocked);

  const upgrades = currentTab === 'squares' ? UPGRADES : PINK_UPGRADES;

  return (
    <div className="bg-gray-800 rounded-lg p-2 overflow-y-auto max-h-96 md:w-64 md:max-h-none md:h-[428px]">
      {/* Tabs */}
      {skillsUnlocked && (
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => setTab('squares')}
            className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
              currentTab === 'squares' ? 'bg-orange-300' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-blue-600"></div>
          </button>
          <button
            onClick={() => setTab('skills')}
            className={`w-9 h-9 rounded flex items-center justify-center transition-all ${
              currentTab === 'skills' ? 'bg-orange-300' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="w-5 h-5 rounded bg-gradient-to-br from-pink-500 to-pink-600"></div>
          </button>
        </div>
      )}

      {/* Shop Items */}
      <div className="space-y-2">
        {upgrades.map((upgrade) => (
          <ShopItem key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
    </div>
  );
}
