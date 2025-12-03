/**
 * Format a number as currency with M/B/T suffixes
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "$14.24B" or "-" if null/undefined
 */
export function formatMoney(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '-';
  
  // For trillions
  if (Math.abs(value) >= 1.0e12) {
    return `$${(value / 1.0e12).toFixed(decimals)}T`;
  }
  // For billions
  if (Math.abs(value) >= 1.0e9) {
    return `$${(value / 1.0e9).toFixed(decimals)}B`;
  }
  // For millions
  if (Math.abs(value) >= 1.0e6) {
    return `$${(value / 1.0e6).toFixed(decimals)}M`;
  }
  return `$${value.toLocaleString()}`;
}

/**
 * Format a number with M/K suffixes (for volume, counts, etc.)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "1.23M" or "-" if null/undefined
 */
export function formatVolume(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '-';
  
  // For millions
  if (Math.abs(value) >= 1.0e6) {
    return `${(value / 1.0e6).toFixed(decimals)}M`;
  }
  // For thousands
  if (Math.abs(value) >= 1.0e3) {
    return `${(value / 1.0e3).toFixed(decimals)}K`;
  }
  return value.toLocaleString();
}

/**
 * Format a large number with M/B/T suffixes (without currency symbol)
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "14.24B" or "-" if null/undefined
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined) return '-';
  
  // For trillions
  if (Math.abs(value) >= 1.0e12) {
    return `${(value / 1.0e12).toFixed(decimals)}T`;
  }
  // For billions
  if (Math.abs(value) >= 1.0e9) {
    return `${(value / 1.0e9).toFixed(decimals)}B`;
  }
  // For millions
  if (Math.abs(value) >= 1.0e6) {
    return `${(value / 1.0e6).toFixed(decimals)}M`;
  }
  return value.toLocaleString();
}

