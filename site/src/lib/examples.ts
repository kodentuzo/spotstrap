// Examples are HTML fragments in src/examples/<component>/<name>.html (docs/decisions/0006).
// Each one becomes a standalone page shown in an iframe, and its source is shown below it.
const raw = import.meta.glob('../examples/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** `button/variants` → the fragment's HTML. */
export const examples = new Map(
  Object.entries(raw).map(([path, html]) => [
    path.replace(/^\.\.\/examples\//, '').replace(/\.html$/, ''),
    html.trim(),
  ]),
)

export function example(name: string): string {
  const html = examples.get(name)
  if (html === undefined) throw new Error(`No example src/examples/${name}.html`)
  return html
}
