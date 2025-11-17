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
      hasWon: state.hasWon,
      lastBlueSquareProduction: state.lastBlueSquareProduction,
      skills: state.skills,
      combosUnlocked: state.combosUnlocked,
      comboPoints: state.comboPoints,
      comboSquares: state.comboSquares,
      currentComboSquareIndex: state.currentComboSquareIndex,
      currentComboSquareFillProgress: state.currentComboSquareFillProgress,
      comboResultDisplay: state.comboResultDisplay,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    console.log('Game saved:', {
      prestigeLevel: state.prestigeLevel,
      currency: state.currency,
      mana: state.mana,
      upgrades: state.upgrades,
      spells: state.spells,
      comboPoints: state.comboPoints,
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

    // V1.0 -> V1.1 Migration: Refund pink squares spent on old skills
    let migratedPrestigeCurrencies = data.prestigeCurrencies ?? [];
    let migratedSkills = data.skills ?? [];

    if (data.skills && data.skills.length > 0) {
      // Define the old skill costs (from v1.0)
      const skillCosts: Record<string, number> = {
        'passive_generation': 1,
        'mana_boost_1': 2,
        'mana_boost_2': 20,
        'mana_boost_3': 100,
        'fill_rate_1': 2,
        'fill_rate_2': 100,
        'fill_rate_3': 5000,
      };

      // Calculate total refund for purchased skills
      let totalRefund = 0;
      for (const skill of data.skills) {
        if (skill.purchased && skillCosts[skill.id]) {
          totalRefund += skillCosts[skill.id];
          console.log(`[Migration] Refunding ${skillCosts[skill.id]} pink squares for skill ${skill.id}`);
        }
      }

      if (totalRefund > 0) {
        // Add refund to pink squares (prestigeCurrencies[0])
        migratedPrestigeCurrencies = [...migratedPrestigeCurrencies];
        migratedPrestigeCurrencies[0] = (migratedPrestigeCurrencies[0] || 0) + totalRefund;
        console.log(`[Migration] Total refund: ${totalRefund} pink squares. New total: ${migratedPrestigeCurrencies[0]}`);

        // Clear old skills
        migratedSkills = [];
      }
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
      prestigeCurrencies: migratedPrestigeCurrencies,
      currentTab: data.currentTab ?? 'squares',
      skillsUnlocked: data.skillsUnlocked ?? false,
      hasWon: data.hasWon,
      lastBlueSquareProduction: data.lastBlueSquareProduction ?? 0,
      skills: migratedSkills,
      combosUnlocked: data.combosUnlocked,
      comboPoints: data.comboPoints,
      comboSquares: data.comboSquares,
      currentComboSquareIndex: data.currentComboSquareIndex,
      currentComboSquareFillProgress: data.currentComboSquareFillProgress,
      comboResultDisplay: data.comboResultDisplay,
    };
    console.log('[loadGameState] Returning data - prestigeLevel:', result.prestigeLevel, 'currency:', result.currency, 'comboPoints:', result.comboPoints);
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
