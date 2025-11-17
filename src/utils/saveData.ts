/**
 * Prepares game state for saving/exporting
 * Centralized to avoid duplication across autosave, export, and import
 */
export function prepareSaveData(state: any) {
  return {
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
  };
}
