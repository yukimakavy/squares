import { useEffect, useRef } from 'react';
import useGameStore from '../stores/gameStore';
import { saveGameState } from '../utils/storage';

export function useAutosave() {
  const lastSaveRef = useRef(0);

  useEffect(() => {
    // Autosave every 3 seconds
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      saveGameState({
        layer: state.layer,
        prestigeLevel: state.prestigeLevel,
        currency: state.currency,
        mana: state.mana,
        upgrades: state.upgrades,
        unlockedUpgrades: state.unlockedUpgrades,
        hasCollected: state.hasCollected,
        spells: state.spells,
        lastUpdate: state.lastUpdate,
        prestigeCurrencies: state.prestigeCurrencies,
        currentTab: state.currentTab,
        skillsUnlocked: state.skillsUnlocked,
        hasWon: state.hasWon,
        lastBlueSquareProduction: state.lastBlueSquareProduction,
        skills: state.skills,
        combosUnlocked: state.combosUnlocked,
        comboPoints: state.comboPoints,
        comboSquares: state.comboSquares,
        currentComboSquareIndex: state.currentComboSquareIndex,
        currentComboSquareFillProgress: state.currentComboSquareFillProgress,
        comboResultDisplay: state.comboResultDisplay,
      });
      lastSaveRef.current = Date.now();
    }, 3000);

    // Save on page unload
    const handleBeforeUnload = () => {
      // Skip saving if we're in the middle of importing
      if (sessionStorage.getItem('importing_save') === 'true') {
        console.log('[useAutosave] Skipping beforeunload save - import in progress');
        sessionStorage.removeItem('importing_save');
        return;
      }

      const state = useGameStore.getState();
      saveGameState({
        layer: state.layer,
        prestigeLevel: state.prestigeLevel,
        currency: state.currency,
        mana: state.mana,
        upgrades: state.upgrades,
        unlockedUpgrades: state.unlockedUpgrades,
        hasCollected: state.hasCollected,
        spells: state.spells,
        lastUpdate: state.lastUpdate,
        prestigeCurrencies: state.prestigeCurrencies,
        currentTab: state.currentTab,
        skillsUnlocked: state.skillsUnlocked,
        hasWon: state.hasWon,
        lastBlueSquareProduction: state.lastBlueSquareProduction,
        skills: state.skills,
        combosUnlocked: state.combosUnlocked,
        comboPoints: state.comboPoints,
        comboSquares: state.comboSquares,
        currentComboSquareIndex: state.currentComboSquareIndex,
        currentComboSquareFillProgress: state.currentComboSquareFillProgress,
        comboResultDisplay: state.comboResultDisplay,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Save one last time on unmount
      handleBeforeUnload();
    };
  }, []);
}
