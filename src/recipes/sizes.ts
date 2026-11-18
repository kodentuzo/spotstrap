// The touch sizes from src/tokens.css and src/components/toggle.css, in points, for React
// Native, which has no rem and no ::after to enlarge a hit area. A test checks they match.

/** A control's height: buttons, inputs, list rows, tabs. */
export const control = 44
/** A compact control's height; its hit area is still 44. */
export const compact = 36
/** Space between two targets. */
export const gap = 12
/** A checkbox or radio box. */
export const box = 20
/** Apple's switch. */
export const switchSize = { width: 51, height: 31, thumb: 27 } as const

/** The hitSlop that grows a `size`-point target to `control` points on every side. */
export function slop(width: number, height = width) {
  const x = Math.max(0, Math.ceil((control - width) / 2))
  const y = Math.max(0, Math.ceil((control - height) / 2))
  return { top: y, bottom: y, left: x, right: x }
}
