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
