import { UPGRADES } from '../config/upgrades';
import ShopItem from './ShopItem';

export default function Shop() {
  return (
    <div className="bg-gray-800 rounded-lg p-2 overflow-y-auto w-full max-h-96 md:w-64 md:max-h-none md:h-[428px]">
      <div className="space-y-2">
        {UPGRADES.map((upgrade) => (
          <ShopItem key={upgrade.id} upgrade={upgrade} />
        ))}
      </div>
    </div>
  );
}
