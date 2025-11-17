import type { ComboSquare, ComboType } from '../types/game';

/**
 * Calculates the combo hand type from filled squares
 * This logic is centralized to avoid duplication between game logic and UI
 */
export function calculateComboType(squares: ComboSquare[]): ComboType | null {
  const filledSquares = squares.filter(s => s.filled);
  if (filledSquares.length === 0) return null;

  const colors = filledSquares.map(s => s.color).filter(c => c !== null);
  if (colors.length === 0) return null;

  const colorCounts = colors.reduce((acc, color) => {
    acc[color!] = (acc[color!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const counts = Object.values(colorCounts).sort((a, b) => b - a);

  // Determine best possible hand with current cards
  if (counts[0] === 5) return 'five_of_a_kind';
  if (counts[0] === 4) return 'four_of_a_kind';
  if (counts[0] === 3 && counts[1] === 2) return 'full_house';
  if (counts[0] === 3) return 'three_of_a_kind';
  if (counts[0] === 2 && counts[1] === 2) return 'two_pair';
  if (counts[0] === 2) return 'one_pair';
  return 'nothing';
}
