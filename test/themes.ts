import { readFile } from 'node:fs/promises'

export type Declarations = Map<string, string>

export interface ParsedTheme {
  theme: Declarations
  light: Declarations
  dark: Declarations
}

function declarations(block: string): Declarations {
  return new Map([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
}

function body(css: string, start: number): string {
  const open = css.indexOf('{', start)
  let depth = 0
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    if (css[i] === '}' && --depth === 0) return css.slice(open + 1, i)
  }
  throw new Error('unbalanced braces')
}

/** Splits a theme file into its `@theme` block and its light and dark color blocks. */
export async function readTheme(name: string): Promise<ParsedTheme> {
  const css = await readFile(new URL(`../src/themes/${name}.css`, import.meta.url), 'utf8')
  return {
    theme: declarations(body(css, css.indexOf('@theme {'))),
    light: declarations(body(css, css.indexOf('@variant light'))),
    dark: declarations(body(css, css.indexOf('@variant dark'))),
  }
}
