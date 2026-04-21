/**
 * Category color helpers.
 * A category color can be either:
 *  - a CSS variable name like "cat-electronics" (built-in tokens), or
 *  - a raw CSS color (hex, rgb, hsl, oklch, ...)
 *
 * Use these helpers everywhere a category color is rendered, so that both
 * legacy and custom colors render consistently.
 */

const KNOWN_TOKENS = new Set([
  "cat-electronics",
  "cat-contracts",
  "cat-insurance",
  "cat-health",
  "cat-services",
  "cat-other",
]);

function isToken(c: string | undefined | null): boolean {
  if (!c) return false;
  return KNOWN_TOKENS.has(c) || c.startsWith("cat-");
}

/** Returns a CSS color value usable in `background`/`color` properties. */
export function resolveCategoryColor(color: string | undefined | null): string {
  if (!color) return "var(--cat-other)";
  if (isToken(color)) return `var(--${color})`;
  return color;
}

/** Returns a translucent surface based on the category color. */
export function categorySurface(color: string | undefined | null, percent = 20): string {
  const c = resolveCategoryColor(color);
  return `color-mix(in oklab, ${c} ${percent}%, transparent)`;
}

/** Returns a slightly darker/foreground-friendly version for text on tinted surfaces. */
export function categoryForeground(color: string | undefined | null): string {
  return resolveCategoryColor(color);
}
