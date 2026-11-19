import assert from 'node:assert/strict'
import { test } from 'node:test'
import { compileCss } from './compile.ts'

const entry = `
@import "tailwindcss";
@import "./src/tailwind.css";
@import "./test/fixtures/dark-test-theme.css";
`

test('a theme follows the system color scheme by default', async () => {
  const css = await compileCss(entry, ['bg-background'])
  assert.match(
    css,
    /@media \(prefers-color-scheme: dark\)\s*\{\s*:root\s*\{\s*--color-background: oklch\(0 0 0\)/,
  )
  assert.match(css, /@media \(prefers-color-scheme: light\)/)
})

test('dark-class.css makes a theme follow the .dark class', async () => {
  const css = await compileCss(`${entry}\n@import "./src/dark-class.css";`, ['bg-background'])
  assert.doesNotMatch(css, /prefers-color-scheme: dark/)
  assert.match(css, /:root:where\(\.dark, \.dark \*\)\s*\{\s*--color-background: oklch\(0 0 0\)/)
})

test('the base layer colors the page from the theme', async () => {
  const css = await compileCss(entry)
  assert.match(css, /background-color: var\(--color-background\)/)
  assert.match(css, /font-family: var\(--font-sans\)/)
})

test('touch sizes are always in the output', async () => {
  const css = await compileCss(entry)
  assert.match(css, /--size-control: 2\.75rem/)
  assert.match(css, /--size-control-compact: 2\.25rem/)
  assert.match(css, /--gap-control: 0\.75rem/)
})

test('the type scale makes text utilities, and body text is 17px', async () => {
  const css = await compileCss(entry, ['text-large-title', 'text-headline', 'text-caption-2'])
  assert.match(css, /\.text-large-title\s*\{[^}]*font-size: var\(--text-large-title\)/)
  assert.match(
    css,
    /\.text-headline\s*\{[^}]*font-weight: var\(--tw-font-weight, var\(--text-headline--font-weight\)\)/,
  )
  assert.match(css, /--text-body: 1\.0625rem/)
})

test('controls built on the size tokens are 44px and 36px', async () => {
  const css = await compileCss(entry, ['h-(--size-control)', 'h-(--size-control-compact)'])
  assert.match(css, /height: var\(--size-control\)/)
  assert.match(css, /height: var\(--size-control-compact\)/)
})

test('appear treats a closed popover or dialog as hidden', async () => {
  const css = await compileCss(entry, ['appear'])
  assert.match(css, /\[popover\]:not\(:popover-open\)/)
  assert.match(css, /dialog:not\(\[open\]\)/)
})

test("shadcn's unprefixed variables point at the theme's tokens", async () => {
  const css = await compileCss(entry)
  for (const name of [
    'background',
    'foreground',
    'primary',
    'secondary',
    'muted-foreground',
    'sidebar-ring',
  ]) {
    assert.match(css, new RegExp(`--${name}: var\\(--color-${name}\\)`), name)
  }
})
