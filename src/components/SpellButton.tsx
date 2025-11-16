import { useEffect, useState } from 'react';
import useGameStore from '../stores/gameStore';
import type { SpellConfig } from '../types/spells';
import { getSpellCost } from '../config/spells';
import { formatMultiplier } from '../utils/format';

interface SpellButtonProps {
  spell: SpellConfig;
}

export default function SpellButton({ spell }: SpellButtonProps) {
  const mana = useGameStore((state) => state.mana);
  const castSpell = useGameStore((state) => state.castSpell);
  const getSpellTimesCast = useGameStore((state) => state.getSpellTimesCast);
  const isSpellActive = useGameStore((state) => state.isSpellActive);

  const timesCast = getSpellTimesCast(spell.id);
  const cost = getSpellCost(spell, timesCast);
  const canAfford = mana >= cost;
  const active = isSpellActive(spell.id);

  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if (!active || !spell.duration) return;

    const interval = setInterval(() => {
      const state = useGameStore.getState();
      const spellState = state.spells.find(s => s.id === spell.id);
      if (spellState?.activeUntil) {
        const remaining = Math.max(0, Math.ceil((spellState.activeUntil - Date.now()) / 1000));
        setRemainingTime(remaining);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [active, spell.id, spell.duration]);

  const handleCast = () => {
    if (!canAfford) return;
    castSpell(spell.id);
  };

  return (
    <div className="bg-gray-700 rounded p-3 flex flex-col" style={{ minWidth: '180px' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{spell.icon}</span>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-white">{spell.name}</h3>
          <p className="text-xs text-gray-400">{spell.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-1" style={{ minHeight: '16px' }}>
        {timesCast > 0 && (
          <div className="text-blue-400">
            Cast {timesCast}x
          </div>
        )}
        {active && spell.duration && (
          <div className="text-green-400 font-bold ml-auto">
            {remainingTime}s
          </div>
        )}
      </div>

      <button
        onClick={handleCast}
        disabled={!canAfford || (active && spell.id === 'haste')}
        className={`w-full px-2 py-1.5 rounded text-xs font-semibold transition-all ${
          !canAfford || (active && spell.id === 'haste')
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        Cast - {formatMultiplier(cost)} 🔮
      </button>
    </div>
  );
}
