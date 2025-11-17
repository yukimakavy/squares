import Grid from './components/Grid';
import CurrencyDisplay from './components/CurrencyDisplay';
import CollectButton from './components/CollectButton';
import MultiDisplay from './components/MultiDisplay';
import Shop from './components/Shop';
import Spells from './components/Spells';
import ResetButton from './components/ResetButton';
import ExportButton from './components/ExportButton';
import ImportButton from './components/ImportButton';
import ChangelogButton from './components/ChangelogButton';
import TabSelector from './components/TabSelector';
import SkillTree from './components/SkillTree';
import { useGameLoop } from './hooks/useGameLoop';
import { useAutosave } from './hooks/useAutosave';
import useGameStore from './stores/gameStore';

function App() {
  const hasCollected = useGameStore((state) => state.hasCollected);
  const hasManaGem = useGameStore((state) => state.getUpgradeLevel('mana_gem')) > 0;
  const currentTab = useGameStore((state) => state.currentTab);
  const skillsUnlocked = useGameStore((state) => state.skillsUnlocked);

  // Initialize game loop and autosave
  useGameLoop();
  useAutosave();

  return (
    <div className="h-full bg-gray-900 text-white overflow-x-hidden">
      <div className="flex flex-col h-full">
        {/* Game area centered */}
        <div className="flex-1 flex items-start md:items-center md:justify-center p-2 md:p-4 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex flex-col gap-2 pb-20 md:pb-4 w-full md:w-auto">
            {/* Currency at top left of game area */}
            <div className="self-start overflow-x-auto w-full">
              <CurrencyDisplay />
            </div>

            {/* Tab selector - sticky on mobile, left aligned on desktop */}
            {skillsUnlocked && (
              <div className="sticky top-0 z-10 bg-gray-900 py-2 -mt-2 self-start w-full md:static md:py-0 md:mt-0 md:w-auto md:bg-transparent">
                <TabSelector />
              </div>
            )}

            {/* Game content */}
            {currentTab === 'squares' ? (
              <>
                {/* Desktop layout */}
                <div
                  className="hidden md:grid"
                  style={{
                    gridTemplateColumns: hasCollected ? '256px 4px auto' : 'auto',
                    gridTemplateRows: hasManaGem ? 'auto 6px auto 6px auto' : 'auto 6px auto',
                    gap: 0,
                    minHeight: hasManaGem ? '650px' : '544px'
                  }}
                >
                  {/* Row 1: Spells (full width) */}
                  {hasManaGem && (
                    <div style={{ gridColumn: '1 / -1', gridRow: 1 }}>
                      <Spells />
                    </div>
                  )}

                  {/* Row gap */}
                  {hasManaGem && <div style={{ gridColumn: '1 / -1', gridRow: 2, height: '6px' }} />}

                  {/* Row 2: Shop | Grid */}
                  {hasCollected && <div style={{ gridColumn: 1, gridRow: hasManaGem ? 3 : 1 }}><Shop /></div>}
                  {hasCollected && <div style={{ gridColumn: 2, gridRow: hasManaGem ? 3 : 1 }} />}
                  <div style={{ gridColumn: hasCollected ? 3 : 1, gridRow: hasManaGem ? 3 : 1 }}>
                    <Grid />
                  </div>

                  {/* Row gap */}
                  <div style={{ gridColumn: '1 / -1', gridRow: hasManaGem ? 4 : 2, height: '6px' }} />

                  {/* Row 3: Empty | Collect+Multi matching Grid's internal structure */}
                  {hasCollected && <div style={{ gridColumn: 1, gridRow: hasManaGem ? 5 : 3 }} />}
                  {hasCollected && <div style={{ gridColumn: 2, gridRow: hasManaGem ? 5 : 3 }} />}
                  <div style={{ gridColumn: hasCollected ? 3 : 1, gridRow: hasManaGem ? 5 : 3 }}>
                    <div className="flex gap-2">
                      <div className="flex-1 flex justify-center items-center">
                        <CollectButton />
                      </div>
                      <div className="flex justify-center items-center" style={{ width: '80px' }}>
                        <MultiDisplay />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile layout - vertical stack */}
                <div className="md:hidden flex flex-col gap-2">
                  {hasManaGem && <Spells />}

                  <div className="flex flex-col">
                    <Grid />
                    <div className="flex gap-2 items-end -mt-24" style={{ transform: 'scale(0.72)', transformOrigin: 'top left', width: 'calc(100% / 0.72)' }}>
                      <CollectButton />
                      <MultiDisplay />
                    </div>
                  </div>

                  {hasCollected && <Shop />}
                </div>
              </>
            ) : (
              <SkillTree />
            )}

            {/* Save controls - inline at bottom on mobile, floating on desktop */}
            <div className="flex gap-2 justify-center md:hidden mt-4">
              <ChangelogButton />
              <ExportButton />
              <ImportButton />
              <ResetButton />
            </div>
          </div>
        </div>
      </div>

      {/* Save controls - bottom right on desktop only */}
      <div className="hidden md:block fixed bottom-4 right-4">
        <div className="flex gap-2">
          <ChangelogButton />
          <ExportButton />
          <ImportButton />
          <ResetButton />
        </div>
      </div>
    </div>
  );
}

export default App;
