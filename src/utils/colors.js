/**
 * Interpolates between two hex colors.
 * @param {string} color1 - Start hex color (e.g. "#000000")
 * @param {string} color2 - End hex color (e.g. "#ffffff")
 * @param {number} factor - Interpolation factor (0 to 1)
 * @returns {string} - Interpolated hex color
 */
export function interpolateColor(color1, color2, factor) {
  if (factor === 0) return color1;
  if (factor === 1) return color2;

  const hex = (x) => {
    const s = x.toString(16);
    return s.length === 1 ? "0" + s : s;
  };

  const r1 = parseInt(color1.substring(1, 3), 16);
  const g1 = parseInt(color1.substring(3, 5), 16);
  const b1 = parseInt(color1.substring(5, 7), 16);

  const r2 = parseInt(color2.substring(1, 3), 16);
  const g2 = parseInt(color2.substring(3, 5), 16);
  const b2 = parseInt(color2.substring(5, 7), 16);

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  return "#" + hex(r) + hex(g) + hex(b);
}
