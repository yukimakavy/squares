import { useEffect, useRef } from 'react';
import useGameStore from '../stores/gameStore';

const OFFLINE_SPEED_MULTIPLIER = 60;

export function useGameLoop() {
  const tick = useGameStore((state) => state.tick);
  const offlineProgressRef = useRef<{ remainingTime: number; processingOffline: boolean }>({
    remainingTime: 0,
    processingOffline: false,
  });

  useEffect(() => {
    // Check for offline time on mount
    const lastUpdate = useGameStore.getState().lastUpdate;
    const now = Date.now();
    const offlineTime = now - lastUpdate;

    // Only give offline progress if away for more than 5 seconds
    // This prevents HMR during development from triggering offline progression
    if (offlineTime > 5000) {
      console.log('Processing offline time:', Math.floor(offlineTime / 1000), 'seconds');
      offlineProgressRef.current.remainingTime = offlineTime;
      offlineProgressRef.current.processingOffline = true;
      // Set the flag in the store
      useGameStore.setState({ isProcessingOffline: true });
    }

    // Game loop - runs every 100ms
    const interval = setInterval(() => {
      if (offlineProgressRef.current.processingOffline && offlineProgressRef.current.remainingTime > 0) {
        // Process offline time at 60x speed
        const tickTime = 100 * OFFLINE_SPEED_MULTIPLIER; // Process 6 seconds per tick
        const timeToProcess = Math.min(tickTime, offlineProgressRef.current.remainingTime);

        // Run multiple ticks to simulate the offline time
        const ticksToRun = Math.ceil(timeToProcess / 100);
        for (let i = 0; i < ticksToRun; i++) {
          tick();
        }

        offlineProgressRef.current.remainingTime -= timeToProcess;

        if (offlineProgressRef.current.remainingTime <= 0) {
          offlineProgressRef.current.processingOffline = false;
          // Clear the flag in the store
          useGameStore.setState({ isProcessingOffline: false });
        }
      } else {
        // Normal game loop
        tick();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [tick]);
}
