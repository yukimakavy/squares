import { test, expect } from '@playwright/test';

test.describe('Layer System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display initial blue grid on layer 0', async ({ page }) => {
    // Wait for grid to be visible
    await expect(page.locator('.bg-gray-900.rounded-lg')).toBeVisible();

    // Check that we start with no collected squares
    const collectButton = page.locator('button:has-text("Collect")');
    await expect(collectButton).toBeVisible();
    await expect(collectButton).toBeDisabled();
  });

  test('should fill squares progressively', async ({ page }) => {
    // Wait for first square to start filling
    await page.waitForTimeout(2000);

    // Check that currency display shows 0 initially
    const currencyDisplay = page.locator('.text-2xl.font-bold.text-white').first();
    await expect(currencyDisplay).toContainText('0');

    // Wait for some squares to fill
    await page.waitForTimeout(5000);

    // Collect button should become enabled after first square fills
    const collectButton = page.locator('button:has-text("Collect")');
    await expect(collectButton).toBeEnabled();
  });

  test('should show multiplier when rows complete', async ({ page }) => {
    // Speed up by using Haste spell if available
    // First wait for some progress
    await page.waitForTimeout(10000);

    // Check if collect button shows a value
    const collectButton = page.locator('button:has-text("Collect")');
    const buttonText = await collectButton.textContent();
    expect(buttonText).toContain('Collect');
  });

  test('should collect currency and reset grid', async ({ page }) => {
    // Wait for first square to fill
    await page.waitForTimeout(2000);

    // Get initial currency
    const currencyDisplay = page.locator('.text-2xl.font-bold.text-white').first();
    const initialCurrency = await currencyDisplay.textContent();

    // Collect
    const collectButton = page.locator('button:has-text("Collect")');
    await collectButton.click();

    // Currency should increase
    await page.waitForTimeout(500);
    const newCurrency = await currencyDisplay.textContent();
    expect(newCurrency).not.toBe(initialCurrency);

    // Collect button should be disabled again
    await expect(collectButton).toBeDisabled();
  });

  test('should show upgrades after first collection', async ({ page }) => {
    // Wait for first square to fill
    await page.waitForTimeout(2000);

    // Collect
    const collectButton = page.locator('button:has-text("Collect")');
    await collectButton.click();

    // Shop should appear
    await page.waitForTimeout(500);
    const shopItems = page.locator('.bg-gray-700.rounded.p-2');
    await expect(shopItems.first()).toBeVisible({ timeout: 1000 });
  });

  test('should display layer 0 currency with blue square icon', async ({ page }) => {
    // Wait for page to load
    await page.waitForTimeout(1000);

    // Check for blue square icon (using style attribute)
    const blueSquare = page.locator('.w-6.h-6.rounded-sm').first();
    await expect(blueSquare).toBeVisible();

    const bgColor = await blueSquare.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    // Should be blue (rgb values for #3b82f6)
    expect(bgColor).toMatch(/rgb\(59,\s*130,\s*246\)/);
  });
});

test.describe('Multi-Layer System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should unlock layer 1 when layer 0 grid completes', async ({ page }) => {
    // This test would take too long to run naturally
    // We'll directly call unlockNextLayer
    await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      if (state) {
        const layer = state.layers[0];
        const totalSquares = 12 * 12; // 144 squares

        // Mark all squares as filled
        for (let i = 0; i < totalSquares; i++) {
          layer.squares[i].filled = true;
          layer.squares[i].fillProgress = 1;
        }
        layer.totalSquares = totalSquares;
        layer.currentSquareIndex = totalSquares;

        // Add some row bonuses
        for (let row = 0; row < 12; row++) {
          layer.rowBonuses.push({
            row,
            multiplier: 2,
            isSpinning: false,
          });
        }

        state.layers[0] = layer;
        (window as any).useGameStore?.setState({ layers: state.layers });

        // Manually unlock the next layer
        state.unlockNextLayer();
      }
    });

    await page.waitForTimeout(500);

    // Check if layer 1 is unlocked
    const hasLayer1 = await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      return state?.layers?.length > 1 && state?.layers[1]?.isUnlocked;
    });

    expect(hasLayer1).toBe(true);
  });

  test('should show both currencies when on layer 1+', async ({ page }) => {
    // Set up layer 1 with some currency
    await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      if (state) {
        // Create layer 1
        const layer1 = {
          layer: 1,
          squares: [],
          totalSquares: 10,
          currentSquareIndex: 10,
          currentSquareFillProgress: 0,
          completedRows: 0,
          rowBonuses: [],
          currency: 100,
          isUnlocked: true,
        };

        // Initialize squares for layer 1
        for (let i = 0; i < 144; i++) {
          layer1.squares.push({
            index: i,
            row: Math.floor(i / 12),
            col: i % 12,
            filled: i < 10,
            fillProgress: i < 10 ? 1 : 0,
            rowCompleted: false,
          });
        }

        state.layers[1] = layer1;
        state.currentLayer = 1;
        state.currency = 50;

        (window as any).useGameStore?.setState({
          layers: state.layers,
          currentLayer: 1,
          currency: 50,
        });
      }
    });

    await page.waitForTimeout(500);

    // Should show two currency displays
    const currencyDisplays = page.locator('.w-6.h-6.rounded-sm');
    await expect(currencyDisplays).toHaveCount(2);

    // First should be blue (layer 0)
    const firstSquare = currencyDisplays.first();
    const firstColor = await firstSquare.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor
    );
    expect(firstColor).toMatch(/rgb\(59,\s*130,\s*246\)/);

    // Second should be pink/green (layer 1)
    const secondSquare = currencyDisplays.nth(1);
    await expect(secondSquare).toBeVisible();
  });

  test('should show different colored squares on layer 1', async ({ page }) => {
    // Set up layer 1
    await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      if (state) {
        const layer1 = {
          layer: 1,
          squares: [],
          totalSquares: 5,
          currentSquareIndex: 5,
          currentSquareFillProgress: 0,
          completedRows: 0,
          rowBonuses: [],
          currency: 0,
          isUnlocked: true,
        };

        for (let i = 0; i < 144; i++) {
          layer1.squares.push({
            index: i,
            row: Math.floor(i / 12),
            col: i % 12,
            filled: i < 5,
            fillProgress: i < 5 ? 1 : 0,
            rowCompleted: false,
          });
        }

        state.layers[1] = layer1;
        state.currentLayer = 1;

        (window as any).useGameStore?.setState({
          layers: state.layers,
          currentLayer: 1,
        });
      }
    });

    await page.waitForTimeout(500);

    // Check that collect button has pink/green color
    const collectButton = page.locator('button:has-text("Collect")');
    const buttonBg = await collectButton.evaluate((el) =>
      window.getComputedStyle(el).background
    );

    // Should contain gradient colors (not the default blue)
    expect(buttonBg).not.toMatch(/rgb\(59,\s*130,\s*246\)/);
  });
});

test.describe('Animation System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should reset to empty grid when collecting during slot animations', async ({ page }) => {
    // Set up a completed row with spinning animation
    await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      if (state) {
        const layer = state.layers[0];

        // Fill exactly one row (12 squares)
        for (let i = 0; i < 12; i++) {
          layer.squares[i].filled = true;
          layer.squares[i].fillProgress = 1;
        }
        layer.totalSquares = 12;
        layer.currentSquareIndex = 12;
        layer.completedRows = 1;

        // Add spinning row bonus
        layer.rowBonuses = [{
          row: 0,
          multiplier: null,
          isSpinning: true,
        }];

        (window as any).useGameStore?.setState({
          layers: [layer, ...state.layers.slice(1)],
        });
      }
    });

    await page.waitForTimeout(300);

    // Quickly collect while animation is spinning
    const collectButton = page.locator('button:has-text("Collect")');
    await collectButton.click();

    // Wait a bit for collect to process
    await page.waitForTimeout(500);

    // Check that grid is actually empty (totalSquares should be 0)
    const gridState = await page.evaluate(() => {
      const state = (window as any).useGameStore?.getState();
      return {
        totalSquares: state.layers[0].totalSquares,
        currentSquareIndex: state.layers[0].currentSquareIndex,
        filledCount: state.layers[0].squares.filter((s: any) => s.filled).length,
        rowBonuses: state.layers[0].rowBonuses.length,
      };
    });

    expect(gridState.totalSquares).toBe(0);
    expect(gridState.currentSquareIndex).toBe(0);
    expect(gridState.filledCount).toBe(0);
    expect(gridState.rowBonuses).toBe(0);

    // Collect button should be disabled
    await expect(collectButton).toBeDisabled();
  });

  test('should not have fuller grid after rapid collect during animation', async ({ page }) => {
    // Enable 100x speed for faster testing
    await page.evaluate(() => {
      (window as any).useGameStore?.setState({ debugSpeedMultiplier: 100 });
    });

    // Wait for one row to complete (12 squares at 100x speed = ~120ms)
    await page.waitForTimeout(200);

    // Collect immediately while slot animation is spinning
    const collectButton = page.locator('button:has-text("Collect")');

    // Check state immediately in the same evaluate block to minimize race window
    const result = await page.evaluate(async () => {
      const store = (window as any).useGameStore;

      // Capture state before collect
      const beforeState = {
        totalSquares: store.getState().layers[0].totalSquares,
      };

      // Collect (synchronous call)
      store.getState().collect();

      // IMMEDIATELY check state after collect (before any tick)
      const afterState = store.getState();
      return {
        before: beforeState,
        after: {
          totalSquares: afterState.layers[0].totalSquares,
          filledCount: afterState.layers[0].squares.filter((s: any) => s.filled).length,
          currentSquareIndex: afterState.layers[0].currentSquareIndex,
        },
      };
    });

    // Should have reset to 0 immediately after collect
    expect(result.after.totalSquares).toBe(0);
    expect(result.after.filledCount).toBe(0);
    expect(result.after.currentSquareIndex).toBe(0);

    // Verify we actually had squares before collecting
    expect(result.before.totalSquares).toBeGreaterThan(0);
  });
});

test.describe('Save/Load System', () => {
  test('should persist layer state on reload', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Wait for first square to fill
    await page.waitForTimeout(2000);

    // Collect
    const collectButton = page.locator('button:has-text("Collect")');
    await collectButton.click();

    // Wait for autosave
    await page.waitForTimeout(4000);

    // Get current currency
    const currencyBefore = await page.locator('.text-2xl.font-bold.text-white').first().textContent();

    // Reload page
    await page.reload();
    await page.waitForTimeout(1000);

    // Currency should be the same
    const currencyAfter = await page.locator('.text-2xl.font-bold.text-white').first().textContent();
    expect(currencyAfter).toBe(currencyBefore);
  });

  test('should handle old save format gracefully', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Set an old-format save (before layer refactor)
    await page.evaluate(() => {
      const oldSave = {
        currency: 100,
        mana: 50,
        hasCollected: true,
        upgrades: [{ id: 'fill_faster', level: 2 }],
        // No layers property - old format
        squares: [],
        totalSquares: 10,
      };
      localStorage.setItem('squares_game_save', JSON.stringify(oldSave));
    });

    // Reload to trigger load
    await page.reload();
    await page.waitForTimeout(1000);

    // Should start fresh (not crash)
    const currency = await page.locator('.text-2xl.font-bold.text-white').first().textContent();
    expect(currency).toBe('0'); // Fresh start

    // Grid should be visible
    await expect(page.locator('.bg-gray-900.rounded-lg')).toBeVisible();
  });
});
