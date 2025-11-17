import { useState } from 'react';
import useGameStore from '../stores/gameStore';

export default function WinMessage() {
  const hasWon = useGameStore((state) => state.hasWon);
  const [isDismissed, setIsDismissed] = useState(false);

  if (!hasWon || isDismissed) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-green-600 rounded-lg p-8 shadow-2xl max-w-md mx-4 pointer-events-auto relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-2 right-2 text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🎉 Congratulations! 🎉
          </h1>
          <p className="text-xl text-white mb-6">
            You've completed the Pink Grid and won the game!
          </p>
          <p className="text-lg text-white/90 mb-2">
            The Green Grid is not yet in the game.
          </p>
          <p className="text-sm text-white/80">
            Collecting green squares will act as a pink collection and give nothing.
          </p>
        </div>
      </div>
    </div>
  );
}
