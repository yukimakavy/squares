// Format multiplier: show decimal only if not integer, use suffixes (k, m, b, t, etc.)
export const formatMultiplier = (value: number): string => {
  const suffixes = [
    { value: 1e12, suffix: 't' },  // trillion
    { value: 1e9, suffix: 'b' },   // billion
    { value: 1e6, suffix: 'm' },   // million
    { value: 1e3, suffix: 'k' },   // thousand
  ];

  for (const { value: threshold, suffix } of suffixes) {
    if (value >= threshold) {
      const scaled = value / threshold;
      // Show decimal only if needed
      return scaled % 1 === 0 ? `${scaled}${suffix}` : `${scaled.toFixed(1)}${suffix}`;
    }
  }

  // Show decimal only if not an integer
  return value % 1 === 0 ? `${value}` : `${value.toFixed(1)}`;
};
