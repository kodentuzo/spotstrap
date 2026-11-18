import { compile } from '@tailwindcss/node'

const root = new URL('..', import.meta.url).pathname

/** Compiles a Tailwind entry written as if it were a consumer's CSS file at the repo root. */
export async function compileCss(css: string, candidates: string[] = []): Promise<string> {
  const compiler = await compile(css, { base: root, onDependency: () => {} })
  return compiler.build(candidates)
}
