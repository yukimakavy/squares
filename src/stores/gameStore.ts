import { create } from 'zustand';
import type { GameState, LayerState, SquareState, UpgradeState, SpellState, SkillState } from '../types/game';
import { GRID_SIZE, TOTAL_SQUARES, FILL_TIME, SPIN_DURATION, LAYER_TIME_MULTIPLIER } from '../types/game';
import { getRandomSlotMultiplier } from '../utils/random';
import { UPGRADES, getUpgradeCost } from '../config/upgrades';
import { SPELLS, getSpellCost } from '../config/spells';
import { SKILLS } from '../config/skills';
import { loadGameState } from '../utils/storage';

// Initialize grid squares (bottom-left to top-right, row by row)
const initializeSquares = (): SquareState[] => {
  const squares: SquareState[] = [];

  // Fill from bottom to top (row 0 is bottom)
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const index = row * GRID_SIZE + col;
      squares.push({
        index,
        row,
        col,
        filled: false,
        fillProgress: 0,
        rowCompleted: false,
      });
    }
  }

  return squares;
};

// Initialize the reusable layer
const initializeLayer = (): LayerState => {
  return {
    squares: initializeSquares(),
    totalSquares: 0,
    currentSquareIndex: 0,
    currentSquareFillProgress: 0,
    completedRows: 0,
    rowBonuses: [],
  };
};

// Calculate fill time for a specific square based on prestige level
const getSquareFillTime = (prestigeLevel: number, squareIndex: number, fillSpeedMultiplier: number, previousPrestigeLastSquareTime?: number, disableSlowdown: boolean = false): number => {
  if (prestigeLevel === 0) {
    // Prestige 0: base compounding time
    const compoundingFactor = disableSlowdown ? 1 : Math.pow(1.1, squareIndex);
    return FILL_TIME * compoundingFactor / fillSpeedMultiplier;
  } else {
    // Prestige 1+: starts at 200x the last square of previous prestige, then compounds
    const baseTime = previousPrestigeLastSquareTime! * LAYER_TIME_MULTIPLIER;
    const compoundingFactor = disableSlowdown ? 1 : Math.pow(1.1, squareIndex);
    return baseTime * compoundingFactor / fillSpeedMultiplier;
  }
};

interface GameActions {
  // Game loop
  tick: () => void;

  // Prestige management
  prestige: () => void;

  // Bonus management
  getTotalMultiplier: () => number;
  spinSlotForRow: (row: number) => void;

  // Collection
  collect: () => void;

  // Upgrades
  purchaseUpgrade: (upgradeId: string) => void;
  getUpgradeLevel: (upgradeId: string) => number;
  getFillSpeedMultiplier: () => number;
  getManaPerSecond: () => number;
  getPinkMultiplier: () => number;

  // Spells
  castSpell: (spellId: string) => void;
  getSpellTimesCast: (spellId: string) => number;
  isSpellActive: (spellId: string) => boolean;
  getSpellFillSpeedMultiplier: () => number;

  // Skills
  purchaseSkill: (skillId: string) => void;
  hasSkill: (skillId: string) => boolean;
  getPassiveGenerationRate: () => number;

  // UI
  setTab: (tab: 'squares' | 'skills') => void;

  // Utilities
  reset: () => void;
}

const useGameStore = create<GameState & GameActions>((set, get) => {
  // Load saved state
  const savedState = loadGameState();
  console.log('[gameStore] Initializing with savedState:', savedState ? {
    prestigeLevel: savedState.prestigeLevel,
    currency: savedState.currency,
    mana: savedState.mana
  } : 'null');

  return {
    // Initial state
    layer: savedState?.layer ?? initializeLayer(),
    prestigeLevel: savedState?.prestigeLevel ?? 0,
    previousCompletedLayer: null,
    currency: savedState?.currency ?? 0,
    mana: savedState?.mana ?? 0,
    hasCollected: savedState?.hasCollected ?? false,
    upgrades: savedState?.upgrades ?? [],
    unlockedUpgrades: savedState?.unlockedUpgrades ?? [],
    spells: savedState?.spells ?? [],
    lastUpdate: savedState?.lastUpdate ?? Date.now(),
    fillTime: FILL_TIME,
    isProcessingOffline: false,
    isPaused: false,
    debugSpeedMultiplier: 1, // Default to 1x speed
    debugDisableSlowdown: false, // Default to normal slowdown
    prestigeCurrencies: savedState?.prestigeCurrencies ?? [],
    currentTab: savedState?.currentTab ?? 'squares',
    skillsUnlocked: savedState?.skillsUnlocked ?? false,
    lastBlueSquareProduction: savedState?.lastBlueSquareProduction ?? 0,
    skills: savedState?.skills ?? [],

  // Game loop - updates square fill progress
  tick: () => {
    const now = Date.now();
    const state = get();

    // If paused, don't process game logic but update timestamp
    if (state.isPaused) {
      set({ lastUpdate: now });
      return;
    }

    const deltaTime = now - state.lastUpdate;

    // Check for newly unlocked upgrades
    const newlyUnlockedUpgrades = [...state.unlockedUpgrades];
    UPGRADES.forEach(upgrade => {
      if (!newlyUnlockedUpgrades.includes(upgrade.id) && upgrade.unlockRequirement) {
        const req = upgrade.unlockRequirement;
        let shouldUnlock = false;

        if (req.type === 'currency') {
          shouldUnlock = state.currency >= req.amount;
        } else if (req.type === 'prestige_currency') {
          const currencyAmount = state.prestigeCurrencies[req.currencyIndex!] || 0;
          shouldUnlock = currencyAmount >= req.amount;
        }

        if (shouldUnlock) {
          newlyUnlockedUpgrades.push(upgrade.id);
        }
      }
    });

    // Generate mana
    const manaPerSecond = get().getManaPerSecond();
    const manaGained = (manaPerSecond * deltaTime) / 1000;

    const layer = state.layer;

    // Passive blue square generation (from skills)
    const passiveRate = get().getPassiveGenerationRate();
    let passiveCurrency = 0;

    if (passiveRate > 0) {
      if (state.prestigeLevel === 0) {
        // On blue grid: use current squares × current row multipliers
        const currentMultiplier = get().getTotalMultiplier();
        const currentPotentialCollection = layer.totalSquares * currentMultiplier;
        passiveCurrency = (currentPotentialCollection * passiveRate * deltaTime) / 1000;
      } else if (state.lastBlueSquareProduction > 0) {
        // On pink grid: use stored blue square production from this run
        passiveCurrency = (state.lastBlueSquareProduction * passiveRate * deltaTime) / 1000;
      }
    }

    const updatedPrestigeCurrencies = state.prestigeCurrencies;

    // Check if layer is complete
    if (layer.currentSquareIndex >= TOTAL_SQUARES) {
      set({
        lastUpdate: now,
        mana: state.mana + manaGained,
        currency: state.currency + passiveCurrency,
        prestigeCurrencies: updatedPrestigeCurrencies,
        unlockedUpgrades: newlyUnlockedUpgrades,
      });
      return;
    }

    // Calculate fill speed (including debug multiplier)
    const fillSpeedMultiplier = get().getFillSpeedMultiplier() * get().getSpellFillSpeedMultiplier() * state.debugSpeedMultiplier;

    // Get previous prestige's last square fill time if not on prestige 0
    let previousPrestigeLastSquareTime: number | undefined;
    if (state.prestigeLevel > 0) {
      previousPrestigeLastSquareTime = getSquareFillTime(state.prestigeLevel - 1, TOTAL_SQUARES - 1, 1, undefined, state.debugDisableSlowdown);
    }

    let newSquareIndex = layer.currentSquareIndex;
    let newFillProgress = layer.currentSquareFillProgress;
    let newTotalSquares = layer.totalSquares;
    let newCompletedRows = layer.completedRows;
    const newRowBonuses = [...layer.rowBonuses];

    const updatedSquares = [...layer.squares];

    // Track remaining time to distribute across squares
    let remainingDeltaTime = deltaTime;

    // Handle square completion and progression
    while (remainingDeltaTime > 0 && newSquareIndex < TOTAL_SQUARES) {
      // Calculate fill time for the CURRENT square being filled
      const currentFillTime = getSquareFillTime(
        state.prestigeLevel,
        newSquareIndex,
        fillSpeedMultiplier,
        previousPrestigeLastSquareTime,
        state.debugDisableSlowdown
      );

      // How much time do we need to complete this square?
      const timeNeededToCompleteSquare = (1 - newFillProgress) * currentFillTime;

      if (remainingDeltaTime >= timeNeededToCompleteSquare) {
        // We have enough time to complete this square
        updatedSquares[newSquareIndex] = {
          ...updatedSquares[newSquareIndex],
          filled: true,
          fillProgress: 1,
        };

        newTotalSquares++;
        remainingDeltaTime -= timeNeededToCompleteSquare;
        newSquareIndex++;
        newFillProgress = 0; // Reset progress for next square
      } else {
        // Not enough time to complete this square, just update progress
        const fillIncrement = remainingDeltaTime / currentFillTime;
        newFillProgress += fillIncrement;
        remainingDeltaTime = 0;
      }

      // Check if we completed a row (only if we filled a square)
      if (newSquareIndex > layer.currentSquareIndex) {
        const completedSquare = updatedSquares[newSquareIndex - 1];
        const currentRow = completedSquare.row;
        const squaresInRow = updatedSquares.filter(s => s.row === currentRow);
        const rowIsComplete = squaresInRow.every(s => s.filled);

        if (rowIsComplete && !completedSquare.rowCompleted) {
          // Mark all squares in this row as row-completed
          squaresInRow.forEach(s => {
            updatedSquares[s.index] = {
              ...updatedSquares[s.index],
              rowCompleted: true,
            };
          });
          newCompletedRows++;

          // If processing offline, immediately resolve the slot
          if (state.isProcessingOffline) {
            const multiplier = getRandomSlotMultiplier();
            newRowBonuses.push({
              row: currentRow,
              multiplier,
              isSpinning: false,
            });
          } else {
            // Normal mode: start spinning slot for this row
            newRowBonuses.push({
              row: currentRow,
              multiplier: null,
              isSpinning: true,
            });

            // Schedule the slot to stop after SPIN_DURATION
            setTimeout(() => {
              get().spinSlotForRow(currentRow);
            }, SPIN_DURATION);
          }
        }

        // Check if we completed the entire grid - trigger prestige
        if (newSquareIndex === TOTAL_SQUARES) {
          get().prestige();
          // Don't continue updating the layer - prestige() already created a fresh one
          set({
            mana: state.mana + manaGained,
            currency: state.currency + passiveCurrency,
            lastUpdate: now,
            prestigeCurrencies: updatedPrestigeCurrencies,
          });
          return;
        }
      }
    }

    // Update current square's progress
    if (newSquareIndex < TOTAL_SQUARES) {
      updatedSquares[newSquareIndex] = {
        ...updatedSquares[newSquareIndex],
        fillProgress: newFillProgress,
      };
    }

    // Update the layer
    const newLayer = {
      ...layer,
      squares: updatedSquares,
      currentSquareIndex: newSquareIndex,
      currentSquareFillProgress: newFillProgress,
      totalSquares: newTotalSquares,
      completedRows: newCompletedRows,
      rowBonuses: newRowBonuses,
    };

    set({
      layer: newLayer,
      mana: state.mana + manaGained,
      currency: state.currency + passiveCurrency,
      lastUpdate: now,
      prestigeCurrencies: updatedPrestigeCurrencies,
      unlockedUpgrades: newlyUnlockedUpgrades,
    });
  },

  prestige: () => {
    const state = get();

    // Pause the game loop during transition
    set({ isPaused: true });

    // Save the completed layer for the transition animation
    const completedLayer = { ...state.layer };

    // Calculate blue square production for passive generation
    // This is the value that would have been collected from the blue grid
    let blueSquareProduction = 0;
    if (state.prestigeLevel === 0) {
      const finalMultiplier = get().getTotalMultiplier();
      blueSquareProduction = completedLayer.totalSquares * finalMultiplier;
    }

    // Create a fresh layer for the next prestige
    const newLayer = initializeLayer();
    // First square starts pre-filled since the entire previous grid = 1 square
    newLayer.squares[0].filled = true;
    newLayer.squares[0].fillProgress = 1;
    newLayer.totalSquares = 1;
    newLayer.currentSquareIndex = 1;

    // Increment prestige level and save the previous layer
    set({
      layer: newLayer,
      prestigeLevel: state.prestigeLevel + 1,
      previousCompletedLayer: completedLayer,
      lastBlueSquareProduction: blueSquareProduction > 0 ? blueSquareProduction : state.lastBlueSquareProduction,
    });
  },

  spinSlotForRow: (row: number) => {
    const state = get();
    const multiplier = getRandomSlotMultiplier();

    const layer = state.layer;
    const updatedBonuses = layer.rowBonuses.map(bonus =>
      bonus.row === row
        ? { ...bonus, multiplier, isSpinning: false }
        : bonus
    );

    const newLayer = { ...layer, rowBonuses: updatedBonuses };
    set({ layer: newLayer });
  },

  getTotalMultiplier: () => {
    const state = get();
    const layer = state.layer;

    if (!layer || !layer.rowBonuses) {
      return 1;
    }

    // Compound all locked bonuses
    return layer.rowBonuses.reduce((total, bonus) => {
      if (bonus.multiplier !== null) {
        return total * bonus.multiplier;
      }
      return total;
    }, 1);
  },

  collect: () => {
    set((state) => {
      const layer = state.layer;

      // Capture the totalSquares NOW before any updates
      const totalSquaresToCollect = layer.totalSquares;

      // Calculate final multiplier by force-completing any spinning animations
      const spinningBonuses = layer.rowBonuses.filter(b => b.isSpinning);
      let finalMultiplier: number;

      if (spinningBonuses.length > 0) {
        // Force complete animations by rolling multipliers
        const updatedBonuses = layer.rowBonuses.map(bonus => {
          if (bonus.isSpinning) {
            return {
              ...bonus,
              multiplier: getRandomSlotMultiplier(),
              isSpinning: false,
            };
          }
          return bonus;
        });

        // Calculate multiplier from updated bonuses
        finalMultiplier = updatedBonuses.reduce((total, bonus) => {
          if (bonus.multiplier !== null) {
            return total * bonus.multiplier;
          }
          return total;
        }, 1);
      } else {
        finalMultiplier = get().getTotalMultiplier();
      }

      const reward = totalSquaresToCollect * finalMultiplier;

      if (state.prestigeLevel === 0) {
        // Prestige 0: currency goes to main currency, reset layer but stay on prestige 0
        // Store this production for passive generation when on pink grid
        return {
          currency: state.currency + reward,
          hasCollected: true,
          layer: initializeLayer(),
          lastBlueSquareProduction: reward, // Remember this for passive generation
          lastUpdate: Date.now(),
        };
      } else {
        // Prestige 1+: currency goes to prestige-specific currency, reset back to prestige 0
        const updatedPrestigeCurrencies = [...state.prestigeCurrencies];
        const currencyIndex = state.prestigeLevel - 1;

        // Apply pink multiplier for prestige 1 (index 0)
        let finalReward = reward;
        if (currencyIndex === 0) {
          const pinkMultiplier = get().getPinkMultiplier();
          finalReward = reward * pinkMultiplier;
        }

        updatedPrestigeCurrencies[currencyIndex] = (updatedPrestigeCurrencies[currencyIndex] || 0) + finalReward;

        // Unlock skills tab if collecting pink squares for the first time
        const unlockSkills = currencyIndex === 0 && !state.skillsUnlocked;

        return {
          hasCollected: true,
          layer: initializeLayer(),
          prestigeLevel: 0, // Reset back to prestige 0 (blue squares)
          prestigeCurrencies: updatedPrestigeCurrencies,
          skillsUnlocked: unlockSkills ? true : state.skillsUnlocked,
          currency: 0, // Reset blue squares to 0
          upgrades: [], // Reset all upgrades
          lastBlueSquareProduction: 0, // Clear stored production on full reset
          lastUpdate: Date.now(),
        };
      }
    });
  },

  purchaseUpgrade: (upgradeId: string) => {
    const state = get();
    const upgradeConfig = UPGRADES.find(u => u.id === upgradeId);

    if (!upgradeConfig) return;

    const currentLevel = get().getUpgradeLevel(upgradeId);
    const cost = getUpgradeCost(upgradeConfig, currentLevel);

    // Check if can afford
    if (state.currency < cost) return;

    // Check max level
    if (upgradeConfig.maxLevel && currentLevel >= upgradeConfig.maxLevel) return;

    // Update or add upgrade
    const existingUpgradeIndex = state.upgrades.findIndex(u => u.id === upgradeId);
    let newUpgrades: UpgradeState[];

    if (existingUpgradeIndex >= 0) {
      newUpgrades = [...state.upgrades];
      newUpgrades[existingUpgradeIndex] = {
        ...newUpgrades[existingUpgradeIndex],
        level: currentLevel + 1,
      };
    } else {
      newUpgrades = [...state.upgrades, { id: upgradeId, level: 1 }];
    }

    set({
      currency: state.currency - cost,
      upgrades: newUpgrades,
    });
  },

  getUpgradeLevel: (upgradeId: string) => {
    const state = get();
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    return upgrade ? upgrade.level : 0;
  },

  getFillSpeedMultiplier: () => {
    const fillFasterLevel = get().getUpgradeLevel('fill_faster');
    const upgrade = UPGRADES.find(u => u.id === 'fill_faster');

    let multiplier = 1;
    if (upgrade && fillFasterLevel > 0) {
      multiplier *= upgrade.getEffect(fillFasterLevel);
    }

    // Apply skill multipliers (compounding)
    const state = get();
    state.skills.forEach(skill => {
      if (!skill.purchased) return;
      const skillConfig = SKILLS.find(s => s.id === skill.id);
      if (!skillConfig) return;
      if (skillConfig.effect.type === 'fill_speed_multiplier' && skillConfig.effect.value) {
        multiplier *= skillConfig.effect.value;
      }
    });

    return multiplier;
  },

  getManaPerSecond: () => {
    const manaGemLevel = get().getUpgradeLevel('mana_gem');
    const upgrade = UPGRADES.find(u => u.id === 'mana_gem');

    let baseRate = 0;
    if (upgrade && manaGemLevel > 0) {
      baseRate = upgrade.getEffect(manaGemLevel);
    }

    // Apply skill multipliers (compounding)
    let multiplier = 1;
    const state = get();
    state.skills.forEach(skill => {
      if (!skill.purchased) return;
      const skillConfig = SKILLS.find(s => s.id === skill.id);
      if (!skillConfig) return;
      if (skillConfig.effect.type === 'mana_multiplier' && skillConfig.effect.value) {
        multiplier *= skillConfig.effect.value;
      }
    });

    return baseRate * multiplier;
  },

  getPinkMultiplier: () => {
    const pinkMultiplierLevel = get().getUpgradeLevel('pink_multiplier');
    const upgrade = UPGRADES.find(u => u.id === 'pink_multiplier');

    if (!upgrade || pinkMultiplierLevel === 0) return 1;

    return upgrade.getEffect(pinkMultiplierLevel);
  },

  castSpell: (spellId: string) => {
    const state = get();
    const spellConfig = SPELLS.find(s => s.id === spellId);

    if (!spellConfig) return;

    const timesCast = get().getSpellTimesCast(spellId);
    const cost = getSpellCost(spellConfig, timesCast);

    // Check if can afford
    if (state.mana < cost) return;

    // Update or add spell
    const existingSpellIndex = state.spells.findIndex(s => s.id === spellId);
    let newSpells: SpellState[];

    if (existingSpellIndex >= 0) {
      newSpells = [...state.spells];
      newSpells[existingSpellIndex] = {
        ...newSpells[existingSpellIndex],
        timesCast: timesCast + 1,
        activeUntil: spellConfig.duration ? Date.now() + spellConfig.duration : newSpells[existingSpellIndex].activeUntil,
      };
    } else {
      newSpells = [...state.spells, {
        id: spellId,
        timesCast: 1,
        activeUntil: spellConfig.duration ? Date.now() + spellConfig.duration : undefined,
      }];
    }

    // Handle Magical Collect spell
    if (spellId === 'magical_collect') {
      const layer = state.layer;
      const multiplier = get().getTotalMultiplier();
      const reward = layer.totalSquares * multiplier;

      // Magical Collect always gives blue squares, even on pink grid
      set({
        mana: state.mana - cost,
        spells: newSpells,
        currency: state.currency + reward,
      });
    } else {
      set({
        mana: state.mana - cost,
        spells: newSpells,
      });
    }
  },

  getSpellTimesCast: (spellId: string) => {
    const state = get();
    const spell = state.spells.find(s => s.id === spellId);
    return spell ? spell.timesCast : 0;
  },

  isSpellActive: (spellId: string) => {
    const state = get();
    const spell = state.spells.find(s => s.id === spellId);
    if (!spell || !spell.activeUntil) return false;
    return Date.now() < spell.activeUntil;
  },

  getSpellFillSpeedMultiplier: () => {
    let multiplier = 1;

    // Haste: 10x speed for 30 seconds
    if (get().isSpellActive('haste')) {
      multiplier *= 10;
    }

    // Faster Squares: Permanent 2x speed per cast (stacks)
    const fasterSquaresCasts = get().getSpellTimesCast('faster_squares');
    if (fasterSquaresCasts > 0) {
      multiplier *= Math.pow(2, fasterSquaresCasts);
    }

    return multiplier;
  },

  purchaseSkill: (skillId: string) => {
    const state = get();
    const skillConfig = SKILLS.find(s => s.id === skillId);

    if (!skillConfig) return;

    // Check if already purchased
    const alreadyPurchased = state.skills.find(s => s.id === skillId);
    if (alreadyPurchased?.purchased) return;

    // Check currency
    const pinkSquares = state.prestigeCurrencies[0] || 0;
    if (pinkSquares < skillConfig.cost) return;

    // Check prerequisites
    if (skillConfig.prerequisiteSkills) {
      const hasAllPrerequisites = skillConfig.prerequisiteSkills.every(prereqId => {
        const prereqSkill = state.skills.find(s => s.id === prereqId);
        return prereqSkill?.purchased;
      });
      if (!hasAllPrerequisites) return;
    }

    // Purchase skill
    const updatedPrestigeCurrencies = [...state.prestigeCurrencies];
    updatedPrestigeCurrencies[0] = pinkSquares - skillConfig.cost;

    const newSkill: SkillState = {
      id: skillId,
      purchased: true,
    };

    const updatedSkills = state.skills.filter(s => s.id !== skillId);
    updatedSkills.push(newSkill);

    set({
      prestigeCurrencies: updatedPrestigeCurrencies,
      skills: updatedSkills,
    });
  },

  hasSkill: (skillId: string) => {
    const state = get();
    const skill = state.skills.find(s => s.id === skillId);
    return skill?.purchased || false;
  },

  getPassiveGenerationRate: () => {
    const state = get();
    let rate = 0;

    // Check all purchased skills
    state.skills.forEach(skill => {
      if (!skill.purchased) return;
      const skillConfig = SKILLS.find(s => s.id === skill.id);
      if (!skillConfig) return;
      if (skillConfig.effect.type === 'passive_generation' && skillConfig.effect.value !== undefined) {
        rate += skillConfig.effect.value;
      }
    });

    return rate;
  },

  setTab: (tab: 'squares' | 'skills') => {
    set({ currentTab: tab });
  },

  reset: () => {
    set({
      layer: initializeLayer(),
      prestigeLevel: 0,
      previousCompletedLayer: null,
      currency: 0,
      mana: 0,
      hasCollected: false,
      upgrades: [],
      unlockedUpgrades: [],
      spells: [],
      lastUpdate: Date.now(),
      fillTime: FILL_TIME,
      prestigeCurrencies: [],
      currentTab: 'squares',
      skillsUnlocked: false,
      lastBlueSquareProduction: 0,
      skills: [],
    });
  },
};
});

export default useGameStore;
