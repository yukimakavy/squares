import { LAYER_CONFIGS } from '../types/game';

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Generate color gradient based on layer and row
export const getSquareColor = (row: number, layer: number = 0, totalRows: number = 12): string => {
  // Get layer config
  const layerConfig = LAYER_CONFIGS[layer] || LAYER_CONFIGS[0];

  // Progress from 0 to 1 based on row
  const progress = row / (totalRows - 1);

  // Convert hex colors to RGB
  const startColor = hexToRgb(layerConfig.colorFrom);
  const endColor = hexToRgb(layerConfig.colorTo);

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);

  return `rgb(${r}, ${g}, ${b})`;
};

export const getSquareColorWithAlpha = (row: number, alpha: number, layer: number = 0, totalRows: number = 12): string => {
  // Get layer config
  const layerConfig = LAYER_CONFIGS[layer] || LAYER_CONFIGS[0];

  const progress = row / (totalRows - 1);

  // Convert hex colors to RGB
  const startColor = hexToRgb(layerConfig.colorFrom);
  const endColor = hexToRgb(layerConfig.colorTo);

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * progress);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * progress);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * progress);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
