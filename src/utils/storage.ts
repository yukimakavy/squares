import type { GameState } from '../types/game';

const SAVE_KEY = 'squares_game_save';

export function saveGameState(state: Partial<GameState>): void {
  try {
    const saveData = {
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
      lastBlueSquareProduction: state.lastBlueSquareProduction,
      skills: state.skills,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game saved:', {
      prestigeLevel: state.prestigeLevel,
      currency: state.currency,
      mana: state.mana,
      upgrades: state.upgrades,
      spells: state.spells,
      timestamp: new Date().toLocaleTimeString()
    });
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): Partial<GameState> | null {
  try {
    console.log('[loadGameState] Called');
    const saved = localStorage.getItem(SAVE_KEY);
    console.log('[loadGameState] Raw saved data length:', saved?.length);
    if (!saved) {
      console.log('[loadGameState] No saved data found');
      return null;
    }

    const data = JSON.parse(saved);
    console.log('[loadGameState] Parsed data - prestigeLevel:', data.prestigeLevel, 'currency:', data.currency);

    // Migration: If old save doesn't have layer, return null to start fresh
    if (!data.layer && !data.layers) {
      console.log('Old save format detected, starting fresh');
      localStorage.removeItem(SAVE_KEY);
      return null;
    }

    const result = {
      layer: data.layer,
      prestigeLevel: data.prestigeLevel ?? 0,
      currency: data.currency ?? 0,
      mana: data.mana ?? 0,
      upgrades: data.upgrades ?? [],
      unlockedUpgrades: data.unlockedUpgrades ?? [],
      hasCollected: data.hasCollected ?? false,
      spells: data.spells ?? [],
      lastUpdate: data.lastUpdate,
      prestigeCurrencies: data.prestigeCurrencies ?? [],
      currentTab: data.currentTab ?? 'squares',
      skillsUnlocked: data.skillsUnlocked ?? false,
      lastBlueSquareProduction: data.lastBlueSquareProduction ?? 0,
      skills: data.skills ?? [],
    };
    console.log('[loadGameState] Returning data - prestigeLevel:', result.prestigeLevel, 'currency:', result.currency);
    return result;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearSaveData(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.error('Failed to clear save data:', error);
  }
}
