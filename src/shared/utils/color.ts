/**
 * Blend two hex colors together
 * @param color1 - First hex color (e.g., "#ff0000")
 * @param color2 - Second hex color (e.g., "#0000ff")
 * @param ratio - Blend ratio (0 = color1, 1 = color2)
 * @returns Blended hex color
 */
export function blendColors(color1: string, color2: string, ratio: number): string {
  const r1 = Number.parseInt(color1.substring(1, 3), 16);
  const g1 = Number.parseInt(color1.substring(3, 5), 16);
  const b1 = Number.parseInt(color1.substring(5, 7), 16);

  const r2 = Number.parseInt(color2.substring(1, 3), 16);
  const g2 = Number.parseInt(color2.substring(3, 5), 16);
  const b2 = Number.parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Adjust the brightness of a hex color
 * @param color - Hex color (e.g., "#ff0000")
 * @param factor - Brightness factor (0 = black, 1 = original, >1 = brighter)
 * @returns Adjusted hex color
 */
export function adjustBrightness(color: string, factor: number): string {
  const r = Number.parseInt(color.substring(1, 3), 16);
  const g = Number.parseInt(color.substring(3, 5), 16);
  const b = Number.parseInt(color.substring(5, 7), 16);

  const newR = Math.round(Math.min(255, r * factor));
  const newG = Math.round(Math.min(255, g * factor));
  const newB = Math.round(Math.min(255, b * factor));

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}
