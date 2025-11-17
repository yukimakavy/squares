import { useEffect, useRef } from 'react';
import useGameStore from '../stores/gameStore';
import { saveGameState } from '../utils/storage';
import { prepareSaveData } from '../utils/saveData';

export function useAutosave() {
  const lastSaveRef = useRef(0);

  useEffect(() => {
    // Autosave every 3 seconds
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      saveGameState(prepareSaveData(state));
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
      saveGameState(prepareSaveData(state));
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
