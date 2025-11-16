import { useMemo } from 'react';
import type { SquareState } from '../types/game';
import { getSquareColor, getSquareColorWithAlpha } from '../utils/colors';

interface SquareProps {
  square: SquareState;
  layer?: number;
}

export default function Square({ square, layer = 0 }: SquareProps) {
  const { filled, fillProgress, rowCompleted, row } = square;

  // Get color based on row and layer
  const baseColor = useMemo(() => getSquareColor(row, layer), [row, layer]);

  // Determine the fill height (bottom to top)
  const fillHeight = `${fillProgress * 100}%`;

  // Determine shine class
  const shineClass = rowCompleted
    ? 'square-shine-strong'
    : filled
    ? 'square-shine'
    : '';

  return (
    <div
      className="relative w-full h-full bg-gray-800 rounded-sm overflow-hidden"
      style={{
        border: filled ? `2px solid ${baseColor}` : '1px solid rgb(55, 65, 81)',
        boxShadow: filled ? `0 0 8px ${getSquareColorWithAlpha(row, 0.8, layer)}, inset 0 0 4px ${getSquareColorWithAlpha(row, 0.4, layer)}` : 'none',
      }}
    >
      {/* Fill animation - fills from bottom to top */}
      <div
        className="absolute bottom-0 left-0 right-0 transition-all duration-100 ease-linear"
        style={{
          height: fillHeight,
          backgroundColor: baseColor,
        }}
      />

      {/* Shine effect for filled squares */}
      {filled && (
        <div
          className={`absolute inset-0 ${shineClass}`}
          style={{
            backgroundColor: getSquareColorWithAlpha(row, 0.3, layer),
          }}
        />
      )}

      {/* Extra strong shine for row-completed squares */}
      {rowCompleted && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${getSquareColorWithAlpha(row, 0.4, layer)} 50%, transparent 100%)`,
          }}
        />
      )}
    </div>
  );
}
