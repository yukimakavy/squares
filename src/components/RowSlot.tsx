import { useState, useEffect } from 'react';
import type { RowBonus } from '../types/game';
import { SLOT_OPTIONS } from '../types/game';
import { getSquareColor } from '../utils/colors';

interface RowSlotProps {
  bonus: RowBonus | null;
  row: number;
}

export default function RowSlot({ bonus, row }: RowSlotProps) {
  const [displayValue, setDisplayValue] = useState<number>(2);
  const color = getSquareColor(row);

  // Animate through values while spinning
  useEffect(() => {
    if (!bonus) return;

    if (!bonus.isSpinning) {
      if (bonus.multiplier !== null) {
        setDisplayValue(bonus.multiplier);
      }
      return;
    }

    // Rapidly cycle through values while spinning
    const interval = setInterval(() => {
      const randomOption = SLOT_OPTIONS[Math.floor(Math.random() * SLOT_OPTIONS.length)];
      setDisplayValue(randomOption.multiplier);
    }, 100);

    return () => clearInterval(interval);
  }, [bonus]);

  if (!bonus) {
    return <div className="h-8 w-full" />;
  }

  const isSpinning = bonus.isSpinning;

  return (
    <div
      className="h-8 w-full flex items-center justify-center rounded border-2 transition-all duration-200"
      style={{
        borderColor: isSpinning ? color : 'rgba(107, 114, 128, 0.5)',
        backgroundColor: isSpinning ? 'rgba(31, 41, 55, 0.8)' : 'rgba(17, 24, 39, 0.6)',
      }}
    >
      <div
        className={`text-lg font-bold transition-all ${
          isSpinning ? 'animate-spin-slot' : 'animate-lock-in'
        }`}
        style={{ color: isSpinning ? '#fff' : color }}
      >
        {displayValue}
      </div>
    </div>
  );
}
