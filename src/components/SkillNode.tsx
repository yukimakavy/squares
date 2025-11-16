import type { SkillConfig } from '../types/game';
import useGameStore from '../stores/gameStore';
import { getSquareColor } from '../utils/colors';
import { formatMultiplier } from '../utils/format';

interface SkillNodeProps {
  skill: SkillConfig;
}

export default function SkillNode({ skill }: SkillNodeProps) {
  const prestigeCurrencies = useGameStore((state) => state.prestigeCurrencies);
  const hasSkill = useGameStore((state) => state.hasSkill);
  const purchaseSkill = useGameStore((state) => state.purchaseSkill);

  const isPurchased = hasSkill(skill.id);
  const pinkSquares = prestigeCurrencies[0] || 0;
  const canAfford = pinkSquares >= skill.cost;

  // Check prerequisites
  const hasPrerequisites = !skill.prerequisiteSkills || skill.prerequisiteSkills.every(prereqId => hasSkill(prereqId));

  const canPurchase = !isPurchased && canAfford && hasPrerequisites;

  const handlePurchase = () => {
    if (canPurchase) {
      purchaseSkill(skill.id);
    }
  };

  return (
    <div
      className={`rounded-lg p-2 border-2 transition-all w-full ${
        isPurchased
          ? 'bg-pink-900 border-pink-500'
          : canPurchase
          ? 'bg-gray-800 border-pink-600 hover:bg-gray-750 cursor-pointer active:scale-95'
          : 'bg-gray-900 border-gray-700 opacity-60'
      }`}
      onClick={handlePurchase}
    >
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1">
          <h3 className={`font-bold text-sm ${isPurchased ? 'text-pink-300' : 'text-white'}`}>
            {skill.name}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">{skill.description}</p>
        </div>
        {isPurchased && (
          <div className="text-lg ml-1">✓</div>
        )}
      </div>

      {!isPurchased && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs flex items-center gap-1.5">
              <span className="text-gray-400">Cost:</span>
              <div className="flex items-center gap-1">
                <span className={`font-semibold ${canAfford ? 'text-pink-400' : 'text-gray-500'}`}>
                  {formatMultiplier(skill.cost)}
                </span>
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: getSquareColor(0, 1) }}
                />
              </div>
            </div>
            {!hasPrerequisites && (
              <div className="text-xs text-red-400">Locked</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
