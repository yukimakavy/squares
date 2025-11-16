import { useEffect, useState, useRef } from 'react';
import useGameStore from '../stores/gameStore';
import { GRID_SIZE, type SquareState } from '../types/game';
import Square from './Square';

export default function LayerTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPrestigeLevel, setTransitionPrestigeLevel] = useState(0);
  const [transitionSquares, setTransitionSquares] = useState<SquareState[]>([]);

  const prestigeLevel = useGameStore((state) => state.prestigeLevel);
  const previousCompletedLayer = useGameStore((state) => state.previousCompletedLayer);
  const prevPrestigeLevelRef = useRef(prestigeLevel);

  useEffect(() => {
    // Check if prestige level just increased
    if (prestigeLevel > prevPrestigeLevelRef.current) {
      console.log('🎬 LayerTransition: Prestige level changed to', prestigeLevel);
      // Get the saved completed layer from the store
      const completedLayer = previousCompletedLayer;

      if (completedLayer && completedLayer.squares) {
        console.log('🎬 Starting transition animation');
        // Use the saved completed layer's squares for the animation
        setTransitionPrestigeLevel(prestigeLevel - 1);
        setTransitionSquares([...completedLayer.squares]);
        setIsTransitioning(true);

        // Hide transition after animation completes (1600ms - 2x slower)
        setTimeout(() => {
          console.log('🎬 Animation complete, unpausing game');
          setIsTransitioning(false);
          setTransitionSquares([]);
          // Unpause the game loop and clear the previous layer
          useGameStore.setState({ isPaused: false, previousCompletedLayer: null });
        }, 1600);
      } else {
        console.log('🎬 No previous layer found, unpausing immediately');
        // Failsafe: if previous layer doesn't exist, unpause immediately
        useGameStore.setState({ isPaused: false, previousCompletedLayer: null });
      }
    }
    prevPrestigeLevelRef.current = prestigeLevel;
  }, [prestigeLevel, previousCompletedLayer]);

  if (!isTransitioning || transitionSquares.length === 0) return null;

  // Organize squares into rows for display (same as Grid)
  const rows = [];
  for (let row = GRID_SIZE - 1; row >= 0; row--) {
    const rowSquares = transitionSquares.filter(s => s.row === row);
    rows.push({ rowSquares, rowNumber: row });
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Grid shrinking to bottom-left corner (first square position) */}
      <div
        className="absolute flex flex-col gap-1"
        style={{
          bottom: '8px', // Match the padding from Grid component
          left: '8px',
          transformOrigin: 'bottom left',
          animation: 'shrinkToFirstSquare 1.6s ease-in-out forwards',
        }}
      >
        {rows.map(({ rowSquares, rowNumber }) => (
          <div key={rowNumber} className="flex gap-1">
            {rowSquares.map((square) => (
              <div key={square.index} className="w-8 h-8">
                <Square square={square} layer={transitionPrestigeLevel} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shrinkToFirstSquare {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0.0833);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
