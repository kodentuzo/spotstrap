// Builds the prebuilt outputs in dist/ from src/ (docs/decisions/0002, 0005):
//   dist/spotstrap.css        base layer, type scale and every spotstrap class, no theme
//   dist/themes/<name>.css    one theme as plain CSS; dark follows the system setting
//   dist/tokens.json          every theme's values, as oklch and hex

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { compile, optimize } from '@tailwindcss/node'
import { toHex } from './color.ts'
import { colors, fonts, radii, themes } from './contract.ts'

const root = new URL('..', import.meta.url)
const dist = new URL('dist/', root)

async function build(css: string, candidates: string[]): Promise<string> {
  const compiler = await compile(css, { base: root.pathname, onDependency: () => {} })
  return compiler.build(candidates)
}

/** Every class name spotstrap defines with `@utility` or as a theme text style. */
async function spotstrapClasses(): Promise<string[]> {
  const source = await readFile(new URL('src/tailwind.css', root), 'utf8')
  const utilities = [...source.matchAll(/@utility ([\w-]+)/g)].map((m) => m[1])
  const text = [...source.matchAll(/--text-([\w-]+?):/g)].map((m) => `text-${m[1]}`)
  return [...utilities, ...text]
}

// The layer order goes first in every file, so it holds whichever file a page loads first.
const header = (what: string) =>
  `/* spotstrap ${process.env.npm_package_version ?? ''}: ${what}. MIT. Built from src/; don't edit. */\n@layer theme, base, components, utilities;\n`

async function main() {
  await rm(dist, { recursive: true, force: true })
  await mkdir(new URL('themes/', dist), { recursive: true })

  const base = await build(
    `@layer theme, base, components, utilities;
     @import "tailwindcss/theme.css" layer(theme);
     @import "tailwindcss/preflight.css" layer(base);
     @import "tailwindcss/utilities.css" layer(utilities);
     @import "./src/tailwind.css";`,
    await spotstrapClasses(),
  )
  await writeFile(
    new URL('spotstrap.css', dist),
    header('base and classes') + optimize(base, { minify: false }).code,
  )

  const tokens: Record<string, ThemeTokens> = {}
  for (const name of themes) {
    tokens[name] = await themeTokens(name)
    await writeFile(
      new URL(`themes/${name}.css`, dist),
      header(`${name} theme`) + themeCss(tokens[name]),
    )
  }
  await writeFile(new URL('tokens.json', dist), `${JSON.stringify(tokens, null, 2)}\n`)
}

type ThemeTokens = Awaited<ReturnType<typeof themeTokens>>

/**
 * A theme as plain CSS for sites without Tailwind: fonts, radii and light colors on :root,
 * dark colors when the system is dark. Everything in the `theme` layer, like Tailwind's own
 * output, so spotstrap.css and the page's own CSS can override it.
 */
function themeCss(t: ThemeTokens): string {
  const lines = (values: Record<string, string>, indent: string) =>
    Object.entries(values)
      .map(([k, v]) => `${indent}--${k}: ${v};`)
      .join('\n')
  const colorsOf = (mode: 'light' | 'dark') =>
    Object.fromEntries(Object.entries(t[mode]).map(([k, v]) => [`color-${k}`, v.oklch]))
  return `@layer theme {
  :root {
${lines(t.declarations, '    ')}
${lines(colorsOf('light'), '    ')}
  }

  @media (prefers-color-scheme: dark) {
    :root {
${lines(colorsOf('dark'), '      ')}
    }
  }
}
`
}

/** Reads a theme's source: colors per mode (oklch and hex), fonts and radii. */
async function themeTokens(name: string) {
  const css = await readFile(new URL(`src/themes/${name}.css`, root), 'utf8')
  const block = (marker: string) => {
    const open = css.indexOf('{', css.indexOf(marker))
    return css.slice(open + 1, css.indexOf('}', open))
  }
  const read = (text: string) =>
    Object.fromEntries([...text.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]))
  const modeColors = (text: string) => {
    const values = read(text)
    return Object.fromEntries(
      colors.map((c) => {
        const oklch = values[`color-${c}`]
        return [c, { oklch, hex: toHex(oklch) }]
      }),
    )
  }
  const theme = read(block('@theme {'))
  return {
    declarations: Object.fromEntries(
      Object.entries(theme).filter(([k]) => !k.startsWith('color-')),
    ),
    light: modeColors(block('@variant light')),
    dark: modeColors(block('@variant dark')),
    fonts: Object.fromEntries(fonts.map((f) => [f, theme[`font-${f}`]])),
    radius: Object.fromEntries(
      radii.map((r) => [r || 'base', theme[r ? `radius-${r}` : 'radius']]),
    ),
  }
}

await main()
