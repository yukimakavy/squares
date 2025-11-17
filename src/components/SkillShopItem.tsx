import type { SkillConfig } from '../types/game';
import useGameStore from '../stores/gameStore';
import { formatMultiplier } from '../utils/format';

interface SkillShopItemProps {
  skill: SkillConfig;
}

export default function SkillShopItem({ skill }: SkillShopItemProps) {
  const prestigeCurrencies = useGameStore((state) => state.prestigeCurrencies);
  const hasSkill = useGameStore((state) => state.hasSkill);
  const purchaseSkill = useGameStore((state) => state.purchaseSkill);

  const isPurchased = hasSkill(skill.id);
  const pinkSquares = prestigeCurrencies[0] || 0;
  const canAfford = pinkSquares >= skill.cost;

  // Check if prerequisites are met
  const prerequisitesMet = !skill.prerequisiteSkills ||
    skill.prerequisiteSkills.every(prereqId => hasSkill(prereqId));

  const handlePurchase = () => {
    if (!canAfford || isPurchased || !prerequisitesMet) return;
    purchaseSkill(skill.id);
  };

  return (
    <div className="bg-gray-700 rounded p-2">
      <div className="flex justify-between items-start mb-1">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">{skill.name}</h3>
          <p className="text-xs text-gray-400">{skill.description}</p>
        </div>
        {isPurchased && (
          <div className="text-xs font-bold text-green-400 ml-2">✓ Owned</div>
        )}
      </div>

      <button
        onClick={handlePurchase}
        disabled={!canAfford || isPurchased || !prerequisitesMet}
        className={`w-full px-2 py-1.5 rounded text-xs font-semibold transition-all ${
          isPurchased
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
            : !prerequisitesMet
            ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
            : !canAfford
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-pink-600 hover:bg-pink-700 text-white'
        }`}
      >
        {isPurchased
          ? 'Purchased'
          : !prerequisitesMet
          ? 'Locked'
          : `Buy - ${formatMultiplier(skill.cost)} 💗`}
      </button>
    </div>
  );
}
