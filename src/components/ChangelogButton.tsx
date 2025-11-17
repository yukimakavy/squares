import { useState } from 'react';

export default function ChangelogButton() {
  const [showChangelog, setShowChangelog] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowChangelog(true)}
        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors"
      >
        Changelog
      </button>

      {showChangelog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Changelog</h2>
              <button
                onClick={() => setShowChangelog(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">V1.1</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Added QOL indicators that show how lucky or unlucky your total multi is</li>
                  <li>Fixed bug that made unfinished multi animations not count for passive blue generation when you fill the grid</li>
                  <li>Increased passive blue generation from 5% to 10%</li>
                  <li>Updated Magical Collect description to clarify it only collects blue squares, not pink</li>
                  <li>Moved skills to be a pink square shop</li>
                  <li>Skills now have a max level</li>
                  <li>Rebalanced pink grid</li>
                  <li>Current endgame - ~1m pink squares. You can technically finish the pink grid if you are patient but there is content for filling the pink grid</li>
                  <li>Slightly improved mobile browser layout</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">V1.0 - Release</h3>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Initial release</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
