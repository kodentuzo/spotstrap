import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { test } from 'node:test'
import * as recipes from '../src/recipes/index.ts'
import { box, compact, control, gap, slop, switchSize } from '../src/recipes/sizes.ts'
import { compileCss } from './compile.ts'

const read = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')
const rem = (css: string, name: string) => {
  const m = css.match(new RegExp(`--${name}:\\s*([\\d.]+)rem`))
  assert.ok(m, `--${name}`)
  return Number(m[1]) * 16
}

test("the recipes' sizes match the CSS", async () => {
  const tokens = await read('src/tokens.css')
  assert.equal(rem(tokens, 'size-control'), control)
  assert.equal(rem(tokens, 'size-control-compact'), compact)
  assert.equal(rem(tokens, 'gap-control'), gap)
  const toggle = await read('src/components/toggle.css')
  const width = (utility: string) => {
    const block = toggle.slice(toggle.indexOf(`@utility ${utility} {`))
    return Number(block.match(/width: ([\d.]+)rem/)?.[1]) * 16
  }
  assert.equal(width('checkbox'), box)
  assert.equal(width('switch'), switchSize.width)
})

test('every pixel size in a recipe is one of the sizes', async () => {
  const source = await read('src/recipes/index.ts')
  const allowed = new Set([
    control,
    compact,
    gap,
    box,
    switchSize.width,
    switchSize.height,
    switchSize.thumb,
    control * 2 + 20,
  ])
  const used = [...source.matchAll(/\[(\d+)px\]/g)].map((m) => Number(m[1]))
  assert.ok(used.length > 10)
  assert.deepEqual(
    used.filter((n) => !allowed.has(n)),
    [],
  )
})

/** Every class string any recipe can return, across its options. */
function allClasses(): string[] {
  const on = [false, true]
  const out: recipes.Recipe[] = []
  for (const variant of [
    'default',
    'secondary',
    'outline',
    'ghost',
    'link',
    'destructive',
  ] as const)
    for (const size of ['default', 'compact'] as const)
      for (const icon of on)
        out.push(recipes.button({ variant, size, icon, pressed: true, disabled: true }))
  for (const s of on) {
    out.push(
      recipes.input({ focused: s, invalid: s, disabled: s, multiline: s }),
      recipes.input({ focused: s }),
    )
    out.push(
      recipes.checkbox({ checked: s, disabled: s }),
      recipes.radio({ checked: s, disabled: s }),
    )
    out.push(recipes.switchTrack({ checked: s, disabled: s }), recipes.choice({ disabled: s }))
    out.push(recipes.menuItem({ highlighted: s, destructive: s, disabled: s, compact: s }))
    out.push(recipes.menuItem({ highlighted: s }), recipes.tab({ selected: s, disabled: s }))
    out.push(recipes.label({ disabled: s }))
  }
  out.push(recipes.field(), recipes.fieldDescription(), recipes.fieldError(), recipes.toggleMark())
  out.push(recipes.switchThumb(), recipes.radioGroup(), recipes.menu(), recipes.tabList())
  out.push(
    recipes.sheet(),
    recipes.sheetTitle(),
    recipes.sheetDescription(),
    recipes.sheetActions(),
  )
  const strings = out.flatMap((r) => [r.className, (r as recipes.TextRecipe).textClassName ?? ''])
  return [...new Set(strings.join(' ').split(/\s+/).filter(Boolean))]
}

test('every class a recipe returns exists with native.css and a theme', async () => {
  const classes = allClasses()
  const css = await compileCss(
    // Uniwind brings the `light` variant themes use; this stands in for it.
    `@import "tailwindcss"; @import "./src/native.css"; @import "./src/themes/neutral.css";
     @custom-variant light (@media (prefers-color-scheme: light));`,
    classes,
  )
  const escaped = (c: string) => c.replace(/([[\].:/%])/g, '\\$1')
  const missing = classes.filter((c) => !css.includes(`.${escaped(c)}`))
  assert.deepEqual(missing, [])
})

test('small targets get a hitSlop up to 44 points', () => {
  assert.deepEqual(recipes.checkbox().hitSlop, { top: 12, bottom: 12, left: 12, right: 12 })
  assert.deepEqual(recipes.button({ size: 'compact' }).hitSlop, {
    top: 4,
    bottom: 4,
    left: 0,
    right: 0,
  })
  assert.deepEqual(recipes.button().hitSlop, slop(control))
  assert.deepEqual(recipes.switchTrack().hitSlop, { top: 7, bottom: 7, left: 0, right: 0 })
})

test('the built types work in a consumer', async () => {
  const dir = await mkdtemp(new URL('../node_modules/.spotstrap-types-', import.meta.url).pathname)
  try {
    await writeFile(
      `${dir}/use.ts`,
      `import { button, sizes } from '@kodentuzo/spotstrap/recipes'
       import { init } from '@kodentuzo/spotstrap/js'
       import { spotstrapMerge } from '@kodentuzo/spotstrap/merge'
       const m: object = spotstrapMerge
       const b: { className: string; textClassName: string } = button({ variant: 'outline' })
       const n: number = sizes.control
       const stop: () => void = init()
       export { b, n, stop, m }`,
    )
    await writeFile(
      `${dir}/tsconfig.json`,
      JSON.stringify({
        compilerOptions: {
          module: 'nodenext',
          strict: true,
          noEmit: true,
          lib: ['es2022', 'dom'],
          skipLibCheck: false,
        },
        files: ['use.ts'],
      }),
    )
    const tsc = new URL('../node_modules/.bin/tsc', import.meta.url).pathname
    execFileSync(tsc, ['-p', `${dir}/tsconfig.json`], { stdio: 'pipe' })
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
