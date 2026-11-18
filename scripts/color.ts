// oklch → sRGB, hex and WCAG contrast, for tokens.json and the contrast tests.

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

/** Parses `oklch(L C H)` or `oklch(L C H / A)`, with L and A as numbers or percentages. */
export function parseOklch(value: string): { l: number; c: number; h: number; a: number } {
  const m = value.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/,
  )
  if (!m) throw new Error(`not an oklch() color: ${value}`)
  return {
    l: Number(m[1]) / (m[2] ? 100 : 1),
    c: Number(m[3]),
    h: Number(m[4]),
    a: m[5] === undefined ? 1 : Number(m[5]) / (m[6] ? 100 : 1),
  }
}

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const gamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055)

/** Linear-light sRGB channels (0–1), clamped to the gamut, plus alpha. */
export function toLinearRgb(value: string): Rgba {
  const { l, c, h, a } = parseOklch(value)
  const hr = (h * Math.PI) / 180
  const A = c * Math.cos(hr)
  const B = c * Math.sin(hr)
  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.291485548 * B) ** 3
  return {
    r: clamp(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: clamp(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: clamp(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_),
    a,
  }
}

/** `#rrggbb`, or `#rrggbbaa` when the color isn't opaque. */
export function toHex(value: string): string {
  const { r, g, b, a } = toLinearRgb(value)
  const byte = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0')
  const hex = `#${byte(gamma(r))}${byte(gamma(g))}${byte(gamma(b))}`
  return a < 1 ? hex + byte(a) : hex
}

function luminance(value: string): number {
  const { r, g, b } = toLinearRgb(value)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2 contrast ratio between two opaque colors. */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
