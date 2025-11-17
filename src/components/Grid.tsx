import { useMemo } from 'react';
import useGameStore from '../stores/gameStore';
import Square from './Square';
import RowSlot from './RowSlot';
import LayerTransition from './LayerTransition';
import { GRID_SIZE } from '../types/game';

export default function Grid() {
  // Get the single reusable layer and prestigeLevel
  const layer = useGameStore((state) => state.layer);
  const prestigeLevel = useGameStore((state) => state.prestigeLevel);

  // Always call hooks in the same order (Rules of Hooks)
  const squares = layer?.squares || [];
  const rowBonuses = layer?.rowBonuses || [];

  const rows = useMemo(() => {
    const rowArray = [];
    // Display from top (row 11) to bottom (row 0)
    for (let row = GRID_SIZE - 1; row >= 0; row--) {
      const rowSquares = squares.filter(s => s.row === row);
      rowArray.push({ rowSquares, rowNumber: row });
    }
    return rowArray;
  }, [squares]);

  return (
    <div className="relative scale-[0.85] origin-top-left md:scale-100 md:inline-block">
      {/* Layer transition animation */}
      <LayerTransition />

      {rows.length === 0 ? (
        // Render placeholder if no rows (shouldn't happen normally)
        <div style={{ width: 400, height: 400 }} className="flex items-center justify-center text-gray-500">
          Loading layer...
        </div>
      ) : (
        <div className="flex gap-2" style={{ height: '428px' }}>
          {/* Grid with rows */}
          <div className="flex flex-col gap-1">
            {rows.map(({ rowSquares, rowNumber }) => (
              <div key={rowNumber} className="flex gap-1">
                {rowSquares.map((square) => (
                  <div key={square.index} className="w-8 h-8 flex-shrink-0">
                    <Square square={square} layer={prestigeLevel} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Slot machines column */}
          <div className="flex flex-col gap-1 w-20 flex-shrink-0">
            {rows.map(({ rowNumber }) => {
              const bonus = rowBonuses.find(b => b.row === rowNumber);
              return <RowSlot key={rowNumber} bonus={bonus || null} row={rowNumber} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
